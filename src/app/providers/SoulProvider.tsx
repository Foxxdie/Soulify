import React, { createContext, useState, useEffect, useRef, useContext, ReactNode } from 'react';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { syncedStore, getYjsDoc } from '@syncedstore/core';
import path from 'path';
import fs from 'fs';

// Define the shape of your context 
interface SoulEngineContextType {
  doc: ReturnType<typeof syncedStore<{ files: Record<string, string> }>>,
  updateFile: (filePath: string, content: string) => void;
  getFileContent: (filePath: string) => string | undefined;
  initialSync: boolean;
}

// Create the context
const SoulEngineContext = createContext<SoulEngineContextType | null>(null);

// Create a provider component 
export const SoulProvider: React.FC<{ local?: boolean, children: ReactNode }> = ({ 
  local = false,
  children, 
}) => {
  const providerRef = useRef<HocuspocusProvider | null>(null);
  const docShape = { files: {} as Record<string, string> };
  const doc = syncedStore(docShape, new Y.Doc()); 
  const [initialSync, setInitialSync] = useState(false);

  /**
   * Attempt to retrieve a given file from the Yjs document store
   * @param filePath 
   * @returns 
   */
  const getFileContent = (filePath: string): string | undefined => {
    console.log('DOC!@')
    console.log(doc);
    // Safely access the file content
    return doc.files[filePath]; 
  };

  /**
   * Update a file in the Yjs document store. This will trigger a sync event.
   * Files that do not exist will get created.
   * @param filePath 
   * @param content 
   * @returns 
   */
  const updateFile = (filePath: string, content: string) => {
    const provider = providerRef.current;
    if (!provider) {
      console.error('HocuspocusProvider not connected!');
      return;
    }

    getYjsDoc(doc).transact(() => {
      doc.files[filePath] = content;
    });

    provider.sendStateless(JSON.stringify({
      event: 'codeSync',
      data: '',
    }));
  };

  useEffect(() => {
    const init = async () => {
      try {
        const organizationSlug = process.env.NEXT_PUBLIC_SOUL_ENGINE_ORGANIZATION as string;
        const blueprint = process.env.NEXT_PUBLIC_SOUL_ENGINE_BLUEPRINT as string;
        const apiKey = process.env.NEXT_PUBLIC_SOUL_ENGINE_APIKEY as string;
        const id = process.env.NEXT_PUBLIC_SOUL_ENGINE_ID as string;

        const url = local
          ? `http://localhost:3000/chats/${organizationSlug}/${blueprint}/${id}`
          : `https://souls.chat/chats/${organizationSlug}/${blueprint}/${id}`;
        console.log(`Debug chat is available at: ${url}`);

        const docName = `soul-source-doc.${organizationSlug}.${blueprint}`;

        const websocketUrl = local
          ? `ws://localhost:4000/${organizationSlug}/debug-chat`
          : `wss://servers.souls.chat/${organizationSlug}/debug-chat`;

        const provider = new HocuspocusProvider({
          url: websocketUrl,
          name: docName,
          token: apiKey,
          document: getYjsDoc(doc), // Provide the Y.Doc instance here
          onSynced: () => {
            console.log('Yjs document synced with server!');
          },
          onAuthenticationFailed: ({ reason }) => {
            console.error('Authentication failed:', reason);
          },
          onStateless: async ({ payload }) => {
            console.log('Stateless event received:', payload);
            setInitialSync(true);
          },
        });

        providerRef.current = provider;
        const response = await fetch('/api');
        console.log('Response: ', response)
        if (response.ok) {
          const filesData = await response.json();
          getYjsDoc(doc).transact(() => {
            for (const file of filesData) {
              console.log('uploading file: ', file.relativePath)
              doc.files[file.relativePath] = file.content;
            }
          });

          provider.sendStateless(JSON.stringify({
            event: "codeSync",
            data: "",
          }));
        } else {
          console.error('Error fetching files from API route:', response.status);
        }

      } catch (error) {
        console.error('Error initializing soul engine:', error);
      }
    }
    
    init();

    return () => {
      providerRef.current?.destroy();
    };
  }, [local]);

  // Provide the context values
  const contextValue = { doc, updateFile, getFileContent, initialSync };

  return (
    <SoulEngineContext.Provider value={contextValue}>
      {children}
    </SoulEngineContext.Provider>
  );
};

// Create a custom hook to easily consume the context
export const useSoulEngine = () => {
  const context = useContext(SoulEngineContext);
  if (context === null) {
    throw new Error('useSoulEngine must be used within a SoulProvider');
  }
  return context;
};