import React, { createContext, useState, ReactNode } from "react";

export interface ModalContextInterface {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  modalContent: string | null;
  modalContent2: ReactNode | null;
  setModalContent: (content: string | null) => void;
  setModalContent2: (content: ReactNode | null) => void;
}

export const ModalContext = createContext<ModalContextInterface>({
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
  modalContent: "",
  modalContent2: null,
  setModalContent: () => {},
  setModalContent2: () => {},
});

interface ModalContextProviderProps {
  children: ReactNode;
}

// export const ModalContextProvider: React.FC<ModalContextProviderProps> = ({ children }) => {
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//     const [modalContent, setModalContent] = useState<string | null>(null);
//       const [modalContent2, setModalContent2] = useState<ReactNode  | null>(null);

//     const openModal = () => {
//     setIsModalOpen(true);
//   }

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setModalContent(null);
//   }

//   return (
//    <ModalContext.Provider value={{ isModalOpen,openModal, closeModal, modalContent, setModalContent, setModalContent2 }}>
//   {children}
// </ModalContext.Provider>
//   );
// };
