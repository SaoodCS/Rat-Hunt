import type { ReactNode } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../../../context/theme/ThemeContext';
import CSS_Color from '../../../css/utils/colors';
import { CSS_ZIndex } from '../../../css/utils/zIndex';
import useOnOutsideClick from '../../../hooks/useOnOutsideClick';
import ExitAnimatePresence from '../animation/exitAnimatePresence/ExitAnimatePresence';
import { AnimatedOverlay } from '../animation/overlay/AnimatedOverlay';
import Scroller from '../scroller/Scroller';
import {
   ModalAnimator,
   ModalBody,
   ModalCenterer,
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
}

export default function Modal(props: IModal): JSX.Element {
   const { isOpen, onClose, header, children } = props;
   const { isDarkTheme } = useContext(ThemeContext);
   const { outsideClickRef } = useOnOutsideClick(onClose);

   return (
      <ExitAnimatePresence exitWhen={!isOpen}>
         <AnimatedOverlay
            key="modal-overlay"
            animateType={['fade']}
            duration={0.5}
            type="tween"
            color={CSS_Color.setRgbOpacity(CSS_Color.darkThm.txt, 0.3)}
            zIndex={CSS_ZIndex.get('modal') - 1}
         />
         <ModalCenterer centerContents>
            <ModalAnimator
               key="modal"
               ref={outsideClickRef}
               animateType={['expand']}
               duration={0.5}
               type="spring"
            >
               <ModalContainer isDarkTheme={isDarkTheme}>
                  <ModalHeaderContainer isDarkTheme={isDarkTheme}>
                     <ModalHeader isDarkTheme={isDarkTheme}>{header}</ModalHeader>
                     <ModalCloseButton onClick={onClose} />
                  </ModalHeaderContainer>
                  <ModalBody>
                     <Scroller hideScrollbar withFader dependencies={[isOpen]}>
                        {children}
                     </Scroller>
                  </ModalBody>
               </ModalContainer>
            </ModalAnimator>
         </ModalCenterer>
      </ExitAnimatePresence>
   );
}
