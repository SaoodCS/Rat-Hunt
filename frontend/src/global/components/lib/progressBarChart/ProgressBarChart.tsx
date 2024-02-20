import { useContext } from 'react';
import { GameContext } from '../../../../pages/main/context/GameContext';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Color from '../../../css/colors';
import NumberHelper from '../../../helpers/dataTypes/number/NumberHelper';
import { LogoText } from '../../app/logo/LogoText';
import { TextColourizer } from '../font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../positionModifiers/flexRowWrapper/Style';
import type { ITooltipPositioning } from '../tooltip/Tooltip';
import Tooltip from '../tooltip/Tooltip';
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
   const { data, tooltipOptions, barHeight, barWidth } = props;
   const { localDbUser } = useContext(GameContext);
   function isLocalDbUser(userId: string): boolean {
      return userId === localDbUser;
   }
   const {
      positioning: toolTipPos,
      width: toolTipWidth,
      height: toolTipHeight,
   } = tooltipOptions || {};
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
                     <Tooltip
                        positioning={toolTipPos}
                        width={toolTipWidth}
                        height={toolTipHeight}
                        content={
                           <FlexColumnWrapper>
                              <TextColourizer
                                 padding="0em 0em 0em 0em"
                                 color={Color.darkThm.txt}
                                 fontSize="0.75em"
                              >
                                 User: {item.label}
                              </TextColourizer>
                              <TextColourizer
                                 padding="0em 0em 0em 0em"
                                 color={Color.darkThm.txt}
                                 fontSize="0.75em"
                              >
                                 Score: {item.completedAmnt}
                              </TextColourizer>
                           </FlexColumnWrapper>
                        }
                     >
                        <CompletedBar
                           completedPercentage={getCompletedPercentage(
                              item.completedAmnt,
                              item.target,
                           )}
                           isDarkTheme={isDarkTheme}
                           style={{
                              background: isLocalDbUser(item.label)
                                 ? Color.setRgbOpacity(Color.darkThm.accentAlt, 0.5)
                                 : '',
                           }}
                        />
                     </Tooltip>
                  </BarBackground>
                  <FlexRowWrapper
                     alignItems="center"
                     justifyContent="space-between"
                     position="absolute"
                     right={'0em'}
                     left={barWidth || '20em'}
                     padding="0em 1em 0em 1em"
                  >
                     <LogoText
                        color={Color.setRgbOpacity(
                           isLocalDbUser(item.label) ? Color.darkThm.accentAlt : Color.darkThm.txt,
                           0.75,
                        )}
                        size="0.75em"
                        style={{ padding: '0em 0em 0em 0.5em' }}
                     >
                        {item.label}
                     </LogoText>
                     <LogoText
                        color={Color.setRgbOpacity(
                           isLocalDbUser(item.label) ? Color.darkThm.accentAlt : Color.darkThm.txt,
                           0.75,
                        )}
                        size="0.75em"
                        style={{ padding: '0em 0em 0em 0.5em' }}
                     >
                        {item.completedAmnt}
                     </LogoText>
                  </FlexRowWrapper>
               </BarAndPercentageWrapper>
            </BarAndInfoWrapper>
         ))}
      </>
   );
}
