import React, { useState, ReactNode } from "react";
import { ModalContext, ModalContextInterface } from "../contexts/ModalContext";

interface ModalContextProviderProps {
  children: ReactNode;
}

export const ModalContextProvider: React.FC<ModalContextProviderProps> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalContent2, setModalContent2] = useState<ReactNode | null>(null);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalContent2(null);
  };

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        modalContent,
        modalContent2,
        setModalContent,
        setModalContent2,
      }}
    >
      {/* <div className="Succulent-Card-Modal">
      <div className='Succulent-Card-Modal-inner'>
        <button onClick={closeModal} className="close-modal-btn">Close</button>
                  <p>{modalContent}</p>
                  {modalContent2}
                </div>
             </div>   */}

      {children}
    </ModalContext.Provider>
  );
};
