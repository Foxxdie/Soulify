"use client";

import Image from "next/image";
import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from 'reactflow';
import { ArrowDownIcon } from "@heroicons/react/16/solid";
import 'reactflow/dist/style.css';
import FlowChart from "./components/Flow2";
import MentalProcessModal from "./components/modals/MentalProcessModal";
import Sidebar from "./components/Sidebar";
import { SoulProvider } from "./providers/SoulProvider";




export default function Home() {

  const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  ];
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (params:any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );


  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <SoulProvider>

        <div className="flex w-full h-full">
          <FlowChart />
          <Sidebar />
        </div>

      </SoulProvider>
    </main>
  );
}
