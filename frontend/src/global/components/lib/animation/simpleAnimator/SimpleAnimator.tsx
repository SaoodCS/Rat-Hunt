import type { Orchestration, Tween } from 'framer-motion';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface ISimpleAnimator {
   key: string;
   animateType: AnimationType[];
   duration?: Tween['duration'];
   delay?: Orchestration['delay'];
   staggerChildren?: Orchestration['staggerChildren'];
   staggerDirection?: Orchestration['staggerDirection'];
   ease?: Tween['ease'];
   type?: 'decay' | 'spring' | 'keyframes' | 'tween' | 'inertia';
   startWhen?: boolean;
}

export const SimpleAnimator = styled(motion.div).attrs((props: ISimpleAnimator) => {
   const {
      animateType,
      duration,
      delay,
      staggerChildren,
      staggerDirection,
      key,
      type,
      startWhen = true,
   } = props;

   const slideType = animateType.find((type) => typeof type === 'object') as SlideType | undefined;
   const slideTypeVal = slideTypeValues(slideType);

   // Animate From:
   const initial: MotionDivParams['initial'] = {
      opacity: animateType.includes('fade') ? 0 : 1,
      scale: animateType.includes('expand') ? 0 : 1,
      x: slideTypeVal.initialX,
      y: slideTypeVal.initialY,
   };
   const animate: MotionDivParams['animate'] = {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
   };

   // Animate on Unmount:
   const exit: MotionDivParams['exit'] = {
      opacity: animateType.includes('fade') ? 0 : 1,
      scale: animateType.includes('expand') ? 0 : 1,
      x: slideTypeVal.unmountX,
      y: slideTypeVal.unmountY,
   };

   // Animation Effects:
   const transition: MotionDivParams['transition'] = {
      duration,
      delay,
      staggerChildren,
      staggerDirection,
      type,
   };
   return {
      key,
      initial,
      animate: startWhen ? animate : initial,
      exit,
      transition,
   };
})<ISimpleAnimator>``;

//
//
//
//
//
//
//
//
//
//

// -- Helper Functions -- //
const slideTypeValues = (
   slideType: SlideType | undefined,
): { initialX: number; initialY: number; unmountX: number; unmountY: number } => {
   if (!slideType) return { initialX: 0, initialY: 0, unmountX: 0, unmountY: 0 };
   const initialX = slideType.from === 'left' ? -100 : slideType.from === 'right' ? 100 : 0;
   const initialY = slideType.from === 'top' ? -100 : slideType.from === 'bottom' ? 100 : 0;
   const unmountX =
      slideType.onUnmount === 'toLeft' ? -100 : slideType.onUnmount === 'toRight' ? 100 : 0;
   const unmountY =
      slideType.onUnmount === 'toTop' ? -100 : slideType.onUnmount === 'toBottom' ? 100 : 0;
   return { initialX, initialY, unmountX, unmountY };
};

// -- Helper Types -- //
type SlideType = {
   from: 'left' | 'right' | 'top' | 'bottom';
   onUnmount?: 'toLeft' | 'toRight' | 'toTop' | 'toBottom';
};
type AnimationType = 'fade' | 'expand' | 'rotate' | SlideType;
type MotionDivParams = Parameters<typeof motion.div>[0];
