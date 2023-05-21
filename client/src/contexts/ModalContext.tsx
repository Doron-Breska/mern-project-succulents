import React, { createContext, useState, ReactNode } from 'react';

interface ModalContextInterface {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalContext = createContext<ModalContextInterface | null>(null);

interface ModalContextProviderProps {
    children: ReactNode;
}

export const ModalContextProvider: React.FC<ModalContextProviderProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
        <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
            {children}
        </ModalContext.Provider>
    );
};
