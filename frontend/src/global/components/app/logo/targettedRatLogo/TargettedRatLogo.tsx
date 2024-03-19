import RatLogo from '../RatLogo';
import { InnerTarget, RatWrapper, TargetWrapper, TargettedRatLogoContainer } from './style/Style';
import { Target } from '@styled-icons/zondicons/Target';

interface ITargettedRatLogo {
   sizeEm?: number;
}
export default function TargettedRatLogo(props: ITargettedRatLogo): JSX.Element {
   const { sizeEm } = props;

   return (
      <TargettedRatLogoContainer size={sizeEm ? `${sizeEm}em` : '10em'}>
         <InnerTarget></InnerTarget>
         <TargetWrapper>
            <Target size={sizeEm ? `${sizeEm}em` : '10em'} />
         </TargetWrapper>
         <RatWrapper>
            <RatLogo size={sizeEm ? `${sizeEm / 4}em` : '2.5em'} />
         </RatWrapper>
      </TargettedRatLogoContainer>
   );
}
