import { Calendar } from '@styled-icons/boxicons-solid/Calendar';
import { CloseCircle } from '@styled-icons/evaicons-solid/CloseCircle';
import { useEffect, useState } from 'react';
import DateHelper from '../../../../../../../shared/lib/helpers/date/DateHelper';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { N_Form } from '../N_Form';
import { ErrorLabel, InputWrapper } from '../style/Style';
import { ClearIconWrapper, DateInput, DatePickerLabel } from './Style';

interface IDatePickerInput extends N_Form.Inputs.I.CommonInputProps {
   value: Date | '';
}

export default function DatePickerInput(props: IDatePickerInput): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { label, name, isRequired, handleChange, value, error, id, isDisabled } = props;
   const [hasError, setHasError] = useState<boolean>(!!error);
   const [hasFocus, setHasFocus] = useState<boolean>(false);

   useEffect(() => {
      setHasError(!!error);
   }, [error]);

   function hasValue(): boolean {
      return value !== '';
   }

   function amendHandleChange(e: React.ChangeEvent<HTMLInputElement>): void {
      const newVal = e.target.value;
      handleChange({
         target: {
            name,
            value: newVal === '' ? '' : new Date(newVal),
         },
      });
   }

   return (
      <InputWrapper>
         <DatePickerLabel
            htmlFor={id}
            hasValue={hasValue()}
            isDarkTheme={isDarkTheme}
            isDisabled={isDisabled}
            hasError={hasError}
            hasFocus={hasFocus}
         >
            {hasValue() ? DateHelper.prettify(value as Date) : label}
         </DatePickerLabel>
         <ClearIconWrapper
            onClick={() => handleChange({ target: { name, value: '' } })}
            hasValue={hasValue()}
            isDarkTheme={isDarkTheme}
         >
            {hasValue() ? <CloseCircle /> : <Calendar />}
         </ClearIconWrapper>
         <DateInput
            type="date"
            name={name.toString()}
            id={id}
            onChange={amendHandleChange}
            value={hasValue() ? DateHelper.toYYYYMMDD(value as Date) : ''}
            placeholder={label}
            isDarkTheme={isDarkTheme}
            hasError={hasError}
            isDisabled={isDisabled}
            isRequired={isRequired}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            onClick={(e) => e.currentTarget.showPicker()}
         />
         <ErrorLabel isDarkTheme={isDarkTheme}>{error}</ErrorLabel>
      </InputWrapper>
   );
}
