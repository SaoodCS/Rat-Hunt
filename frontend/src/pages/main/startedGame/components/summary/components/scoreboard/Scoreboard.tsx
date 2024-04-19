import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import ArrOfObj from '../../../../../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import type { IProgressBarChartData } from '../../../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import ProgressBarChart from '../../../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import Scroller from '../../../../../../../global/components/lib/scroller/Scroller';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import { CSS_Helper } from '../../../../../../../global/css/utils/helper';
import DBConnect from '../../../../../../../global/database/DBConnect/DBConnect';
import { ScoreboardWrapper } from './style/Style';
import { CSS_Media } from '../../../../../../../global/css/utils/media';

export default function Scoreboard(): JSX.Element {
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
   const forDesktop = CSS_Media.Query.desktop(css``);

   const medium = css`
      @media (min-width: 544px) {
         max-width: 45em;
      }
   `;
   return CSS_Helper.concatStyles(forDesktop, medium);
};
