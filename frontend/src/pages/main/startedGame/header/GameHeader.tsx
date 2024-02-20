import { TextBtn } from '../../../../global/components/lib/button/textBtn/Style';
import {
   CarouselContainer,
   CarouselSlide,
} from '../../../../global/components/lib/carousel/Carousel';
import useCarousel from '../../../../global/components/lib/carousel/hooks/useCarousel';
import { FlexColumnWrapper } from '../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import Color from '../../../../global/css/colors';
import Unicode from '../../../../global/helpers/dataTypes/unicode/Unicode';
import { ScoreboardBtnContainer } from './Style';
import GameDetailsSlide from './components/GameDetailsSlide';
import ScoreboardSlide from './components/ScoreboardSlide';

export default function GameHeader(): JSX.Element {
   const { containerRef, scrollToSlide } = useCarousel(1, 'headerCarousel.currentSlide');
   function handleOpenScoreboard(): void {
      scrollToSlide(2);
   }

   return (
      <CarouselContainer ref={containerRef}>
         <CarouselSlide height="auto" style={{ borderRight: `1px solid ${Color.darkThm.accent}` }}>
            <FlexColumnWrapper position="relative" width="100dvw">
               <GameDetailsSlide />
               <ScoreboardBtnContainer>
                  <TextBtn isDarkTheme onClick={handleOpenScoreboard}>
                     Scoreboard {Unicode.rightArrow()}
                  </TextBtn>
               </ScoreboardBtnContainer>
            </FlexColumnWrapper>
         </CarouselSlide>
         <CarouselSlide height="auto">
            <FlexColumnWrapper width="100dvw" position="relative">
               <ScoreboardSlide />
            </FlexColumnWrapper>
         </CarouselSlide>
      </CarouselContainer>
   );
}
