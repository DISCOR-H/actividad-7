import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Storage } from '@ionic/storage';

interface StorageContextType {
  storage: Storage | null;
}

export const StorageContext = createContext<StorageContextType>({ storage: null });

interface StorageProviderProps {
  children: ReactNode;
}

export const StorageProvider: React.FC<StorageProviderProps> = ({ children }) => {
  const [storage, setStorage] = useState<Storage | null>(null);

  useEffect(() => {
    const initStorage = async () => {
      try {
        const newStorage = new Storage();
        console.log('NewStorage del storageContexts.tsx: ', newStorage);
        await newStorage.create();
        setStorage(newStorage);
      } catch (error) {
        console.error('Error al inicializar Storage:', error);
        console.log('error del useEffect: ', error);
      }
    };

    initStorage();
  }, []);

  return (
    <StorageContext.Provider value={{ storage }}>
      {children}
    </StorageContext.Provider>
  );
};
