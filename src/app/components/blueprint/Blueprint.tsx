import React, { useState, useEffect } from 'react';
import FileSimulator from '../utility/FileSimulator';
import { useSoulEngine } from '@/app/providers/SoulProvider';

// Additional Node props can be accessed via the `data` prop
const verbosity_options = [
  'concise',
  'brief',
  'standard',
  'detailed',
  'verbose',
];

const profanity_options = [
  'clean',
  'mild',
  'moderate',
  'frequent',
  'explicit',
];

type SoulENVVars = {
  entityName: string;
  verbosity: string;
  profanity: string;
}


const Blueprint: React.FC = (props) => {
  const [name, setName] = useState<string>('Daedalus');
  const [details, setDetails] = useState<string>(''); // soulDetails
  const [verbosity, setVerbosity] = useState<string>('standard');
  const [profanity, setProfanity] = useState<string>('mild');
  const [content, setContent] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const { doc, updateFile, getFileContent, initialize } = useSoulEngine();

  // log doc with useEffect
  useEffect(() => {
    console.log('doc:', doc);
  }, [doc]);

  const generateBlueprint = () => {
    const title = `You are modeling the mind of ${name}`;

    const knobs = `your speaking style is also modified by the following knobs:
    - Your verbosity when responding should be ${verbosity}
    - Your profanity level should be ${profanity}`;

    const blueprint = `
    ${title}
    
    ${details}
      
    ${knobs}`;

    return blueprint;
  }

  const handleTest = () => {
    console.log('TEst!')
    // const file = 'soul/default.env.ts';
    // const file = 'soul/Samantha.md';
    // const t = getFileContent(file);
    // console.log(t)
    initialize();
  }
  const handleGet = () => {
    const file = 'soul/default.env.ts';
    const t = getFileContent(file);
    console.log(t)
  }

  const handleBlueprintUpdate = () => {
    const newBlueprint = generateBlueprint();
    console.log(newBlueprint)
    setContent(newBlueprint);
    setFilePath('soul/{{entityName}}.md');
  };

  const handleENVUpdate = () => {
    const envVars = {
      entityName: name,
      verbosity: verbosity,
      profanity: profanity,
    }
    setContent(JSON.stringify(envVars, null, 2));
    setFilePath('soul/default.env.ts');

  }


  return (
   
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 text-black px-4">
        <div className="col-span-full">
          <label htmlFor="entityName" className="block text-sm font-medium leading-6 text-gray-900">
            Entity Name
          </label>
          <div className="mt-2">
            <input
              name="entityName"
              id="entityName"
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              aria-describedby="entityName-description"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500" id="entityName-description">
            The name you want your soul to embody
          </p>
        </div>
        <div className="col-span-full">
          <label htmlFor="soulDetails" className="block text-sm font-medium leading-6 text-gray-900">
            Soul Details
          </label>
          <div className="mt-2">
            <textarea
              rows={4}
              name="soulDetails"
              id="soulDetails"
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              aria-describedby="entityName-description"
              defaultValue={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="verbosity" className="block text-sm font-medium leading-6 text-gray-900">
            Verbosity
          </label>
          <select
            id="verbosity"
            name="verbosity"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => setVerbosity(e.target.value)}
            value={verbosity}
          >
            {verbosity_options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500" id="entityName-description">
            How verbose responses should be
          </p>
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="profanity" className="block text-sm font-medium leading-6 text-gray-900">
            Profanity
          </label>
          <select
            id="profanity"
            name="profanity"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => setProfanity(e.target.value)}
            value={profanity}
          >
            {profanity_options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500" id="entityName-description">
            How much profanity you want your soul to use
          </p>
        </div>
        <div className="col-span-full">
          <button 
            className="px-4 py-2 border bg-red-300 rounded"
            onClick={() => handleBlueprintUpdate()}>
            UPDATE SOUL
          </button>
          <button 
            className="px-4 py-2 border bg-red-300 rounded"
            onClick={() => handleENVUpdate()}>
            UPDATE ENV
          </button>
          <button 
            className="px-4 py-2 border bg-red-300 rounded"
            onClick={() => handleTest()}>
            TEST
            </button>
            <button 
            className="px-4 py-2 border bg-red-300 rounded"
            onClick={() => handleGet()}>
            GET
          </button>
          {/* <FileSimulator content={content} filePath='soul/Samantha.md' /> */}
        </div>
      </div>

  
 
  );
};

export default Blueprint;