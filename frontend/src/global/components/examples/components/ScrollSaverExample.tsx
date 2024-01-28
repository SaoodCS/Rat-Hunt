/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { DummyData } from '../../../helpers/dummyContent/dummyData';
import useScrollSaver from '../../../hooks/useScrollSaver';
import FetchError from '../../lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../lib/fetch/offlineFetch/offlineFetch';
import {
   PlaceholderCircle,
   PlaceholderLine,
   PlaceholderRect,
} from '../../lib/fetch/placeholders/Style';
import PullToRefresh from '../../lib/pullToRefresh/PullToRefresh';
import ConditionalRender from '../../lib/renderModifiers/conditionalRender/ConditionalRender';

export default function ScrollSaverExample(): JSX.Element {
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
            <ScrollSaverWithData />
         </ConditionalRender>
      </>
   );
}

// -------------------------------------------------------------------------------------- //

function ScrollSaverWithData(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const storageId = 'scrollSaverWithDataExample';
   const { containerRef, handleOnScroll, scrollToTop, scrollSaverStyle } =
      useScrollSaver(storageId);

   const { isLoading, error, data, isPaused, refetch } = useQuery(['repoData'], () =>
      fetch(DummyData.endpoints.GET.large).then((res) => res.json()),
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
            <div ref={containerRef} onScroll={() => handleOnScroll()} style={scrollSaverStyle}>
               <div style={{ height: '10em' }}>STRT {JSON.stringify(data)} END</div>
            </div>
         </PullToRefresh>
      </>
   );
}

// const [data, setData] = useState<string[]>([]);
// useEffect(() => {
//    fetch(DummyData.endpoints.GET.large)
//       .then((res) => res.json())
//       .then((res) => setData(res));
// }, []);
