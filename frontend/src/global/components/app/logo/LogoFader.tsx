import { useState } from 'react';
import Fader from '../../lib/animation/fader/Fader';
import ConditionalRender from '../../lib/renderModifiers/conditionalRender/ConditionalRender';
import RatExterminationLogo from './RatExterminationLogo';
import RatLogo from './RatLogo';

export default function LogoFader(): JSX.Element {
   const [isRatExtermination, setIsRatExtermination] = useState(true);
   setTimeout(() => {
      setIsRatExtermination(!isRatExtermination);
   }, 5000);
   return (
      <>
         <ConditionalRender condition={isRatExtermination}>
            <Fader fadeInCondition={isRatExtermination} transitionDuration={3}>
               <RatExterminationLogo size={'15em'} />
            </Fader>
         </ConditionalRender>
         <ConditionalRender condition={!isRatExtermination}>
            <Fader fadeInCondition={!isRatExtermination} transitionDuration={3}>
               <RatLogo size={'15em'} />
            </Fader>
         </ConditionalRender>
      </>
   );
}
