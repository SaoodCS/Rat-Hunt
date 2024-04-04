import { useContext } from 'react';
import { GameContext } from '../../../context/game/GameContext';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Color from '../../../css/colors';
import type { ITooltipPositioning } from '../tooltip/Tooltip';
import { BarAndInfoWrapper, BarAndPercentageWrapper, BarBackground, CompletedBar } from './Style';
import NumberHelper from '../../../../../../shared/lib/helpers/number/NumberHelper';
import { FlexCenterer } from '../positionModifiers/centerers/FlexCenterer';

export interface IProgressBarChartData {
   label: string;
   target: number;
   completedAmnt: number;
}

export interface IProgressBarTooltipOptions {
   positioning?: ITooltipPositioning;
   width?: string;
   height?: string;
}

interface IProgressBarChart {
   data: IProgressBarChartData[];
   tooltipOptions?: IProgressBarTooltipOptions;
   barWidth?: string;
   barHeight?: string;
}

export default function ProgressBarChart(props: IProgressBarChart): JSX.Element {
   const { data, barHeight, barWidth } = props;
   const { localDbUser } = useContext(GameContext);
   function isLocalDbUser(userId: string): boolean {
      return userId === localDbUser;
   }
   const { isDarkTheme } = useThemeContext();

   function getCompletedPercentage(completedAmnt: number, target: number): number {
      return NumberHelper.calcPercentage(completedAmnt, target, true);
   }

   function textColor(itemLabel: string): string {
      return Color.setRgbOpacity(
         isLocalDbUser(itemLabel) ? Color.darkThm.error : Color.darkThm.success,
         1,
      );
   }

   return (
      <>
         {data.map((item) => (
            <BarAndInfoWrapper key={item.label}>
               <BarAndPercentageWrapper>
                  <BarBackground
                     barWidth={barWidth || '20em'}
                     barHeight={barHeight || '2em'}
                     isDarkTheme={isDarkTheme}
                  >
                     <FlexCenterer
                        padding="0.1em 0em 0em 0.5em"
                        height="100%"
                        color={textColor(item.label)}
                     >
                        {item.label}
                     </FlexCenterer>
                     <FlexCenterer
                        padding="0.1em 0.75em 0em 0em"
                        height="100%"
                        position="absolute"
                        right="0em"
                        color={textColor(item.label)}
                     >
                        {item.completedAmnt}
                     </FlexCenterer>
                     <CompletedBar
                        completedPercentage={getCompletedPercentage(
                           item.completedAmnt,
                           item.target,
                        )}
                        isDarkTheme={isDarkTheme}
                        color={textColor(item.label)}
                     />
                  </BarBackground>
               </BarAndPercentageWrapper>
            </BarAndInfoWrapper>
         ))}
      </>
   );
}
