import {
   CarouselContainer,
   CarouselSlide,
} from '../../../../../global/components/lib/carousel/Carousel';
import useCarousel from '../../../../../global/components/lib/carousel/hooks/useCarousel';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import Color from '../../../../../global/css/colors';
import GameDetailsSlide from './components/gameDetailsSlide/GameDetailsSlide';
import ScoreboardSlide from './components/scoreboardSlide/ScoreboardSlide';

export default function GameHeader(): JSX.Element {
   const { containerRef, scrollToSlide } = useCarousel(1, 'headerCarousel.currentSlide');

   return (
      <CarouselContainer ref={containerRef}>
         <CarouselSlide height="auto" style={{ borderRight: `1px solid ${Color.darkThm.accent}` }}>
            <GameDetailsSlide scrollToSlide={scrollToSlide} />
         </CarouselSlide>
         <CarouselSlide height="auto">
            <FlexColumnWrapper width="100dvw" position="relative">
               <ScoreboardSlide scrollToSlide={scrollToSlide} />
            </FlexColumnWrapper>
         </CarouselSlide>
      </CarouselContainer>
   );
}
