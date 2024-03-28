import type { ReactNode } from 'react';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../context/theme/ThemeContext';
import Color from '../../../css/colors';
import Expander from '../animation/expander/Expander';
import { DimOverlay } from '../overlay/dimOverlay/DimOverlay';
import { CenterWrapper } from '../positionModifiers/centerers/CenterWrapper';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import Scrollbar from '../scrollbar/Scrollbar';
import {
   ModalBody,
   ModalCloseButton,
   ModalContainer,
   ModalHeader,
   ModalHeaderContainer,
} from './Style';

interface IModal {
   isOpen: boolean;
   onClose: () => void;
   header: string;
   children: ReactNode;
   zIndex?: number;
}

export default function Modal(props: IModal): JSX.Element {
   const { isOpen, onClose, header, children, zIndex } = props;
   const { isDarkTheme } = useContext(ThemeContext);
   const [renderModal, setRenderModal] = useState(false);

   useEffect(() => {
      let timeoutId: NodeJS.Timeout | undefined = undefined;
      if (!isOpen) {
         timeoutId = setTimeout(() => {
            setRenderModal(false);
         }, 100);
      } else {
         setRenderModal(true);
      }
      return () => {
         clearTimeout(timeoutId);
      };
   }, [isOpen]);

   return (
      <ConditionalRender condition={renderModal}>
         <DimOverlay
            onClick={onClose}
            isDisplayed={isOpen}
            color={Color.setRgbOpacity(Color.darkThm.accent, 0.05)}
         />
         <CenterWrapper centerOfScreen zIndex={zIndex}>
            <Expander expandOutCondition={isOpen}>
               <ModalContainer isDarkTheme={isDarkTheme}>
                  <ModalHeaderContainer isDarkTheme={isDarkTheme}>
                     <ModalHeader isDarkTheme={isDarkTheme}>{header}</ModalHeader>
                     <ModalCloseButton onClick={onClose} />
                  </ModalHeaderContainer>
                  <ModalBody>
                     <Scrollbar scrollbarWidth={8} withFader={true} dependencies={[renderModal]}>
                        {children}
                     </Scrollbar>
                  </ModalBody>
               </ModalContainer>
            </Expander>
         </CenterWrapper>
      </ConditionalRender>
   );
}
