// CustomNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

const Return = ({ data }: { data:any }) => {
  return (
    <div 
      className="bg-red-500 w-14 h-[300px] p-4 flex flex-col justify-center items-center text-white" 
      // style={{ padding: 10, border: '1px solid #777', borderRadius: 5 }}
      >
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <div className="rotate-90 w-[300px] text-center">
        <strong>{data.label}</strong>
      </div>
      <Handle type="source" position={Position.Left} style={{ background: '#FFF' }} />
    </div>
  );
};

export default Return;