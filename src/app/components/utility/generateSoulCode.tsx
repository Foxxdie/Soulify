import React, { useState } from 'react';
import {
  Node,
  Edge,
  MarkerType,
} from "reactflow";
import { MentalProcessNode } from '../data';
import { CognitiveStepHandles } from '../nodes/CognitiveStepNode';
import { get } from 'http';
import { useSoulEngine } from '@/app/providers/SoulProvider';
import { DocumentDuplicateIcon, ArrowUpOnSquareIcon } from '@heroicons/react/16/solid';

type Variables = [string, string];

function createMentalProcessNode(id: string, nodes: Node[], edges: Edge[]): MentalProcessNode {
  // const rootNode = nodes.find(node => node.id === id && node.type === 'mentalProcess');
  // if (!rootNode) {
  //   throw new Error(`Could not find root node with id '${id}'`);
  // }

  // Extract nodes and edges related to the mental process
  // const relevantNodes = nodes.filter(node => node.parentId === id);
  // const relevantEdges = edges.filter(edge => {
  //   // Check if the edge's source is any of the relevant node IDs
  //   return relevantNodes.some(node => edge.source === node.id); 
  // });
  const relevantNodes = nodes;
  const relevantEdges = edges;

  const result = {
    id,
    rootNode: {},
    nodes: relevantNodes, 
    edges: relevantEdges,
  };

  console.log("Mental Process Node: ", result);

  return result;
}


function SoulCodeCopyButton({ nodes, edges }: { nodes: Node[], edges: Edge[] }) {
  const [isCopied, setIsCopied] = useState(false);
  const { doc, updateFile, getFileContent } = useSoulEngine();

  const handleCopyClick = () => {
    const mentalProcess = createMentalProcessNode('speaks', nodes, edges);
    const generatedCode = generateMentalProcessCode(mentalProcess);
    // const generatedCode = generateSoulCode(nodes, edges);
    navigator.clipboard.writeText(generatedCode)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => console.error("Failed to copy: ", err));
  };

  const handleUploadClick = () => {
    const mentalProcess = createMentalProcessNode('speaks', nodes, edges);
    const generatedCode = generateMentalProcessCode(mentalProcess);
    const file = 'soul/initialProcess.ts';
    console.log("Updating File: ", file);
    updateFile(file, generatedCode); 
  }

  return (
    <>
      <button 
        onClick={handleCopyClick} 
        disabled={isCopied}
        className="border-2 border-white flex items-center px-2 py-1 rounded shadow-lg bg-gray-600 text-white"
      >
        <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
        {isCopied ? "Copied!" : "Copy Soul"}
      </button>
      <button 
        onClick={handleUploadClick}
        className="border-2 border-white flex items-center px-2 py-1 rounded shadow-lg bg-gray-600 text-white"
      >
        <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />
        Upload Soul
      </button>
    </>
  );
}

const createImportStatements = (imports: Set<string>): string => {
  let code = 'import { MentalProcess, useActions } from "@opensouls/engine";\n';
  imports.forEach(importName => {
    code += `import ${importName} from "./cognitiveSteps/${importName}.js";\n`;
  });
  code += '\n';
  return code;
}


const generateVariableNames = (existingNames: Variables[], cognitiveStep:any): [string, string] => {
  let count = 1;
  const step = cognitiveStep.data.cognitiveStep;

  let memoryName = withize(step);
  let resultName = `${step}Result`;

  // if [memoryName, resultName] already exists, append count, and check again. repeat until unique
  while (existingNames.some(([mem, res]) => mem === memoryName || res === resultName)) {
    memoryName = `${withize(step)}${count}`;
    resultName = `${step}Result${count}`;
    count++;
  }

  return [memoryName, resultName];
}


const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
const withize = (str: string): string => `with${capitalizeFirstLetter(str)}`;

function generateMentalProcessCode(mentalProcess: MentalProcessNode): string {
  const { nodes, edges, id } = mentalProcess;
  const mentalProcessName = id;

  // Extract relevant information from nodes
  const cognitiveSteps = nodes.filter(node => node.type === 'cognitiveStep');
  const actions = nodes.filter(node => node.type === 'action');

  // get all cognitive step name from step.data.cognitiveStep. MUST BE UNIQUE
  const cognitiveStepNames = cognitiveSteps.map(step => step.data.cognitiveStep);
  const imports = new Set(cognitiveStepNames);
  const variables: Variables[] = [];
  
  let code = createImportStatements(imports);

  // Generate the function signature
  code += `const ${mentalProcessName}: MentalProcess = async ({ workingMemory }) => {`;

  // Generate code for importing actions
  code += `\n  const { ${actions.map(action => action.data.action).join(', ')} } = useActions(); \n`;

  function generateStepCode(nodeId: string, currentWorkingMemory: string): string {
    let stepCode = '';
    const node = nodes.find(node => node.id === nodeId);
  
    if (!node) {
      console.error(`Node with ID ${nodeId} not found!`);
      return stepCode;
    }
  
    if (node.type === 'cognitiveStep') {
      const stepName = node.data.cognitiveStep;
      const instructions = node.data.instructions;
      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
  
      const [memoryName, resultName] = generateVariableNames(variables, node);
      variables.push([memoryName, resultName]);
  
      stepCode += `\n  const [${memoryName}, ${resultName}] = await ${stepName}(`;
      stepCode += `\n    ${currentWorkingMemory},`;
      stepCode += instructions ? `\n    "${instructions}",` : `\n    null,`;
      stepCode += `\n  );\n`;
  
      // Generate action code immediately after cognitive step based on RESULT edge
      const resultEdge = outgoingEdges.find(edge => edge.sourceHandle === CognitiveStepHandles.RESULT);
      if (resultEdge) {
        const actionNode = nodes.find(node => node.id === resultEdge.target);
        if (actionNode && actionNode.type === 'action') {
          stepCode += `\n  ${actionNode.data.action}(${resultName});\n`;
        }
      }
  
      // Recursively generate code for other outgoing edges 
      outgoingEdges.forEach(edge => {
        if (edge.sourceHandle !== CognitiveStepHandles.RESULT) { // Skip RESULT edge (already handled)
          const targetNode = nodes.find(node => node.id === edge.target);
          if (targetNode) {
            stepCode += generateStepCode(targetNode.id, memoryName); 
          }
        }
      });
  
    } else if (node.type === 'action') {
      // Action code is now generated directly after the cognitive step
    } else if (node.type === 'return') {
      stepCode += `\n  return ${currentWorkingMemory};\n`;
    }
  
    return stepCode;
  }

  // Find starting nodes (connected to workingMemory)
  const startingNodeIds = edges
    .filter(edge => edge.source.includes('workingMemory'))
    .map(edge => edge.target);

  console.log('Starting Node IDs:', startingNodeIds)

  startingNodeIds.forEach(startingNodeId => {
    code += generateStepCode(startingNodeId, 'workingMemory');
  });


  // Close the function
  code += `\n};`;

  code += `\n\nexport default ${mentalProcessName};`

  return code;
}

export default SoulCodeCopyButton;