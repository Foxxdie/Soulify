import React, { useState } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { HandRaisedIcon, Cog6ToothIcon } from '@heroicons/react/16/solid';
import ActionDropdown, {ActionOption} from './controls/ActionDropdown';


// Additional Node props can be accessed via the `data` prop
export enum SoulActions {
  EXPIRE = 'expire',
  LOG = 'log',
  SPEAK = 'speak',
  DISPATCH = 'dispatch',
  SCHEDULE_EVENT = 'scheduleEvent'
}

export type ActionData = {
  label: string;
  action: SoulActions;
  onChange: (evt:any, data:any) => void;
};


const CognitiveStep: React.FC<NodeProps<ActionData>> = (props) => {
  const { data, selected } = props;
  const [selectedOption, setSelectedOption] = useState<ActionOption>({
    name: data.label || 'Action',
    type: data.action || SoulActions.SPEAK,
    label: 'Select an action',
  });

  const handleSelect = (option:ActionOption) => {
    setSelectedOption(option);
    // Perform any other actions needed when an option is selected
    console.log('Selected option:', option);
    const e = {};
    data.onChange(e,{
      id: props.id,
      label: option.name,
      action: option.type
    })
  };

  return (
    <div className="border-2 border-blue-300 rounded bg-blue-700 text-blue-200 h-full">
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={200} minHeight={75} />
      <div className="border-b-4 border-blue-300 flex items-center mb-2 px-2 py-1 justify-between">
        <svg className="h-3 w-3 fill-gray-400" viewBox="0 0 6 6" aria-hidden="true">
          <circle cx={3} cy={3} r={3} />
        </svg>
        <h3 className="text-blue-200">
          {selectedOption.name}
        </h3>
        <div>
          <ActionDropdown onSelect={handleSelect} />
        </div>
      </div>


      <div className="flex justify-between items-start">
        {/* INPUTS / LEFT SIDE */}
        <div className="relative px-2 items-center flex gap-x-2">
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="left-2 h-3 w-3 bg-blue-500 border-green-950"
          />
          <label className="ml-4 text-xs text-blue-200">Input</label>
        </div>
      
      </div>
    </div>
  );
};

export default CognitiveStep;