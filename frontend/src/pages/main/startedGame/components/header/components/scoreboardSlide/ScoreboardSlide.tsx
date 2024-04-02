import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import ArrOfObj from '../../../../../../../../../shared/helpers/arrayOfObjects/arrayOfObjects';
import { ArrowCircleLeftIcon } from '../../../../../../../global/components/lib/icons/arrows/ArrowCircleLeft';
import { FlexCenterer } from '../../../../../../../global/components/lib/positionModifiers/centerers/FlexCenterer';
import type { IProgressBarChartData } from '../../../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import ProgressBarChart from '../../../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import Scroller from '../../../../../../../global/components/lib/scroller/Scroller';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import MyCSS from '../../../../../../../global/css/MyCSS';
import DBConnect from '../../../../../../../global/database/DBConnect/DBConnect';
import { ScoreboardContainer } from '../../style/Style';

interface IScoreboardSlide {
   scrollToSlide: (slideNum: number) => void;
}

export default function ScoreboardSlide(props: IScoreboardSlide): JSX.Element {
   const { scrollToSlide } = props;
   const { localDbRoom } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [chartData, setChartData] = useState<IProgressBarChartData[]>([]);
   const { isPortableDevice } = useThemeContext();

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
      <>
         <ScoreboardContainer localStyles={screenStyles()}>
            <Scroller scrollbarWidth={5} withFader dependencies={[chartData]}>
               <ProgressBarChart
                  data={ArrOfObj.sort(chartData, 'completedAmnt', true)}
                  barHeight="1em"
                  barWidth="95%"
               />
            </Scroller>
         </ScoreboardContainer>
         <ConditionalRender condition={!isPortableDevice}>
            <FlexCenterer
               position="absolute"
               left="95%"
               right="0"
               height="100%"
               padding="0em 0.3em 0em 0.3em"
               localStyles={flexCentererStyles()}
            >
               <ArrowCircleLeftIcon darktheme="true" onClick={() => scrollToSlide(1)} />
            </FlexCenterer>
         </ConditionalRender>
      </>
   );
}

const flexCentererStyles = (): FlattenSimpleInterpolation => {
   return css`
      @media (min-width: ${MyCSS.PortableBp.asPx}) {
         padding: 0.3em 0.3em 0em 0.3em;
         align-items: start;
      }
      @media (min-width: 1000px) {
         padding: 0.3em 0.3em 0em 0.3em;
         //align-items: center;
      }
      @media (min-width: 1200px) {
         padding: 0em 0.5em 0em 0.5em;
         align-items: center;
      }
      @media (min-width: 1700px) {
         padding: 0em 0.75em 0em 0.75em;
         align-items: center;
      }
      @media (min-width: 1800px) {
         padding: 0em 1em 0em 1em;
         align-items: center;
      }
   `;
};

const screenStyles = (): FlattenSimpleInterpolation => {
   const forDesktop = MyCSS.Media.desktop(css`
      font-size: 1.2em;
   `);
   return MyCSS.Helper.concatStyles(forDesktop);
};
