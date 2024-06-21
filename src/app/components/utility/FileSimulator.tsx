import React, { useState, useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { syncedStore, getYjsValue, getYjsDoc } from '@syncedstore/core'; // Import getYjsValue

interface FileSimulatorProps {
  local?: boolean;
  filePath: string;
  content: string;
}
type File = {
  relativePath: string;
  content: string;
  removed: boolean;
}

const docShape = {
  files: {} as Record<string,string> // relativePath, conent
}

const syncedFilesDoc = () => syncedStore(docShape)

const FileSimulator: React.FC<FileSimulatorProps> = ({ 
  local,
  filePath,
  content,
}) => {
  // const [code, setCode] = useState<string>('Initial content'); 
  const providerRef = useRef<HocuspocusProvider | null>(null);

  // const handleCodeChange = (newCode: string) => {
  //   setCode(newCode);
  // };

  const updateRemoteFile = () => {
    const provider = providerRef.current;
    if (!provider) {
      console.error('HocuspocusProvider not connected!');
      return;
    }
    const files: File[] = [];

    const doc = provider.document;
    const relativeFilePath = filePath // 'soul/Samantha.md'; // Example - make this dynamic

    // Get the store 
    const store = syncedStore({ files: {} as Record<string, string> }, doc); 
    // const testCode = "You are modeling the mind of Bob. Bob loves to talk about pickles, and is always insertin pickle-related jokes into conversations"

    getYjsDoc(store).transact(() => {
      console.log(doc.get('files'))
      console.log(store.files[relativeFilePath])
      // if (store.files[relativeFilePath]) {
        store.files[relativeFilePath] = content;
      // }
      // const filesMap = doc.get('files'); 
      // filesMap.set(relativeFilePath, testCode);
    });

    // Send the custom event
    provider.sendStateless(JSON.stringify({
      event: "codeSync",
      data: "", // You can add data if needed
    }));
  };


  useEffect(() => {
      // set the organization slug and blueprint from ENV. Should these be defined elsewhere?
      const organizationSlug = process.env.NEXT_PUBLIC_SOUL_ENGINE_ORGANIZATION as string;
      const blueprint = process.env.NEXT_PUBLIC_SOUL_ENGINE_BLUEPRINT as string;
      const apiKey = process.env.NEXT_PUBLIC_SOUL_ENGINE_APIKEY as string;
      const id = process.env.NEXT_PUBLIC_SOUL_ENGINE_ID as string;

      const url = local ? `http://localhost:3000/chats/${organizationSlug}/${blueprint}/${id}` : `https://souls.chat/chats/${organizationSlug}/${blueprint}/${id}`
      console.log(`Debug chat is available at: ${url}`)
      // Set the document name
      const docName = `soul-source-doc.${organizationSlug}.${blueprint}`
      const doc = syncedFilesDoc();
      
      const websocketUrl = local 
        ? `ws://localhost:4000/${organizationSlug}/debug-chat` 
        : `wss://servers.souls.chat/${organizationSlug}/debug-chat`;

    const provider = new HocuspocusProvider({
        url: websocketUrl,
        name: docName,
        token: apiKey,
        document: getYjsDoc(doc),
        onSynced: () => {
          console.log('Yjs document synced with server!');
        },
        async onAuthenticationFailed({ reason }) {
          console.error("authentication failed", reason)
    
        },
        onStateless: async ({ payload }) => {
          console.log('Stateless event received:', payload);
          console.log(new Date(), payload)
        },
      });

    providerRef.current = provider;

    return () => {
      provider.destroy(); 
    };
  }, [local]);

  return (
    <div className="text-black">
      <button className="border bg-red-200" onClick={updateRemoteFile}>Update souls/person.md</button> 
    </div>
  ); 
};

export default FileSimulator;


