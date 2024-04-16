/* eslint-disable @typescript-eslint/naming-convention */
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RouteTransitionerProps {
   children: ReactNode;
   startAnimation?: Parameters<typeof motion.div>[0]['initial'];
   endAnimation?: Parameters<typeof motion.div>[0]['animate'];
   leavingPageAnimation?: Parameters<typeof motion.div>[0]['exit'];
   duration?: number;
   style?: Parameters<typeof motion.div>[0]['style'];
}

export default function RouteTransitioner(props: RouteTransitionerProps): JSX.Element {
   const {
      children,
      startAnimation = { opacity: 0 },
      endAnimation = { opacity: 1 },
      leavingPageAnimation = { opacity: 0 },
      duration = 0.3,
      style = { width: '100dvw', height: '100dvh' },
   } = props;
   return (
      <motion.div
         initial={startAnimation}
         animate={endAnimation}
         exit={leavingPageAnimation}
         transition={{ duration }}
         style={style}
      >
         {children}
      </motion.div>
   );
}
