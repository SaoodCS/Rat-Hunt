import { useContext, useEffect, useState } from 'react';
import { ScoreboardContainer } from '../Style';
import { GameContext } from '../../../context/GameContext';
import FirestoreDB from '../../../class/FirestoreDb';
import type { IProgressBarChartData } from '../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import ProgressBarChart from '../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';

export default function ScoreboardSlide(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const [chartData, setChartData] = useState<IProgressBarChartData[]>([]);

   useEffect(() => {
      const totalScores = ArrayOfObjects.getArrOfValuesFromKey(
         roomData?.gameState?.userStates || [],
         'totalScore',
      );
      const roundScores = ArrayOfObjects.getArrOfValuesFromKey(
         roomData?.gameState?.userStates || [],
         'roundScore',
      );
      const roundScoresPlusTotal = roundScores.map((score, index) => score + totalScores[index]);
      const barOutOf = Math.max(...roundScoresPlusTotal);
      const labels = ArrayOfObjects.getArrOfValuesFromKey(
         roomData?.gameState?.userStates || [],
         'userId',
      );
      const chartData: IProgressBarChartData[] = labels.map((label, index) => {
         return {
            label,
            target: barOutOf,
            completedAmnt: roundScoresPlusTotal[index],
         };
      });
      setChartData(chartData);
   }, [roomData?.gameState?.userStates, roomData?.gameState?.numberOfRoundsSet]);

   return (
      <ScoreboardContainer>
         <ProgressBarChart
            data={ArrayOfObjects.sort(chartData, 'completedAmnt', true)}
            barHeight="1em"
            barWidth="95%"
         />
      </ScoreboardContainer>
   );
}
