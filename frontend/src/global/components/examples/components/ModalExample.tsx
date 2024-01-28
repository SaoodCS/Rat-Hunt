import { useContext } from 'react';
import { ModalContext } from '../../../context/widget/modal/ModalContext';

export default function ModalExample(): JSX.Element {
   const { setModalContent, setModalHeader, toggleModal } = useContext(ModalContext);

   function handleOpenModal(): void {
      toggleModal(true);
      setModalContent(<div>Content</div>);
      setModalHeader('Header');
   }

   return (
      <>
         <button onClick={() => handleOpenModal()}>Show Modal</button>
      </>
   );
}
