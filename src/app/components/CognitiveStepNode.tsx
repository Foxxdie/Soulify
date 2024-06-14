import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { HandRaisedIcon, Cog6ToothIcon } from '@heroicons/react/16/solid';
import CognitiveStepDropdown, {CognitiveStepOption} from './utility/CognitiveStepDropdown';

// TODO: Check engine for types
export type SoulOptions = {
  stream: boolean;
  model: string;
}

export enum CognitiveStepHandles {
  INCOMING_WORKING_MEMORY = 'incomingWorkingMemory',
  OUTGOING_WORKING_MEMORY = 'outgoingWorkingMemory',
  RESULT = 'result'
}

export enum CognitiveSteps {
  BRAINSTORM = 'brainstorm',
  DECISION = 'decision',
  EXTERNAL_DIALOG = 'externalDialog',
  INTERNAM_MONOLOGUE = 'internalMonologue',
  MENTAL_QUERY = 'mentalQuery',
  SUMMARIZE = 'summarize',
  INSTRUCTION = 'instruction'
}


export type CognitiveStepData = {
  label: string;
  instructions: string;
  cognitiveStep: CognitiveSteps;
  choices?: string[];
  onChange: (evt:any, data:any) => void;
};

const CognitiveStep: React.FC<NodeProps<CognitiveStepData>> = (props) => {
  const { data, selected } = props;
  const [instructions, setInstructions] = useState<string>(data.instructions || "");
  const [choices, setChoices] = useState<string>(data.choices?.join(',') || "");
  
  const [selectedOption, setSelectedOption] = useState<CognitiveStepOption>({
    name: data.label || 'Cognitive Step' ,
    label: 'Select a cognitive step',
    type: data.cognitiveStep || CognitiveSteps.EXTERNAL_DIALOG,
    fields: ['instructions']
  });

  const handleSelect = (option:CognitiveStepOption) => {
    setSelectedOption(option);
    // Perform any other actions needed when an option is selected
    console.log('Selected option:', option);
    const e = {};
    data.onChange(e,{
      id: props.id,
      label: option.name,
      cognitiveStep: option.type
    })
  };
  const handleInstructionChange = useCallback((e:any) => {
    setInstructions(e.target.value);
    data.onChange(e,{
      id: props.id,
      instructions: e.target.value
    })
  } , [setInstructions]);

  const handleChoicesChange = useCallback((e:any) => {
    setChoices(e.target.value);
    data.onChange(e,{
      id: props.id,
      choices: e.target.value.split(',')
    })
  } , [setChoices]);


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
            id={CognitiveStepHandles.INCOMING_WORKING_MEMORY}
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
              id={CognitiveStepHandles.OUTGOING_WORKING_MEMORY}
              className="right-2 h-3 w-3 bg-green-500 border-green-950"
            />
            <label className="mr-4 text-xs text-gray-400 text-right">Working memory</label>
          </div>
          <div className="relative p-2 items-center flex gap-x-2 text-right justify-items-end">
            <Handle
              type="source"
              position={Position.Right}
              id={CognitiveStepHandles.RESULT}
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
              value={instructions}
              onChange={handleInstructionChange}
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
              value={choices}
              onChange={handleChoicesChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CognitiveStep;