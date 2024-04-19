import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import Modal from '../../../components/lib/modal/Modal';
import { ModalContext } from './ModalContext';

interface IModalContextProvider {
   children: ReactNode;
}

export default function ModalContextProvider(props: IModalContextProvider): JSX.Element {
   const { children } = props;
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalContent, setModalContent] = useState(<></>);
   const [modalHeader, setModalHeader] = useState(``);

   function handleCloseModal(): void {
      setIsModalOpen(false);
      setModalContent(<></>);
      setModalHeader(``);
   }

   function toggleModal(show: boolean): void {
      if (show) setIsModalOpen(true);
      else handleCloseModal();
   }

   const contextMemo = useMemo(
      () => ({
         setModalContent,
         setModalHeader,
         modalContent,
         isModalOpen,
         toggleModal,
      }),
      [setModalContent, setModalHeader, modalContent, isModalOpen, toggleModal],
   );

   return (
      <>
         <ModalContext.Provider value={contextMemo}>{children}</ModalContext.Provider>
         <Modal isOpen={isModalOpen} onClose={() => handleCloseModal()} header={modalHeader}>
            {modalContent}
         </Modal>
      </>
   );
}
