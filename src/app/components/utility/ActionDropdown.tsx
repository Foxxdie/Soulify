import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Cog6ToothIcon } from '@heroicons/react/16/solid';

function classNames(...classes:string[]) {
  return classes.filter(Boolean).join(' ')
}

enum SoulActions {
  EXPIRE = 'expire',
  LOG = 'log',
  SPEAK = 'speak',
  DISPATCH = 'dispatch',
  SCHEDULE_EVENT = 'scheduleEvent'
}

export type ActionOption = {
  name: string;
  type: SoulActions;
  label: string;
}

const options:ActionOption[] = [
  { name: 'Speak', label: 'Useful for coming up with options', type: SoulActions.SPEAK },
  { name: 'Log', label: 'Decide between multiple options', type: SoulActions.LOG },
  { name: 'Dispatch', label: 'Generate a chat output to be utilized', type: SoulActions.DISPATCH },
  { name: 'Schedule Event', label: 'Make your soul think about something', type: SoulActions.SCHEDULE_EVENT },
];

export default function ActionDropdown({ onSelect }: {onSelect: (option:ActionOption) => void}) {
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
