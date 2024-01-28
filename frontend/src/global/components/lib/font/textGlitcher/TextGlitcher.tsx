import { GlitchDiv } from './Style';

interface ITextGlitcher {
   children: string;
}

export default function TextGlitcher(props: ITextGlitcher): JSX.Element {
   const { children } = props;

   return <GlitchDiv title={children}>{children}</GlitchDiv>;
}
