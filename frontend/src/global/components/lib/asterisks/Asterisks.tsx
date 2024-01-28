/* eslint-disable @typescript-eslint/naming-convention */
import { StyledAsterisk } from './Style';

interface IAsterisks {
   amount?: number;
   size: string;
}

export default function Asterisks(props: IAsterisks): JSX.Element {
   const { amount, size } = props;
   return (
      <div>
         {Array.from({ length: amount || 8 }, (_, i) => (
            <StyledAsterisk key={i} size={size} />
         ))}
      </div>
   );
}
