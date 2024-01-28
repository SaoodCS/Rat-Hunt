import { useNavigate, useSearchParams } from 'react-router-dom';

export default function useURLState<T extends string>({
   key,
   defaultValue,
}: {
   key: string;
   defaultValue?: T;
}): [T, (value: T) => void] {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();

   const setter = (value: T): void => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set(key, value as string);
      navigate(`?${newParams.toString()}`, { replace: true }); //setSearchParams(newParams);
   };
   return [(searchParams.get(key) || defaultValue || '') as T, setter];
}
