// Note -> Scroll animations for this component may not work on desktop browser if animation effects are turned off in Windows settings.
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { DummyData } from '../../../helpers/dummyContent/dummyData';
import useScrollSaver from '../../../hooks/useScrollSaver';
import { CarouselContainer, CarouselSlide } from '../../lib/carousel/Carousel';
import useCarousel from '../../lib/carousel/hooks/useCarousel';
import FetchError from '../../lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../lib/fetch/offlineFetch/offlineFetch';
import {
   PlaceholderCircle,
   PlaceholderLine,
   PlaceholderRect,
} from '../../lib/fetch/placeholders/Style';
import PullToRefresh from '../../lib/pullToRefresh/PullToRefresh';
import ConditionalRender from '../../lib/renderModifiers/conditionalRender/ConditionalRender';

export default function CarouselWithScrollSaverExample(): JSX.Element {
   const [unmountComponent, setUnmountComponent] = useState(false);

   function handleUnmountComponent(): void {
      setUnmountComponent(true);
   }

   function remountComponent(): void {
      setUnmountComponent(false);
   }

   return (
      <>
         <button onClick={handleUnmountComponent}>Unmount Component</button>
         <button onClick={remountComponent}>Remount Component</button>
         <ConditionalRender condition={!unmountComponent}>
            <CarouselPage />
         </ConditionalRender>
      </>
   );
}

function CarouselPage(): JSX.Element {
   const identifier = 'carouselExample';
   const { containerRef, scrollToSlide } = useCarousel(1, identifier);

   return (
      <>
         <button onClick={() => scrollToSlide(1)}>Go to Slide 1</button>
         <button onClick={() => scrollToSlide(2)}>Go to Slide 2</button>
         <CarouselContainer ref={containerRef} style={{ width: '20em' }}>
            <CarouselSlide height={'90dvh'}>
               <ContentForS1 />
            </CarouselSlide>
            <CarouselSlide height={'90dvh'}>
               <ContentForS2 />
            </CarouselSlide>
         </CarouselContainer>
      </>
   );
}

function ContentForS1(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const identifier = 'path/slide1Content';
   const {
      containerRef: containerRef,
      handleOnScroll: handleOnScroll,
      scrollToTop: scrollToTop,
      scrollSaverStyle: scrollSaverStyle,
   } = useScrollSaver(identifier);

   const { isLoading, error, data, isPaused, refetch } = useQuery(['repoData'], () =>
      fetch(DummyData.endpoints.GET.dynamicRes).then((res) => res.json()),
   );
   if (isLoading && !isPaused) {
      scrollToTop();
      return (
         <>
            <PlaceholderCircle isDarkTheme={isDarkTheme} size="50px" />
            <PlaceholderRect isDarkTheme={isDarkTheme} height="50px" width="50px" />
            <PlaceholderLine isDarkTheme={isDarkTheme} />
         </>
      );
   }
   if (isPaused) return <OfflineFetch />;
   if (error) return <FetchError />;

   return (
      <>
         <PullToRefresh onRefresh={refetch} isDarkTheme={isDarkTheme}>
            <div
               ref={containerRef}
               onScroll={() => handleOnScroll()}
               style={{ ...scrollSaverStyle, height: '25em' }}
            >
               STRT {JSON.stringify(data).replace(/(.{10})/g, '$1 ')}
               END
            </div>
         </PullToRefresh>
      </>
   );
}

function ContentForS2(): JSX.Element {
   const identifier = 'path/slide2Content';
   const {
      containerRef: containerRef,
      handleOnScroll: handleOnScroll,
      scrollSaverStyle: scrollSaverStyle,
   } = useScrollSaver(identifier);

   return (
      <div onScroll={() => handleOnScroll()} ref={containerRef} style={scrollSaverStyle}>
         SLIDE 2: {DummyData.loremIpsum}
      </div>
   );
}
