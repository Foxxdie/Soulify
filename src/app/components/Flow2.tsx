import React, { useMemo, useState, useCallback, useLayoutEffect, useEffect } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  Node,
  Edge,
  MarkerType,
  Connection,
  useEdgesState,
  useNodesState,
} from "reactflow";
import MentalProcess from "./nodes/MentalProcessNode";
import CognitiveStep, { CognitiveSteps } from "./nodes/CognitiveStepNode";
import Action, { SoulActions } from "./nodes/ActionNode";
import Return from "./nodes/ReturnNode";
import WorkingMemory from "./nodes/WorkingMemoryNode";
import SoulCodeCopyButton from "./utility/generateSoulCode";

import { initialEdges, initialNodes } from "./data";



export default function FlowChart() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const nodeTypes = useMemo(
    () => ({
      mentalProcess: MentalProcess,
      cognitiveStep: CognitiveStep,
      action: Action,
      return: Return,
      workingMemory: WorkingMemory,
    }),
    []
  );
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onChange = (event:any, changedNode:any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === changedNode.id) {
          // Instructions update
          if (changedNode.instructions) {
            return {
              ...node,
              data: {
                ...node.data,
                instructions: changedNode.instructions,
              },
            };
          } else if (changedNode.action) {
            // action update
            return {
              ...node,
              data: {
                ...node.data,
                action: changedNode.action,
                label: changedNode.label,
              },
            };

          } else {
            // node change update
            return {
              ...node,
              data: {
                ...node.data,
                label: changedNode.label,
                cognitiveStep: changedNode.cognitiveStep,
              },
            };
          }
        }

        return {
          ...node,
        };
      })
    );
  };

  // Setup update logic for nodes
  useEffect(() => {
    

    setNodes([
      {
        id: "speaks-workingMemory",
        type: "workingMemory",
        data: {
          label: "Working Memory",
          draggable: false,
        },
        position: { x: 70, y: 150 },
      },
      {
        id: "cognitiveStep-1",
        type: "cognitiveStep",
        data: {
          label: "External Dialog",
          cognitiveStep: CognitiveSteps.EXTERNAL_DIALOG,
          instructions: "Talk to the user trying to gain trust and learn about their inner world.",
          onChange,
        },
        position: { x: 300, y: 180 },
      },
      {
        id: "speaks-returns",
        type: "return",
        data: {
          label: "New Working Memory",
          draggable: false,
        },
        position: { x: 644, y: 150 },
      },
      {
        id: "speak",
        type: "action",
        data: {
          label: "Speak",
          action: SoulActions.SPEAK,
          onChange,
        },
        position: { x: 650, y: 350 },
        style: { width: 200, height: 75 },
      },
    ]);

    setEdges(initialEdges);
  }, []);


  /**
   * Ensure that edges only connect to valid locations. This will
   * get called on every drag event where an edge interacts with a
   * node Handle.
   * @param connection
   * @returns @boolean
   */
  const isValidConnection = (connection:Connection) => {
    // Working memory can only forward to working memory
    if (connection.sourceHandle === 'newWorkingMemory') {
      return connection.targetHandle === 'workingMemory';
    }
    // outputs can only connect to actions (for now)
    if (connection.sourceHandle === 'output') {
      return connection.targetHandle === 'input';
    }

    return false;
  }


  const onNodesDelete = (nodesToDelete: Node[]) => {
    return [];
    console.log("Nodes to delete: ", nodesToDelete)
    const exclude = ['return', 'workingMemory'];
    setNodes((nds) => nds.filter((node) => !nodesToDelete.includes(node) && !exclude.includes(node.type as string)));
  }

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => {
      console.log("Connection: ", connection)
      // default to WM Green
      let color = '#15803d';
      if (connection.sourceHandle === 'result') {
        // update to Action Blue
        color = '#1d4ed8'
      }

      let newEdge = {
        ...connection,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: color
        },
        style: {
          strokeWidth: 4,
          stroke: color
        },
        animated: true,
        zIndex: 10,
      }
      return addEdge(newEdge, eds)
    }),
    [setEdges]
  );
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.type === "mentalProcess") {
        setActiveGroup(node.id);
      }
    },
    []
  );

  const addCognitiveStepNode = () => {

    const newNode: Node = {
      id: `cognitiveStep-${nodes.length}`,
      type: "cognitiveStep",
      data: { 
        label: "Brainstorm" ,
        instructions: "Think of three new topics to write about.",
        cognitiveStep: CognitiveSteps.BRAINSTORM,
        onChange,
      },
      position: { x: 50, y: 50 + nodes.length * 50 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addActionNode = () => {

    const newNode: Node = {
      id: `action_${nodes.length}`,
      type: "action",
      data: { 
        label: "Speak",
        action: SoulActions.SPEAK,
        onChange, 
      },
      style: { width: 200, height: 75 },
      position: { x: 100, y: 50 + nodes.length * 50 },
    };
    setNodes((nds) => nds.concat(newNode));
  };


  return (
    <>
      <div className="p-4 flex gap-x-2 absolute top-2 left-2 z-50">
        <button
          className="px-4 py-2 border-2 border-indigo-500 rounded-lg shadow-lg bg-gray-800 text-white"
          onClick={addCognitiveStepNode}
        >
          Add Cognitive Step
        </button>
        <button
          className="px-4 py-2 border-2 border-blue-300 rounded bg-blue-700 text-blue-200"
          onClick={addActionNode}
        >
          Add Action
        </button>
        
        <SoulCodeCopyButton nodes={nodes} edges={edges} />
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        // onNodesDelete={onNodesDelete}
        // isValidConnection={isValidConnection}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </>
  );
}
