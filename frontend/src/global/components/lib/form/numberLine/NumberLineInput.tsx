import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import type { MarkObj } from 'rc-slider/lib/Marks';
import { useEffect, useState } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import JSXHelper from '../../../../helpers/dataTypes/jsx/jsxHelper';
import ConditionalRender from '../../renderModifiers/conditionalRender/ConditionalRender';
import type { N_Form } from '../N_Form';
import { ErrorLabel, InputContainer, LabelWrapper } from '../textOrNumber/Style';
import {
   InputSliderWrapper,
   LabelIndicatorLine,
   LabelIndicatorLineWrapper,
   NumberLineInputLabel,
   activeDotStyles,
   activeLineStyles,
   dotTouchAreaStyles,
   inactiveLineStyles,
   numberLabelStyles,
   numberLineStyles,
} from './style/Style';

export interface INumberRangeChangeEvent {
   target: {
      name: string | number;
      value: number | '';
      valueType: 'number';
   };
}

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
      placeholder,
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
   const [isActive, setIsActive] = useState(false);
   const [inputHasValue, setInputHasValue] = useState(value !== '');
   const [hasError, setHasError] = useState(!!error);

   useEffect(() => {
      if (isActive && !inputHasValue) {
         const event: INumberRangeChangeEvent = {
            target: {
               name,
               value: min,
               valueType: 'number',
            },
         };
         handleChange(event);
      }
   }, [isActive]);

   useEffect(() => {
      setInputHasValue(value !== '');
   }, [value]);

   useEffect(() => {
      setHasError(!!error);
   }, [error]);

   function handleFocus(): void {
      setIsActive(true);
   }

   function handleBlur(): void {
      setIsActive(false);
   }

   function createMarks(): { [key: number]: MarkObj } {
      const marks: { [key: number]: MarkObj } = {};
      for (let i = min; i <= max; i++) {
         if (i === min && !inputHasValue) continue;
         marks[i] = {
            style: numberLabelStyles(value === i, min, max, i, displayAllNumbers),
            label: i,
         };
      }
      return marks;
   }

   function handleChangeWithValueType(currentVal: number | number[]): void {
      const event: INumberRangeChangeEvent = {
         target: {
            name,
            value: currentVal as number,
            valueType: 'number',
         },
      };
      handleChange(event);
   }

   return (
      <InputContainer style={{ height: '5em' }}>
         <LabelWrapper htmlFor={id}>
            <NumberLineInputLabel
               focusedInput={isActive}
               isRequired={isRequired}
               inputHasValue={inputHasValue}
               isDarkTheme
               isDisabled={isDisabled}
               hideLabel={false}
            >
               {placeholder}
            </NumberLineInputLabel>
         </LabelWrapper>
         <InputSliderWrapper inputHasValue={inputHasValue}>
            <Slider
               onFocus={handleFocus}
               onBlur={handleBlur}
               draggableTrack
               pushable
               allowCross
               keyboard
               step={1}
               min={min}
               max={max}
               value={value || min}
               onChange={(currentVal) => handleChangeWithValueType(currentVal)}
               disabled={isDisabled}
               marks={createMarks()}
               styles={{
                  track: activeLineStyles,
                  rail: inactiveLineStyles(hasError),
                  handle: activeDotStyles(inputHasValue),
               }}
               dotStyle={dotTouchAreaStyles(min, max)}
               style={numberLineStyles}
            />
            <ConditionalRender condition={displayLinePointers}>
               <LabelIndicatorLineWrapper currentValue={value}>
                  {JSXHelper.repeatJSX(<LabelIndicatorLine minValue={min} maxValue={max} />, 9)}
               </LabelIndicatorLineWrapper>
            </ConditionalRender>
         </InputSliderWrapper>
         <ErrorLabel isDarkTheme={isDarkTheme} style={{ marginTop: '1.5em' }}>
            {error}
         </ErrorLabel>
      </InputContainer>
   );
}
