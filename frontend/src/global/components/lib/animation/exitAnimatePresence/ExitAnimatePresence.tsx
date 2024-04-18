import { AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface IExitAnimatePresence {
   exitWhen: boolean;
   children: ReactNode;
}

export default function ExitAnimatePresence(props: IExitAnimatePresence): JSX.Element {
   const { exitWhen, children } = props;
   return <AnimatePresence>{!exitWhen && children}</AnimatePresence>;
}
