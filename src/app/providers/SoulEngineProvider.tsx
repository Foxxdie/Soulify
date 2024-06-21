import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { HocuspocusProvider, HocuspocusProviderWebsocket } from "@hocuspocus/provider";
import { getYjsDoc, syncedStore } from "@syncedstore/core";

// Define the shape of our synced document
const docShape = {
  files: {} as Record<string, string> // relativePath, content
}

// Create a typed synced store
const syncedFilesDoc = () => syncedStore(docShape);

// Define the context shape
interface SoulEngineContextType {
  getFile: (path: string) => string | null;
  updateFile: (path: string, content: string) => void;
  isReady: boolean;
}

const SoulEngineContext = createContext<SoulEngineContextType | null>(null);

interface SoulEngineProviderProps {
  children: React.ReactNode;
  local?: boolean;
}

const getConnectedWebsocket = (
  organizationSlug: string,
  id: string,
  local: boolean,
  debug: boolean,
) => {
  const urlpath = debug ? "debug-chat" : "debug-chat";
  const url = local
    ? `ws://localhost:4000/${organizationSlug}/${urlpath}}`
    : `wss://servers.souls.chat/${organizationSlug}/${urlpath}`;

  return new HocuspocusProviderWebsocket({ url });
};

export const SoulEngineProvider: React.FC<SoulEngineProviderProps> = ({
  children,
  local = false,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [doc, setDoc] = useState(syncedFilesDoc());
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_SOUL_ENGINE_API_KEY;
  const organizationSlug = process.env.NEXT_PUBLIC_SOUL_ENGINE_ORGANIZATION;
  const id = process.env.NEXT_PUBLIC_SOUL_ENGINE_ID;
  const blueprint = process.env.NEXT_PUBLIC_SOUL_ENGINE_BLUEPRINT;

  useEffect(() => {
    if (!apiKey || !organizationSlug || !id || !blueprint) {
      console.error("Missing required environment variables");
      return;
    }

    const url = local
      ? `http://localhost:3000/chats/${organizationSlug}/${blueprint}/${id}`
      : `https://souls.chat/chats/${organizationSlug}/${blueprint}/${id}`;
    console.log(`Debug chat is available at: ${url}`);

    const setupProvider = async () => {
      const docName = `soul-source-doc.${organizationSlug}.${blueprint}`;
      const newDoc = syncedFilesDoc();
      
      const socket = getConnectedWebsocket(organizationSlug, id, local, false);

      const newProvider = new HocuspocusProvider({
        document: getYjsDoc(newDoc),
        name: docName,
        token: apiKey,
        websocketProvider: socket,
        onSynced: async () => {
          // Check if the document is empty and initialize if necessary
          if (Object.keys(newDoc.files).length === 0) {
            try {
              const response = await fetch('/api');
              const initialFiles = await response.json();
              
              getYjsDoc(newDoc).transact(() => {
                for (const file of initialFiles) {
                  newDoc.files[file.relativePath] = file.content;
                }
              });
              
              newProvider.sendStateless(JSON.stringify({
                event: "codeSync",
                data: "",
              }));
            } catch (error) {
              console.error("Failed to initialize document:", error);
            }
          }
          
          setIsReady(true);
        },
        onAuthenticationFailed: ({ reason }) => console.error("Authentication failed", reason),
      });

      setDoc(newDoc);
      setProvider(newProvider);

      return () => {
        newProvider.destroy();
        socket.destroy();
      };
    };

    setupProvider();
  }, [apiKey, organizationSlug, id, blueprint, local]);

  const contextValue = useMemo(() => ({
    getFile: (path: string) => doc.files[path] || null,
    updateFile: (path: string, content: string) => {
      if (provider) {
        getYjsDoc(doc).transact(() => {
          doc.files[path] = content;
        });
        provider.sendStateless(JSON.stringify({
          event: "codeSync",
          data: "",
        }));
      }
    },
    isReady,
  }), [doc, provider, isReady]);

  return (
    <SoulEngineContext.Provider value={contextValue}>
      {children}
    </SoulEngineContext.Provider>
  );
};

export const useSoulEngine = () => {
  const context = useContext(SoulEngineContext);
  if (!context) {
    throw new Error('useSoulEngine must be used within a SoulEngineProvider');
  }
  return context;
};