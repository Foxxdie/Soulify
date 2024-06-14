import {
  Node,
  Edge,
  MarkerType,
} from "reactflow";

import { SoulActions } from "../ActionNode";
import { CognitiveStepHandles, CognitiveSteps } from "../CognitiveStepNode";

export type MentalProcessNode = {
  id: string;
  rootNode: Node;
  nodes: Node[];
  edges: Edge[];
}

export const extractAllActions = (mentalProcessNode: MentalProcessNode) => {

  // get all unique action nodes
  const actionNodes = mentalProcessNode.nodes.filter((node) => node.type === "action");

  // remove 


}

const emptyMentalProcess: MentalProcessNode = {
  id: "speaks",
  rootNode: {
    id: "speaks",
    type: "mentalProcess",
    data: { label: null },
    position: { x: 100, y: 100 },
    style: {
      width: 700,
      height: 300,
    },
  },
  nodes: [
    {
      id: "externalDialog",
      type: "cognitiveStep",
      data: {
        label: "externalDialog",
        cognitiveStep: CognitiveSteps.EXTERNAL_DIALOG,
        instructions: "Talk to the user trying to gain trust and learn about their inner world."
      },
      parentId: "speaks", // associate with mental process
      extent: "parent", // lock the node to within the mental process
      position: { x: 110, y: 50 }, // set position relative to mental process
    },
    {
      id: "speak",
      type: "action",
      data: {
        label: "speak",
        action: SoulActions.SPEAK,
      },
      parentId: "speaks",
      extent: "parent",
      position: { x: 400, y: 150 },
      style: { width: 200, height: 75 },
    }
  ],
  edges: [
    {
      id: "e1-2",
      source: "workingMemory",
      target: "externalDialog",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 10,
        height: 10,
      },
      style: {
        strokeWidth: 4,
      },
      animated: true,
      zIndex: 10,
    },
    {
      id: "e1-3",
      source: "externalDialog",
      sourceHandle: "newWorkingMemory",
      target: "returns",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 10,
        height: 10,
      },
      style: {
        strokeWidth: 4,
      },
      zIndex: 10,
    },
    {
      id: "e2-4",
      source: "externalDialog",
      sourceHandle: "output",
      target: "speaks",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 10,
        height: 10,
      },
      style: {
        strokeWidth: 4,
      },
      zIndex: 10,
    }
  ],
};


export const initialNodes: Node[] = [
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
      instructions: "Talk to the user trying to gain trust and learn about their inner world."
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
      label: "speak",
      action: SoulActions.SPEAK,
    },
    parentId: "speaks",
    extent: "parent",
    position: { x: 400, y: 150 },
    style: { width: 200, height: 75 },
  },
];

export const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "speaks-workingMemory",
    target: "cognitiveStep-1",
    targetHandle: CognitiveStepHandles.INCOMING_WORKING_MEMORY,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: '#15803d'
    },
    style: {
      strokeWidth: 4,
      stroke: '#15803d'
    },
    animated: true,
    zIndex: 10,
  },
  {
    id: "e1-3",
    source: "cognitiveStep-1",
    sourceHandle: CognitiveStepHandles.OUTGOING_WORKING_MEMORY,
    target: "speaks-returns",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: '#15803d'
    },
    style: {
      strokeWidth: 4,
      stroke: '#15803d'
    },
    zIndex: 10,
  },
  {
    id: "e2-4",
    source: "cognitiveStep-1",
    sourceHandle: CognitiveStepHandles.RESULT,
    target: "speak",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: '#1d4ed8'
    },
    style: {
      strokeWidth: 4,
      stroke: '#1d4ed8'
    },
    zIndex: 10,
  },
];