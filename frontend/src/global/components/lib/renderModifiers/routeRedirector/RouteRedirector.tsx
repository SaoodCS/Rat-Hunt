import { Navigate, Outlet } from 'react-router-dom';

interface RouteRedirector {
   redirectIf: boolean;
   redirectTo: string;
   children?: JSX.Element;
}

export default function RouteRedirector(props: RouteRedirector): JSX.Element {
   const { redirectIf, redirectTo, children } = props;
   if (redirectIf) {
      return <Navigate to={redirectTo} replace={true} />;
   }
   return children ? children : <Outlet />;
}
