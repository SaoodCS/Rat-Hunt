import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Color from '../../../css/colors';
import NumberHelper from '../../../helpers/dataTypes/number/NumberHelper';
import { LogoText } from '../../app/logo/LogoText';
import { TextColourizer } from '../font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import type { ITooltipPositioning } from '../tooltip/Tooltip';
import Tooltip from '../tooltip/Tooltip';
import {
   BarAndInfoWrapper,
   BarAndPercentageWrapper,
   BarBackground,
   BarTitle,
   CompletedBar,
} from './Style';

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
   const {
      positioning: toolTipPos,
      width: toolTipWidth,
      height: toolTipHeight,
   } = tooltipOptions || {};
   const { isDarkTheme } = useThemeContext();

   function getCompletedPercentage(completedAmnt: number, target: number): number {
      return NumberHelper.calcPercentage(completedAmnt, target, true);
   }

   function getRemainingAmount(completed: number, target: number): number {
      return target - completed;
   }

   return (
      <>
         {data.map((item) => (
            <BarAndInfoWrapper key={item.label}>
               {/* <BarTitle>{item.label}</BarTitle> */}
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
                              {/* <TextColourizer padding="0em 0em 0.5em 0em" color={Color.darkThm.txt}>
                                 Target: {NumberHelper.asCurrencyStr(item.target)}
                              </TextColourizer> */}
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
                        />
                     </Tooltip>
                  </BarBackground>
                  <div
                     style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'absolute',
                        right: 0,
                        left: barWidth || '20em',
                        paddingLeft: '1em',
                        paddingRight: '1em',
                     }}
                  >
                     <LogoText
                        color={Color.setRgbOpacity(Color.darkThm.txt, 0.75)}
                        size="0.75em"
                        style={{ padding: '0em 0em 0em 0.5em' }}
                     >
                        {item.label}
                     </LogoText>
                     <LogoText
                        color={Color.setRgbOpacity(Color.darkThm.txt, 0.75)}
                        size="0.75em"
                        style={{ padding: '0em 0em 0em 0.5em' }}
                     >
                        {item.completedAmnt}
                     </LogoText>
                  </div>
               </BarAndPercentageWrapper>
            </BarAndInfoWrapper>
         ))}
      </>
   );
}
