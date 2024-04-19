import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

interface IModalContext {
   setModalContent: Dispatch<SetStateAction<JSX.Element>>;
   setModalHeader: Dispatch<SetStateAction<string>>;
   modalContent: JSX.Element;
   isModalOpen: boolean;
   toggleModal: (show: boolean) => void;
}

export const ModalContext = createContext<IModalContext>({
   setModalContent: () => {},
   setModalHeader: () => {},
   modalContent: <></>,
   isModalOpen: false,
   toggleModal: () => {},
});
