import { useLocation, useNavigate } from 'react-router-dom';

export default function useCustomNavigate(): (path: string) => void {
   const navigate = useNavigate();
   const location = useLocation();
   return (path: string): void => {
      if (location.pathname !== path) navigate(path, { replace: true });
   };
}
