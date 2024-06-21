// CustomNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

const Return = ({ data }: { data:any }) => {
  return (
    <div 
      className="bg-green-800 px-4 py-2 flex flex-col justify-center items-center rounded border-green-300 border-2" 
      >
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <div className="text-center flex flex-col text-green-300">
        <strong>{data.label}</strong>
        <label className="text-xs italic">(End)</label>
      </div>
    </div>
  );
};

export default Return;