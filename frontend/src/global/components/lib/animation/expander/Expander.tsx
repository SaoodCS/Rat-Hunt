import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface IExpander {
   children: ReactNode;
   expandOutCondition: boolean;
}

const expandVariants: Variants = {
   hidden: {
      opacity: 0,
      scale: 0,
   },
   visible: (expandOutCondition: boolean) => ({
      opacity: 1,
      scale: expandOutCondition ? 1 : 0,
      transition: {
         duration: 0.1,
      },
   }),
};

export default function Expander(props: IExpander): JSX.Element {
   const { children, expandOutCondition } = props;
   return (
      <motion.div
         initial="hidden"
         animate="visible"
         variants={expandVariants}
         custom={expandOutCondition}
         style={{
            width: `100%`,
            height: `100%`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
         }}
      >
         {children}
      </motion.div>
   );
}
