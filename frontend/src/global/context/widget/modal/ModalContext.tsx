import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

interface IModalContext {
   setModalContent: Dispatch<SetStateAction<JSX.Element>>;
   setModalHeader: Dispatch<SetStateAction<string>>;
   modalContent: JSX.Element;
   modalZIndex: number | undefined;
   setModalZIndex: Dispatch<SetStateAction<number | undefined>>;
   isModalOpen: boolean;
   toggleModal: (show: boolean) => void;
}

export const ModalContext = createContext<IModalContext>({
   setModalContent: () => {},
   setModalHeader: () => {},
   modalContent: <></>,
   modalZIndex: undefined,
   setModalZIndex: () => {},
   isModalOpen: false,
   toggleModal: () => {},
});
