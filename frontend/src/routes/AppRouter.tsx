import { BrowserRouter, Routes } from 'react-router-dom';
import WidgetContextProviders from '../global/context/widget/WidgetContextProviders';
import LandingRoute from './landing/LandingRoute';
import MainRoutes from './main/MainRoutes';
import NotFoundRoute from './notFound/NotFoundRoute';

// TODO: check to ensure that any routes that are not found e.g. /fweriofj will redirect to the 404 page
// TODO: check to ensure that any subroutes that are not found e.g. /main/fweriofj will redirect to the 404 page
// TODO: check to ensure that any subroutes that are not found e.g. /admin/fweriofj will redirect to the 404 page

export default function AppRouter(): JSX.Element {
   return (
      <BrowserRouter>
         <WidgetContextProviders>
            <Routes>
               {LandingRoute()}
               {NotFoundRoute()}
               {MainRoutes()}
            </Routes>
         </WidgetContextProviders>
      </BrowserRouter>
   );
}
