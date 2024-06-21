// CustomNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

const WorkingMemory = ({ data }: { data:any }) => {
  return (
    <div 
      className="bg-green-800 px-4 py-2 rounded flex flex-col justify-center items-center border-green-300 border-2" 
      >
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
      <div className="text-center flex flex-col text-green-300">
        <strong>{data.label}</strong>
        <label className="text-xs italic">(Start)</label>
      </div>
    </div>
  );
};

export default WorkingMemory;