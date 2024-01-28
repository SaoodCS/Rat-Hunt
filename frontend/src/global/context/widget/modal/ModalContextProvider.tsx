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
   const [modalZIndex, setModalZIndex] = useState<number | undefined>(undefined);

   function handleCloseModal(): void {
      setIsModalOpen(false);
      setModalContent(<></>);
      setModalHeader(``);
      setModalZIndex(undefined);
   }

   function toggleModal(show: boolean): void {
      if (show) setIsModalOpen(true);
      else handleCloseModal();
   }

   const contextMemo = useMemo(
      () => ({
         setModalContent,
         setModalHeader,
         setModalZIndex,
         modalContent,
         modalZIndex,
         isModalOpen,
         toggleModal,
      }),
      [
         setModalContent,
         setModalHeader,
         modalContent,
         setModalZIndex,
         modalZIndex,
         isModalOpen,
         toggleModal,
      ],
   );

   return (
      <>
         <ModalContext.Provider value={contextMemo}>{children}</ModalContext.Provider>
         <Modal
            isOpen={isModalOpen}
            onClose={() => handleCloseModal()}
            header={modalHeader}
            zIndex={modalZIndex}
         >
            {modalContent}
         </Modal>
      </>
   );
}
