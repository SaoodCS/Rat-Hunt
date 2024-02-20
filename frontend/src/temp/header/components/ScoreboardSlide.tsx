import ProgressBarChart, {
   IProgressBarChartData,
} from '../../../global/components/lib/progressBarChart/ProgressBarChart';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import { ScoreboardContainer } from '../Style';

export default function ScoreboardSlide(): JSX.Element {
   const chartData: IProgressBarChartData[] = [
      {
         label: 'User 1',
         target: 100,
         completedAmnt: 50,
      },
      {
         label: 'User 2',
         target: 100,
         completedAmnt: 27,
      },
      {
         label: 'User 3',
         target: 100,
         completedAmnt: 56,
      },
      {
         label: 'User 4',
         target: 100,
         completedAmnt: 22,
      },
      {
         label: 'User 5',
         target: 100,
         completedAmnt: 50,
      },
      {
         label: 'User 6',
         target: 100,
         completedAmnt: 27,
      },
      {
         label: 'User 7',
         target: 100,
         completedAmnt: 56,
      },
      {
         label: 'User 8',
         target: 100,
         completedAmnt: 22,
      },
   ];

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
