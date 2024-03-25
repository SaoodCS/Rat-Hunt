import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { N_Form } from '../N_Form';

export interface INumberLineOptions {
   min: number;
   max: number;
   displayAllNumbers: boolean;
   displayLinePointers: boolean;
}

interface INumberLineInput extends N_Form.Inputs.I.CommonInputProps {
   numberLineOptions: INumberLineOptions;
   value: number | '';
}

export default function NumberLineInput(props: INumberLineInput): JSX.Element {
   const {
      label,
      name,
      isRequired,
      value,
      error,
      handleChange,
      id,
      isDisabled,
      numberLineOptions,
   } = props;
   const { min, max, displayAllNumbers, displayLinePointers } = numberLineOptions;
   const { isDarkTheme } = useThemeContext();

   return <div>New Number Line Input</div>;
}
