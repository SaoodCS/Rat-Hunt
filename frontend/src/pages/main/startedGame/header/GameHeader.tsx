import { Copy } from '@styled-icons/fluentui-system-regular/Copy';
import { useContext } from 'react';
import { TextBtn } from '../../../../global/components/lib/button/textBtn/Style';
import {
   CarouselContainer,
   CarouselSlide,
} from '../../../../global/components/lib/carousel/Carousel';
import useCarousel from '../../../../global/components/lib/carousel/hooks/useCarousel';
import { FlexColumnWrapper } from '../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { ToastContext } from '../../../../global/context/widget/toast/ToastContext';
import Color from '../../../../global/css/colors';
import Unicode from '../../../../global/helpers/dataTypes/unicode/Unicode';
import { GameContext } from '../../context/GameContext';
import { BtnContainer } from './Style';
import GameDetailsSlide from './components/GameDetailsSlide';
import ScoreboardSlide from './components/ScoreboardSlide';
import { ArrowCircleLeftIcon } from '../../../../global/components/lib/icons/arrows/ArrowCircleLeft';
import { FlexCenterer } from '../../../../global/components/lib/positionModifiers/centerers/FlexCenterer';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import ConditionalRender from '../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';

export default function GameHeader(): JSX.Element {
   const { containerRef, scrollToSlide } = useCarousel(1, 'headerCarousel.currentSlide');
   const { localDbRoom } = useContext(GameContext);
   const { isPortableDevice } = useThemeContext();

   const {
      toggleToast,
      setToastMessage,
      setWidth,
      setVerticalPos,
      setHorizontalPos,
      setToastZIndex,
   } = useContext(ToastContext);

   async function copyToClipboard(): Promise<void> {
      await navigator.clipboard.writeText(localDbRoom);
      setToastMessage('Room ID Copied!');
      setWidth('200px');
      setVerticalPos('bottom');
      setHorizontalPos('center');
      setToastZIndex(100);
      toggleToast(true);
   }

   return (
      <CarouselContainer ref={containerRef}>
         <CarouselSlide height="auto" style={{ borderRight: `1px solid ${Color.darkThm.accent}` }}>
            <GameDetailsSlide />
            <FlexColumnWrapper
               position="absolute"
               height="100%"
               justifyContent="center"
               alignItems="center"
               padding="0em 1em 0em 0em"
               right="0"
            >
               <BtnContainer>
                  <TextBtn isDarkTheme onClick={copyToClipboard}>
                     Room: {localDbRoom}
                     <Copy size="0.85em" style={{ padding: '0em 0em 0em 0.2em' }} />
                  </TextBtn>
               </BtnContainer>
               <BtnContainer>
                  <TextBtn isDarkTheme onClick={() => scrollToSlide(2)}>
                     Scoreboard {Unicode.rightArrow()}
                  </TextBtn>
               </BtnContainer>
            </FlexColumnWrapper>
         </CarouselSlide>
         <CarouselSlide height="auto">
            <FlexColumnWrapper width="100dvw" position="relative">
               <ScoreboardSlide />
               <ConditionalRender condition={!isPortableDevice}>
                  <FlexCenterer
                     position="absolute"
                     left="95%"
                     right="0"
                     height="100%"
                     padding="0em 0.3em 0em 0.3em"
                  >
                     <ArrowCircleLeftIcon darktheme="true" onClick={() => scrollToSlide(1)} />
                  </FlexCenterer>
               </ConditionalRender>
            </FlexColumnWrapper>
         </CarouselSlide>
      </CarouselContainer>
   );
}
