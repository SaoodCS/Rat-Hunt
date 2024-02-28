import { LogoText } from '../../../../../global/components/app/logo/LogoText';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import Color from '../../../../../global/css/colors';

export default function GamplayForm(): JSX.Element {
   return (
      <FlexRowWrapper position="absolute" height="1em">
         <LogoText size="1em" color={Color.darkThm.accent}>
            Current Turn :&nbsp;
         </LogoText>
         <LogoText size="1em" color={Color.darkThm.accent}>
            You
         </LogoText>
      </FlexRowWrapper>
   );
}
