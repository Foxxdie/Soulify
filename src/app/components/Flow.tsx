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
import MentalProcess from "./MentalProcessNode";
import CognitiveStep, { CognitiveSteps } from "./CognitiveStepNode";
import Action, { SoulActions } from "./ActionNode";
import Return from "./ReturnNode";
import WorkingMemory from "./WorkingMemoryNode";
import ResizeableNodeSelected from "./utility/ResizeableNodeSelected";
import CustomNode from "./CustomNode";
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
      resizeableNodeSelected: ResizeableNodeSelected,
      customNode: CustomNode,
    }),
    []
  );
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onChange = (event:any, changedNode:any) => {
    console.log("Event: ", event);
    console.log("ChangesNode: ", changedNode);
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
        id: "speaks",
        type: "mentalProcess",
        data: { label: null },
        position: { x: 100, y: 100 },
        style: {
          width: 700,
          height: 300,
        },
      },
      {
        id: "speaks-workingMemory",
        type: "workingMemory",
        data: {
          label: "Working Memory",
          draggable: false,
        },
        parentId: "speaks",
        extent: "parent",
        position: { x: 0, y: 0 },
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
        parentId: "speaks",
        extent: "parent",
        position: { x: 110, y: 50 },
      },
      {
        id: "speaks-returns",
        type: "return",
        data: {
          label: "New Working Memory",
          draggable: false,
        },
        parentId: "speaks",
        extent: "parent",
        position: { x: 644, y: 0 },
      },
      {
        id: "speak",
        type: "action",
        data: {
          label: "Speak",
          action: SoulActions.SPEAK,
          onChange,
        },
        parentId: "speaks",
        extent: "parent",
        position: { x: 400, y: 150 },
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


  // const onEdgesChange: OnEdgesChange = useCallback(
  //   (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  //   [setEdges]
  // );
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
    if (!activeGroup) return;

    const newNode: Node = {
      id: `cognitiveStep-${nodes.length}`,
      type: "cognitiveStep",
      data: { 
        label: "Brainstorm" ,
        instructions: "Think of three new topics to write about.",
        cognitiveStep: CognitiveSteps.BRAINSTORM,
        onChange,
      },
      parentId: activeGroup,
      extent: "parent",
      position: { x: 50, y: 50 + nodes.length * 50 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addActionNode = () => {
    if (!activeGroup) return;

    const newNode: Node = {
      id: `action_${nodes.length}`,
      type: "action",
      data: { 
        label: "Speak",
        action: SoulActions.SPEAK,
        onChange, 
      },
      parentId: activeGroup,
      extent: "parent",
      position: { x: 100, y: 50 + nodes.length * 50 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addMentalProcessNode = () => {
    const newGroupNode: Node = {
      id: `mentalProcess_${nodes.length}`,
      type: "mentalProcess",
      data: { label: `New Mental Process ${nodes.length}` },
      position: { x: 100, y: 100 + nodes.length * 50 },
      style: {
        width: 700,
        height: 300,
      },
    };

    const workingMemoryNode: Node = {
      id: `workingMemory_${nodes.length}`,
      type: "workingMemory",
      data: {
        label: "Working Memory",
        description: "Generates a working memory based on instructions",
        draggable: false,
        deleteable: false,
      },
      parentId: newGroupNode.id,
      extent: "parent",
      position: { x: 0, y: 0 },
    };

    const returnNode: Node = {
      id: `returns_${nodes.length}`,
      type: "return",
      data: {
        label: "New Working memory",
        description: "Returns the working memory",
        draggable: false,
      },
      parentId: newGroupNode.id,
      extent: "parent",
      position: { x: 644, y: 0 },
    };

    const edge: Edge = {
      id: `e_${workingMemoryNode.id}_${returnNode.id}`,
      source: workingMemoryNode.id,
      target: returnNode.id,
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
      style: {
        strokeWidth: 2,
      },
      zIndex: 10,
    };

    setNodes((nds) => nds.concat(newGroupNode, workingMemoryNode, returnNode));
    setEdges((eds) => eds.concat(edge));
  };

  return (
    <>
      <div className="p-4 flex gap-x-2 absolute top-2 left-2 z-50">
        <button
          className="bg-red-700 text-white px-4 py-2 rounded"
          onClick={addCognitiveStepNode}
        >
          Add Cognitive Step
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addActionNode}
        >
          Add Action
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={addMentalProcessNode}
        >
          Add Mental Process
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
        // isValidConnection={isValidConnection}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </>
  );
}
