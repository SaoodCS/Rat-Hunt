import { Navigate, Route } from 'react-router-dom';
import ErrorPage from '../../pages/error/ErrorPage';

export default function LandingRoute(): JSX.Element {
   return (
      <Route
         path="/"
         errorElement={<ErrorPage />}
         element={<Navigate to="main" replace={true} />}
      />
   );
}
