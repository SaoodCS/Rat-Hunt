import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { TooltipContent, TooltipWrapper } from './Style';

export type ITooltipPositioning =
   | 'top'
   | 'left'
   | 'right'
   | 'bottom'
   | 'center-left'
   | 'center-right';

interface IToolTip {
   children: React.ReactNode;
   content: React.ReactNode;
   width?: string;
   height?: string;
   positioning?: ITooltipPositioning;
}

export default function Tooltip(props: IToolTip): JSX.Element {
   const { children, content, width, height } = props;
   const { isDarkTheme } = useThemeContext();

   return (
      <TooltipWrapper>
         <TooltipContent
            isDarkTheme={isDarkTheme}
            width={width || 'auto'}
            height={height || 'auto'}
            positioning={props.positioning || 'top'}
         >
            {content}
         </TooltipContent>
         {children}
      </TooltipWrapper>
   );
}
