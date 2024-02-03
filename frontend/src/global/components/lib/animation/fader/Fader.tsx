import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface IFader {
   children: ReactNode;
   fadeInCondition: boolean;
   transitionDuration?: number;
}

export default function Fader(props: IFader): JSX.Element {
   const { children, fadeInCondition, transitionDuration } = props;
   return (
      <motion.main
         initial={{ opacity: 0 }}
         animate={{ opacity: fadeInCondition ? 1 : 0 }}
         transition={{ duration: transitionDuration || 0.5 }}
      >
         {children}
      </motion.main>
   );
}
