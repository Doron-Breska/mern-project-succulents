import React from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

const SucculentCardModal = ({ isOpen, closeModal, children }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
      <div className="Succulent-Card-Modal">
          <div className='Succulent-Card-Modal-inner'>
          <button onClick={closeModal} className="close-modal-btn">Close</button>
          {children}
          </div>
    </div>
  );
};

export default SucculentCardModal;





