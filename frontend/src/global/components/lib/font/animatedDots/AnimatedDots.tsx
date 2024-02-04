import { useEffect, useState } from 'react';

interface IAnimatedDotsProps {
   count: number;
}

export default function AnimatedDots(props: IAnimatedDotsProps): JSX.Element {
   const { count } = props;
   const [dotsCount, setDotsCount] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setDotsCount((prevCount) => (prevCount + 1) % (count + 1));
      }, 500);

      return () => clearInterval(interval);
   }, []);

   return <span>{'. '.repeat(dotsCount)}</span>;
}
