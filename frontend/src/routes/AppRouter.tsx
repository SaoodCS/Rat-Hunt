import { Routes, useLocation } from 'react-router-dom';
import WidgetContextProviders from '../global/context/widget/WidgetContextProviders';
import LandingRoute from './landing/LandingRoute';
import MainRoutes from './main/MainRoutes';
import NotFoundRoute from './notFound/NotFoundRoute';
import { AnimatePresence } from 'framer-motion';

export default function AppRouter(): JSX.Element {
   const location = useLocation();
   return (
      <WidgetContextProviders>
         <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
               {LandingRoute()}
               {NotFoundRoute()}
               {MainRoutes()}
            </Routes>
         </AnimatePresence>
      </WidgetContextProviders>
   );
}
