import { useState, ReactNode } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';

interface CollapsibleProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children, defaultOpen=false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`border-b border-gray-500 text-black ${isOpen ? 'grow' : ''}`}>
      <button
        className="flex justify-between items-center w-full p-4 text-left focus:outline-none bg-gray-500"
        onClick={toggleOpen}
      >
        <h2 className="text-white">{title}</h2>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDownIcon className="h-8 w-8 text-gray-400"  />
        </span>
      </button>
      <div className={`overflow-hidden transition-max-height duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default Collapsible;