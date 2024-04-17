import RatLogo from '../RatLogo';
import { GradientBg, GradientBgLogoContainer, RatWrapper } from './Style';

interface IGradientBgLogo {
   sizeEm?: number;
}
export default function GradientBgLogo(props: IGradientBgLogo): JSX.Element {
   const { sizeEm } = props;

   return (
      <GradientBgLogoContainer size={sizeEm ? `${sizeEm}em` : '10em'}>
         <GradientBg></GradientBg>
         <RatWrapper style={{ marginTop: '2em' }}>
            <RatLogo size={sizeEm ? `${sizeEm / 1.75}em` : '2.5em'} />
         </RatWrapper>
      </GradientBgLogoContainer>
   );
}
