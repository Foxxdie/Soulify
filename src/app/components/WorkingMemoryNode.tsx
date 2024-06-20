// CustomNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

const WorkingMemory = ({ data }: { data:any }) => {
  return (
    <div 
      className="bg-green-500  p-4 flex flex-col justify-center items-center text-white" 
      >
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
      <div className="text-center">
        <strong>{data.label}</strong>
      </div>
    </div>
  );
};

export default WorkingMemory;