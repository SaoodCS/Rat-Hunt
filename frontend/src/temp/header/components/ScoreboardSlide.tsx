import { useContext, useEffect, useState } from 'react';
import { E } from 'styled-icons/fa-solid';
import ProgressBarChart, {
   IProgressBarChartData,
} from '../../../global/components/lib/progressBarChart/ProgressBarChart';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import FirestoreDB from '../../../pages/main/class/FirestoreDb';
import { GameContext } from '../../../pages/main/context/GameContext';
import { ScoreboardContainer } from '../Style';

export default function ScoreboardSlide(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const [chartData, setChartData] = useState<IProgressBarChartData[]>([]);

   useEffect(() => {
      const barOutOf = (roomData?.gameState?.numberOfRoundsSet || 1) * 2;
      const totalScores = ArrayOfObjects.getArrOfValuesFromKey(
         roomData?.gameState?.userStates || [],
         'totalScore',
      );
      const roundScores = ArrayOfObjects.getArrOfValuesFromKey(
         roomData?.gameState?.userStates || [],
         'roundScore',
      );
      const roundScoresPlusTotal = roundScores.map((score, index) => score + totalScores[index]);
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
            barHeight="0.8em"
            barWidth="65%"
            tooltipOptions={{ positioning: 'center-right' }}
         />
      </ScoreboardContainer>
   );
}
