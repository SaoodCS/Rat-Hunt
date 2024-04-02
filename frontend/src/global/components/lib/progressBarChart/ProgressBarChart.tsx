import { useContext } from 'react';
import NumberHelper from '../../../../../../shared/helpers/number/NumberHelper';
import { GameContext } from '../../../context/game/GameContext';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Color from '../../../css/colors';
import { LogoText } from '../../app/logo/LogoText';
import type { ITooltipPositioning } from '../tooltip/Tooltip';
import { BarAndInfoWrapper, BarAndPercentageWrapper, BarBackground, CompletedBar } from './Style';

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
                     <LogoText
                        color={Color.setRgbOpacity(
                           isLocalDbUser(item.label) ? Color.darkThm.error : Color.darkThm.success,
                           1,
                        )}
                        size="0.8em"
                        style={{
                           padding: '0.1em 0em 0em 0.5em',
                           height: '100%',
                           display: 'flex',
                           alignItems: 'center',
                           filter: 'brightness(0.9)',
                        }}
                     >
                        {item.label}
                     </LogoText>
                     <LogoText
                        color={Color.setRgbOpacity(
                           isLocalDbUser(item.label) ? Color.darkThm.error : Color.darkThm.success,
                           1,
                        )}
                        size="0.8em"
                        style={{
                           padding: '0.1em 0.75em 0em 0em',
                           position: 'absolute',
                           right: '0em',
                           zIndex: 999,
                           height: '100%',
                           display: 'flex',
                           alignItems: 'center',
                           filter: 'brightness(0.9)',
                        }}
                     >
                        {item.completedAmnt}
                     </LogoText>

                     <CompletedBar
                        completedPercentage={getCompletedPercentage(
                           item.completedAmnt,
                           item.target,
                        )}
                        isDarkTheme={isDarkTheme}
                        style={{
                           background: isLocalDbUser(item.label)
                              ? Color.setRgbOpacity(Color.darkThm.error, 0.25)
                              : '',
                           position: 'absolute',
                           left: '0em',
                        }}
                     />
                  </BarBackground>
               </BarAndPercentageWrapper>
            </BarAndInfoWrapper>
         ))}
      </>
   );
}
