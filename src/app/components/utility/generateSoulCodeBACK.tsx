import React, { useState } from 'react';
import {
  Node,
  Edge,
  MarkerType,
} from "reactflow";
import { MentalProcessNode } from '../data';
import { CognitiveStepHandles } from '../CognitiveStepNode';

function createMentalProcessNode(id: string, nodes: Node[], edges: Edge[]): MentalProcessNode {
  const rootNode = nodes.find(node => node.id === id && node.type === 'mentalProcess');
  if (!rootNode) {
    throw new Error(`Could not find root node with id '${id}'`);
  }

  // Extract nodes and edges related to the mental process
  const relevantNodes = nodes.filter(node => node.parentId === id);
  const relevantEdges = edges.filter(edge => {
    // Check if the edge's source is any of the relevant node IDs
    return relevantNodes.some(node => edge.source === node.id); 
  });

  const result = {
    id,
    rootNode,
    nodes: relevantNodes,
    edges: relevantEdges,
  };

  console.log("Mental Process Node: ", result);

  return result;
}


function SoulCodeCopyButton({ nodes, edges }: { nodes: Node[], edges: Edge[] }) {
  const [isCopied, setIsCopied] = useState(false);

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

  return (
    <button onClick={handleCopyClick} disabled={isCopied}>
      {isCopied ? "Copied!" : "Copy SOUL Code"}
    </button>
  );
}

const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
const withize = (str: string): string => `with${capitalizeFirstLetter(str)}`;

function generateMentalProcessCode(mentalProcess: MentalProcessNode): string {
  const { rootNode, nodes, edges } = mentalProcess;
  const mentalProcessName = rootNode.id;

  // Extract relevant information from nodes
  const cognitiveSteps = nodes.filter(node => node.type === 'cognitiveStep');
  const actions = nodes.filter(node => node.type === 'action');

  // Generate the function signature
  let code = `const ${mentalProcessName}: MentalProcess = async ({ workingMemory }) => {`;

  // Generate code for importing actions
  code += `\n  const { ${actions.map(action => action.data.action).join(', ')} } = useActions(); \n`;

  // Create a map to store the working memory variable for each cognitive step
  const workingMemoryMap = new Map<string, string>();

  // Initialize the starting working memory
  workingMemoryMap.set(rootNode.id, 'workingMemory');

  // Generate code for cognitive steps
  cognitiveSteps.forEach(step => {
    const stepName = step.data.cognitiveStep;
    const instructions = step.data.instructions;
    const outgoingEdges = edges.filter(edge => edge.source === step.id);

    // Extract target node ids for outgoing edges
    const targetNodeIds = outgoingEdges.map(edge => edge.target);

    // Identify the edge that sends the output to the mental process
    const outputEdge = outgoingEdges.find(edge => edge.sourceHandle === CognitiveStepHandles.RESULT);

    // Determine the working memory variable for this step
    let currentWorkingMemory = workingMemoryMap.get(step.id) || 'workingMemory';

    // Generate code for the cognitive step function call
    // **Key Change:** Use 'withX' and 'result' for return values
    code += `\n  const [${withize(stepName)}, ${stepName}Result] = await ${stepName}(`;
    code += `\n    ${currentWorkingMemory},`;
    if (instructions) {
      code += `\n    "${instructions}",`;
    } else {
      code += `\n    null,`;
    }
    // Determine if a stream is needed
    // if (outputEdge) {
    //   code += `\n    { stream: true, model: "gpt-4-0125-preview" }`;
    // } else {
    //   code += `\n    {}`;
    // }
    code += `\n  );\n`;

    // Generate code for calling actions based on output edges
    outgoingEdges.forEach(edge => {
      const targetNode = nodes.find(node => node.id === edge.target);
      if (targetNode && targetNode.type === 'action') {
        const actionName = targetNode.data.action;
        // Use the appropriate variable based on source handle
        code += `\n  ${actionName}(${edge.sourceHandle === CognitiveStepHandles.RESULT ? stepName + 'Result' : 'stream'});\n`; 
      }
    });

    // Update the working memory for subsequent steps
    outgoingEdges.forEach(edge => {
      const targetNode = nodes.find(node => node.id === edge.target);
      if (targetNode) {
        workingMemoryMap.set(targetNode.id, withize(stepName)); // Use the updated working memory
      }
    });
  });

  // Generate the return statement
  const returnNode = nodes.find(node => node.type === 'return');
  if (returnNode) {
    const returnEdge = edges.find(edge => edge.target === returnNode.id);
    if (returnEdge) {
      console.log('Return Edge:', returnEdge)
      console.log('MAP:', workingMemoryMap)
      const returnVariable = workingMemoryMap.get(returnEdge.target);
      if (returnVariable) {
        code += `\n  return ${returnVariable};`; 
      } else {
        // Handle the case where the return variable is not found (error handling)
        console.error('Return variable not found in working memory map.');
      }
    } else {
      // Handle the case where the return edge is not found (error handling)
      console.error('Return edge not found.');
    }
  } else {
    // Handle the case where the return node is not found (error handling)
    console.error('Return node not found.');
  }

  // Close the function
  code += `\n};`;

  code += `\n\nexport default ${mentalProcessName};`

  return code;
}

export default SoulCodeCopyButton;