import { useContext, useEffect, useState } from 'react';
import type { IProgressBarChartData } from '../../../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import ProgressBarChart from '../../../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import DBConnect from '../../../../../../../global/utils/DBConnect/DBConnect';
import { ScoreboardContainer } from '../../style/Style';
import ArrOfObj from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
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
      <ScoreboardContainer localStyles={screenStyles()}>
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
