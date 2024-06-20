// CustomNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

const WorkingMemory = ({ data }: { data:any }) => {
  return (
    <div 
      className="bg-green-500 w-14 h-[300px] p-4 flex flex-col justify-center items-center text-white" 
      // style={{ padding: 10, border: '1px solid #777', borderRadius: 5 }}
      >
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
      <div className="-rotate-90 w-[300px] text-center">
        <strong>{data.label}</strong>
      </div>
    </div>
  );
};

export default WorkingMemory;