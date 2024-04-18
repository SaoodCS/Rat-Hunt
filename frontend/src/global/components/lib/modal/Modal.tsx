import type { ReactNode } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../../../context/theme/ThemeContext';
import Color from '../../../css/colors';
import useOnOutsideClick from '../../../hooks/useOnOutsideClick';
import ExitAnimatePresence from '../animation/exitAnimatePresence/ExitAnimatePresence';
import { AnimatedOverlay } from '../animation/overlay/AnimatedOverlay';
import { FullScreenWrapper } from '../positionModifiers/fullScreenWrapper/FullScreenWrapper';
import Scroller from '../scroller/Scroller';
import {
   ModalAnimator,
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
}

export default function Modal(props: IModal): JSX.Element {
   const { isOpen, onClose, header, children } = props;
   const { isDarkTheme } = useContext(ThemeContext);
   const { outsideClickRef } = useOnOutsideClick(onClose);

   return (
      <ExitAnimatePresence exitWhen={!isOpen}>
         <AnimatedOverlay
            key="overlay"
            animateType={['fade']}
            duration={0.5}
            type="tween"
            color={Color.setRgbOpacity(Color.darkThm.txt, 0.3)}
            zIndex={1}
         />
         <FullScreenWrapper centerContents>
            <ModalAnimator
               ref={outsideClickRef}
               key="modal"
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
         </FullScreenWrapper>
      </ExitAnimatePresence>
   );
}
