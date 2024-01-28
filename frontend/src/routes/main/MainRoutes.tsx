import { Navigate, Route } from 'react-router-dom';
import MainLayout from '../../pages/main/MainLayout';
import Homepage from '../../pages/main/home/Homepage';
import Settings from '../../pages/main/settings/Settings';

export default function MainRoutes(): JSX.Element {
   return (
      <Route path="/main" element={<MainLayout />}>
         <Route index element={<Navigate to="home" replace={true} />} />
         <Route path="home" element={<Homepage />} />
         <Route path="settings" element={<Settings />} />
      </Route>
   );
}
