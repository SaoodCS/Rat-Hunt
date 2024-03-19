import RatLogo from '../../../../../global/components/app/logo/RatLogo';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import Color from '../../../../../global/css/colors';
import TargettedRatLogo from '../../../../../global/components/app/logo/targettedRatLogo/TargettedRatLogo';
import { RatOrPlayerSplashWrapper } from './style/Style';

interface IRatOrPlayerSplash {
   isUserRat: boolean;
}

export default function RatOrPlayerSplash(props: IRatOrPlayerSplash): JSX.Element {
   const { isUserRat } = props;
   return (
      <RatOrPlayerSplashWrapper>
         <TextColourizer
            fontSize="3em"
            textAlign="center"
            padding="0em 0em 0.25em 0em"
            gradient={{
               deg: '180deg',
               startColor: Color.setRgbOpacity(
                  isUserRat ? Color.darkThm.error : Color.darkThm.accent,
                  1,
               ),
               endColor: Color.setRgbOpacity(
                  isUserRat ? Color.darkThm.error : Color.darkThm.accent,
                  isUserRat ? 0.75 : 0.5,
               ),
            }}
         >
            {isUserRat ? 'You are the rat!' : 'You are a rat hunter!'}
         </TextColourizer>
         <ConditionalRender condition={!isUserRat}>
            <TargettedRatLogo sizeEm={20} />
         </ConditionalRender>
         <ConditionalRender condition={isUserRat}>
            <RatLogo size={'12em'} color={Color.setRgbOpacity(Color.darkThm.error, 0.75)} />
         </ConditionalRender>
      </RatOrPlayerSplashWrapper>
   );
}
