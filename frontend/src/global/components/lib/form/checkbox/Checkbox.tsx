/* eslint-disable react/jsx-no-undef */
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { N_Form } from '../N_Form';
import { CheckboxAndLabelWrapper, CheckboxContainer, CheckboxLabel, StyledCheckbox } from './Style';

export interface ICheckboxInput extends N_Form.Inputs.I.CommonInputProps {
   value: boolean;
}

export default function CheckboxInput(props: ICheckboxInput): JSX.Element {
   const { label, name, isRequired, handleChange, value, error, id, isDisabled } = props;
   const { isDarkTheme } = useThemeContext();
   return (
      <div>
         <CheckboxAndLabelWrapper>
            <CheckboxContainer>
               <StyledCheckbox
                  id={id}
                  checked={value}
                  onChange={(e) =>
                     handleChange({
                        target: {
                           name,
                           value: e.target.checked,
                        },
                     })
                  }
                  required={isRequired}
                  disabled={isDisabled}
                  isDarkTheme={isDarkTheme}
                  hasError={!!error}
               />
            </CheckboxContainer>
            <CheckboxLabel htmlFor={id}>{label}</CheckboxLabel>
         </CheckboxAndLabelWrapper>
      </div>
   );
}
