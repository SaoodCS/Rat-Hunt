import { useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import { TextBtn } from '../../../lib/button/textBtn/Style';
import Modal from '../../../lib/modal/Modal';
import { ModalFooterWrapper } from '../../../lib/modal/Style';

export default function UpdateAppModal(): JSX.Element {
   const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
   const { isDarkTheme } = useThemeContext();

   const updateSW = registerSW({
      onNeedRefresh() {
         setIsUpdateAvailable(true);
      },
   });

   async function handleUpdate(): Promise<void> {
      setIsUpdateAvailable(false);
      await updateSW(true);
   }

   function handleCancelUpdate(): void {
      setIsUpdateAvailable(false);
   }

   return (
      <>
         <Modal isOpen={isUpdateAvailable} onClose={handleCancelUpdate} header="Update Available">
            An update is available. Would you like to update?
            <ModalFooterWrapper>
               <TextBtn onClick={handleUpdate} isDarkTheme={isDarkTheme}>
                  Update
               </TextBtn>
               <TextBtn onClick={handleCancelUpdate} isDarkTheme={isDarkTheme}>
                  Cancel
               </TextBtn>
            </ModalFooterWrapper>
         </Modal>
      </>
   );
}
