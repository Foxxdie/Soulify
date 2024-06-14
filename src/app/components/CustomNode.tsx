import React, { useState } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { HandRaisedIcon, Cog6ToothIcon } from '@heroicons/react/16/solid';
import CognitiveStepDropdown, {CognitiveStepOption} from './utility/CognitiveStepDropdown';

const CustomNode: React.FC<NodeProps> = ({ data, selected }) => {
  const [selectedOption, setSelectedOption] = useState<CognitiveStepOption>({
    name: 'Cognitive Step' ,
    label: 'Select a cognitive step',
    fields: ['instructions']
  });

  const handleSelect = (option:CognitiveStepOption) => {
    setSelectedOption(option);
    // Perform any other actions needed when an option is selected
    console.log('Selected option:', option);
  };

  return (
    <div className="border-2 border-indigo-500 rounded-lg shadow-lg bg-gray-800 text-white h-full">
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={270} minHeight={210} />
      <div className="border-b-4 border-indigo-500 flex items-center mb-2 px-2 py-1 justify-between">
        <svg className="h-3 w-3 fill-gray-400" viewBox="0 0 6 6" aria-hidden="true">
          <circle cx={3} cy={3} r={3} />
        </svg>
        <h3 className="text-gray-400">
          {selectedOption.name}
        </h3>
        <div>
          {/* <Cog6ToothIcon className="h-4 w-4 text-gray-400" /> */}
          <CognitiveStepDropdown onSelect={handleSelect} />
        </div>
      </div>

      {/* <div className="relative p-2 items-center flex gap-x-2">
        <Handle
          type="target"
          position={Position.Left}
          id="workingMemory"
          className="left-2 h-3 w-3 bg-green-500 border-green-950"
        />
        <label className="ml-4 text-xs text-gray-400">Working memory</label>
      </div> */}

      <div className="flex justify-between items-start">
        {/* INPUTS / LEFT SIDE */}
        <div className="relative px-2 items-center flex gap-x-2">
          <Handle
            type="target"
            position={Position.Left}
            id="workingMemory"
            className="left-2 h-3 w-3 bg-green-500 border-green-950"
          />
          <label className="ml-4 text-xs text-gray-400">Working memory</label>
        </div>
        {/* OUTPUTS / RIGHT SIDE */}
        <div className="flex-col">
          <div className="relative px-2 items-center flex gap-x-2">
            <Handle
              type="source"
              position={Position.Right}
              id="newWorkingMemory"
              className="right-2 h-3 w-3 bg-green-500 border-green-950"
            />
            <label className="mr-4 text-xs text-gray-400 text-right">Working memory</label>
          </div>
          <div className="relative p-2 items-center flex gap-x-2 text-right justify-items-end">
            <Handle
              type="source"
              position={Position.Right}
              id="output"
              className="right-2 h-3 w-3 bg-blue-500 border-green-950"
            />
            <label className="mr-4 text-xs text-gray-400 text-right grow">LLM Output</label>
          </div>
        </div>
      </div>



      <div className="px-2">
        {selectedOption.fields.includes('instructions') && (
          <>
            <label htmlFor="comment" className="block text-xs font-light leading-6">
              Instructions
            </label>
            <textarea
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white text-xs"
              placeholder="Instruction details..."
            />
          </>
          
        )}

        {selectedOption.fields.includes('choices') && (
          <>
          <label htmlFor="comment" className="block text-xs font-light leading-6">
            Choices
          </label>
            <textarea
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white text-xs"
              placeholder="['option 1', 'option 2', 'option 3']"
            />
          </>
        )}
      </div>
      
      {/* <Handle
        type="target"
        position={Position.Left}
        id="clip"
        style={{ background: '#555' }}
        className="w-3 h-3 bg-gray-600"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="conditioning"
        style={{ background: '#555' }}
        className="w-3 h-3 bg-gray-600"
      /> */}
    </div>
  );
};

export default CustomNode;