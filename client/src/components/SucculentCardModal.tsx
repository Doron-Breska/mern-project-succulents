import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  modalContent: string | null;
  modalContent2: ReactNode | null;
}

const SucculentCardModal = ({ isOpen, closeModal, modalContent,modalContent2 ,children  }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
      <div className="Succulent-Card-Modal">
      <div className='Succulent-Card-Modal-inner'>
        <button onClick={closeModal} className="close-modal-btn">Close</button>
        {modalContent && <p>{modalContent}</p>}
         {modalContent2 && <>{modalContent2}</> }
        {children}
      </div>
    </div>
  );
};

export default SucculentCardModal;





