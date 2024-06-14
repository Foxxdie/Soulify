// MentalProcessNode.tsx
import React from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

const MentalProcess: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className="p-4 rounded bg-white shadow-md w-full h-full bg-opacity-50">
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={30} />
      <div className="text-center font-bold mb-2">{data.label}</div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-600 mx-auto z-30"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-600 mx-auto z-30"
      />
      {data.children}
    </div>
  );
};

export default MentalProcess;
