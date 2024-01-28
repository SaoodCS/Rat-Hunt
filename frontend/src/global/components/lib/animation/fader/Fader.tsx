import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface IFader {
   children: ReactNode;
   fadeInCondition: boolean;
}

export default function Fader(props: IFader): JSX.Element {
   const { children, fadeInCondition } = props;
   return (
      <motion.main
         initial={{ opacity: 0 }}
         animate={{ opacity: fadeInCondition ? 1 : 0 }}
         transition={{ duration: 0.5 }}
      >
         {children}
      </motion.main>
   );
}
