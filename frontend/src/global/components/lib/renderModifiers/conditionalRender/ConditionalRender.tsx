import type { ReactNode } from 'react';

interface IConditionalRender {
   children: ReactNode;
   condition: boolean;
}

export default function ConditionalRender(props: IConditionalRender): JSX.Element {
   const { children, condition } = props;
   return <>{condition ? children : null}</>;
}
