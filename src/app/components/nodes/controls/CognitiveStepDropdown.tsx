import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Cog6ToothIcon } from '@heroicons/react/16/solid';

function classNames(...classes:string[]) {
  return classes.filter(Boolean).join(' ')
}

export type CogniteiveStepFieldTypes = 'instructions' | 'choices';

export type CognitiveStepOption = {
  name: string;
  label: string;
  type: CognitiveSteps;
  fields: CogniteiveStepFieldTypes[];
}

enum CognitiveSteps {
  BRAINSTORM = 'brainstorm',
  DECISION = 'decision',
  EXTERNAL_DIALOG = 'externalDialog',
  INTERNAM_MONOLOGUE = 'internalMonologue',
  MENTAL_QUERY = 'mentalQuery',
  SUMMARIZE = 'summarize',
  INSTRUCTION = 'instruction'
}

const options:CognitiveStepOption[] = [
  { name: 'Brainstorm', label: 'Useful for coming up with options', fields: ['instructions'], type: CognitiveSteps.BRAINSTORM },
  { name: 'Decision', label: 'Decide between multiple options', fields: ['instructions', 'choices'], type: CognitiveSteps.DECISION },
  { name: 'External Dialog', label: 'Generate a chat output to be utilized', fields: ['instructions'],  type: CognitiveSteps.EXTERNAL_DIALOG },
  { name: 'Internal Monologue', label: 'Make your soul think about something', fields: ['instructions'], type: CognitiveSteps.INTERNAM_MONOLOGUE },
  { name: 'Mental Query', label: 'Determine the truthfulness of something', fields: ['instructions'], type: CognitiveSteps.MENTAL_QUERY },
  { name: 'Summarize', label: 'Summarize the current state of the conversation', fields: ['instructions'], type: CognitiveSteps.SUMMARIZE },
  { name: 'Instruction', label: 'Low level instructions for the soul', fields: ['instructions'], type: CognitiveSteps.INSTRUCTION},
];

export default function CognitiveStepDropdown({ onSelect }: {onSelect: (option:CognitiveStepOption) => void}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton>
          <Cog6ToothIcon className="h-4 w-4 text-gray-400" />
        </MenuButton>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
                <MenuItem key={option.name}>
                  {({ active }) => (
                    <a
                      onClick={() => onSelect(option)}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-2 py-1 text-sm'
                      )}
                    >
                      <div className="flex-col">
                        <h4>{option.name}</h4>
                        <label className="text-xs text-gray-400 text-right leading-3">
                          {option.label}
                        </label>
                      </div>
                    </a>
                  )}
                </MenuItem>
              )
            )}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
