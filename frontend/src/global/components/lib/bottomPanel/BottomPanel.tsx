// Note: This component's functionality will work on desktop if you turn on animation in windows 11 settings (accessibility settings)
import { useRef, type ReactNode } from 'react';
import Sheet from 'react-modal-sheet';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import {
   CustomBottomPanelSheet,
   CustomPanelHeader,
   HeaderColumnCenter,
   HeaderColumnLeft,
   HeaderColumnRight,
   PanelCloseButton,
   SheetContentWrapper,
} from './Style';

interface IBottomPanel {
   isOpen: boolean;
   onClose: () => void;
   children: ReactNode;
   height?: number;
   heading?: string;
   zIndex?: number;
}

export default function BottomPanel(props: IBottomPanel): JSX.Element {
   const { isOpen, onClose, children, height, heading, zIndex } = props;
   const { isDarkTheme } = useThemeContext();
   const isKeyboardOpen = useDetectKeyboardOpen();
   const wrapperRef = useRef<HTMLDivElement>(null);

   function handleHeight(): string {
      if (!height && !isKeyboardOpen) {
         return 'fit-content';
      }
      if (isKeyboardOpen) {
         const keyboardHeight = '50dvh';
         if (!height) {
            const wrapperHeight = wrapperRef.current?.getBoundingClientRect().height;
            return `calc(${wrapperHeight}px + ${keyboardHeight})`;
         }
         return `calc(${height}dvh + ${keyboardHeight})`;
      }
      return `${height}dvh`;
   }

   return (
      <>
         <CustomBottomPanelSheet
            isOpen={isOpen}
            onClose={() => onClose()}
            tweenConfig={{ ease: 'easeOut', duration: 0.2 }}
            darktheme={isDarkTheme.toString()}
            detent={'content-height'}
            prefersReducedMotion={false}
            style={{ zIndex: zIndex || undefined }}
         >
            <Sheet.Container>
               <ConditionalRender condition={heading !== undefined}>
                  <Sheet.Header>
                     <CustomPanelHeader darktheme={isDarkTheme.toString()}>
                        <HeaderColumnLeft>
                           <PanelCloseButton onClick={() => onClose()} />
                        </HeaderColumnLeft>
                        <HeaderColumnCenter>{heading}</HeaderColumnCenter>
                        <HeaderColumnRight />
                     </CustomPanelHeader>
                  </Sheet.Header>
               </ConditionalRender>
               <ConditionalRender condition={heading === undefined}>
                  <Sheet.Header />
               </ConditionalRender>
               <Sheet.Content>
                  <Sheet.Scroller>
                     <SheetContentWrapper height={handleHeight()} ref={wrapperRef}>
                        {children}
                     </SheetContentWrapper>
                  </Sheet.Scroller>
               </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={() => onClose()} />
         </CustomBottomPanelSheet>
      </>
   );
}

BottomPanel.defaultProps = {
   height: undefined,
   heading: undefined,
   heightFitContent: false,
};
