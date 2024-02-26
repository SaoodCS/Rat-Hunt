import { useContext } from 'react';
import { GameContext } from '../../../../pages/main/context/GameContext';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Color from '../../../css/colors';
import NumberHelper from '../../../helpers/dataTypes/number/NumberHelper';
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
               <BarAndPercentageWrapper style={{ position: 'relative' }}>
                  <BarBackground
                     barWidth={barWidth || '20em'}
                     barHeight={barHeight || '2em'}
                     isDarkTheme={isDarkTheme}
                     style={{
                        position: 'relative',
                        boxSizing: 'border-box',
                        borderTop: isLocalDbUser(item.label)
                           ? `1px solid ${Color.darkThm.accentAlt}`
                           : '',
                        borderBottom: isLocalDbUser(item.label)
                           ? `1px solid ${Color.darkThm.accentAlt}`
                           : '',
                        borderRight: isLocalDbUser(item.label)
                           ? `1px solid ${Color.darkThm.accentAlt}`
                           : '',
                     }}
                  >
                     <LogoText
                        color={Color.setRgbOpacity(
                           isLocalDbUser(item.label) ? Color.darkThm.accentAlt : Color.darkThm.txt,
                           0.75,
                        )}
                        size="0.75em"
                        style={{
                           padding: '0em 0em 0em 0.5em',
                           height: '100%',
                           display: 'flex',
                           alignItems: 'center',
                        }}
                     >
                        {item.label}
                     </LogoText>
                     <LogoText
                        color={Color.setRgbOpacity(
                           isLocalDbUser(item.label) ? Color.darkThm.accentAlt : Color.darkThm.txt,
                           0.75,
                        )}
                        size="0.75em"
                        style={{
                           padding: '0em 0.75em 0em 0em',
                           position: 'absolute',
                           right: '0em',
                           zIndex: 999,
                           height: '100%',
                           display: 'flex',
                           alignItems: 'center',
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
                              ? Color.setRgbOpacity(Color.darkThm.accentAlt, 0.2)
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
