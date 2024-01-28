import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import { DimOverlay } from '../../overlay/dimOverlay/DimOverlay';
import { CenterWrapper } from '../../positionModifiers/centerers/CenterWrapper';
import ConditionalRender from '../../renderModifiers/conditionalRender/ConditionalRender';
import { CustomSpinner } from '../Style';

interface ILoader {
   isDisplayed: boolean;
   zIndex?: number;
}

export default function Loader(props: ILoader): JSX.Element {
   const { isDisplayed, zIndex } = props;
   const { isDarkTheme } = useThemeContext();

   return (
      <ConditionalRender condition={isDisplayed}>
         <DimOverlay isDisplayed={isDisplayed} />
         <CenterWrapper centerOfScreen zIndex={zIndex}>
            <CustomSpinner isDarkTheme={isDarkTheme} />
         </CenterWrapper>
      </ConditionalRender>
   );
}
