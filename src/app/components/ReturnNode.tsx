// CustomNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

const Return = ({ data }: { data:any }) => {
  return (
    <div 
      className="bg-red-500 p-4 flex flex-col justify-center items-center text-white" 
      >
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <div className="text-center">
        <strong>{data.label}</strong>
      </div>
    </div>
  );
};

export default Return;