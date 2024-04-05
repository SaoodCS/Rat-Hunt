import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import { ScoreboardWrapper } from './style/Style';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import DBConnect from '../../../../../../../global/database/DBConnect/DBConnect';
import type { IProgressBarChartData } from '../../../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import ArrOfObj from '../../../../../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import Scroller from '../../../../../../../global/components/lib/scroller/Scroller';
import ProgressBarChart from '../../../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import MyCSS from '../../../../../../../global/css/MyCSS';

export default function ScoreboardSlide(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [chartData, setChartData] = useState<IProgressBarChartData[]>([]);

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

   return (
      <ScoreboardWrapper localStyles={screenStyles()}>
         <Scroller scrollbarWidth={5} withFader dependencies={[chartData]}>
            <ProgressBarChart
               data={ArrOfObj.sort(chartData, 'completedAmnt', true)}
               barHeight="1.5em"
               barWidth="98%"
            />
         </Scroller>
      </ScoreboardWrapper>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forDesktop = MyCSS.Media.desktop(css``);

   const medium = css`
      @media (min-width: 544px) {
         max-width: 45em;
      }
   `;
   return MyCSS.Helper.concatStyles(forDesktop, medium);
};
