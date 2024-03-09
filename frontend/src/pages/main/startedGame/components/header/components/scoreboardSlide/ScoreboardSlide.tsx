import { useContext, useEffect, useRef, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import type { IProgressBarChartData } from '../../../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import ProgressBarChart from '../../../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import MyCSS from '../../../../../../../global/css/MyCSS';
import ArrOfObj from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DBConnect from '../../../../../../../global/utils/DBConnect/DBConnect';
import { ScoreboardContainer } from '../../style/Style';

export default function ScoreboardSlide(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [chartData, setChartData] = useState<IProgressBarChartData[]>([]);
   const scoreboardContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
         const scoreboardContainerDiv = entries[0].target as HTMLDivElement;
         const maskImage =
            scoreboardContainerDiv.scrollHeight <= scoreboardContainerDiv.clientHeight + 1
               ? 'none'
               : 'linear-gradient(to bottom, black calc(100% - 48px), transparent 100%)';
         scoreboardContainerDiv.style.maskImage = maskImage;
      });
      if (scoreboardContainerRef.current) {
         resizeObserver.observe(scoreboardContainerRef.current);
      }
      return () => {
         resizeObserver.disconnect();
      };
   }, [roomData]);

   useEffect(() => {
      const totalScores = ArrOfObj.getArrOfValuesFromKey(
         roomData?.gameState?.userStates || [],
         'totalScore',
      );
      const barOutOf = Math.max(...totalScores);
      const labels = ArrOfObj.getArrOfValuesFromKey(
         roomData?.gameState?.userStates || [],
         'userId',
      );
      const chartData: IProgressBarChartData[] = labels.map((label, index) => {
         return {
            label,
            target: barOutOf,
            completedAmnt: totalScores[index],
         };
      });
      setChartData(chartData);
   }, [roomData?.gameState?.userStates, roomData?.gameState?.numberOfRoundsSet]);

   function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>): void {
      const scoreboardContainerDiv = e.target as HTMLDivElement;
      const scrollTop = scoreboardContainerDiv.scrollTop;
      if (
         scrollTop + scoreboardContainerDiv.clientHeight >=
         scoreboardContainerDiv.scrollHeight - 1
      ) {
         scoreboardContainerDiv.style.maskImage = 'none';
      } else {
         scoreboardContainerDiv.style.maskImage =
            'linear-gradient(to bottom, black calc(100% - 48px), transparent 100%)';
      }
   }

   return (
      <ScoreboardContainer
         localStyles={screenStyles()}
         ref={scoreboardContainerRef}
         onScroll={handleScroll}
      >
         <ProgressBarChart
            data={ArrOfObj.sort(chartData, 'completedAmnt', true)}
            barHeight="1.5em"
            barWidth="95%"
         />
      </ScoreboardContainer>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forDesktop = MyCSS.Media.desktop(css`
      font-size: 1.2em;
   `);
   return MyCSS.Helper.concatStyles(forDesktop);
};
