import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import type { MarkObj } from 'rc-slider/lib/Marks';
import { useEffect, useState } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import JSXHelper from '../../../../helpers/dataTypes/jsx/jsxHelper';
import type { IDateChangeEvent, INumberRangeChangeEvent } from '../../../../hooks/useForm';
import { ErrorLabel, InputContainer, LabelWrapper } from '../input/Style';
import {
   InputSliderWrapper,
   LabelIndicatorLine,
   LabelIndicatorLineWrapper,
   NumberSliderInputLabel,
   activeDotStyles,
   activeLineStyles,
   dotTouchAreaStyles,
   inactiveLineStyles,
   numberLabelStyles,
   numberSliderStyles,
} from './style/Style';
import ConditionalRender from '../../renderModifiers/conditionalRender/ConditionalRender';

interface INumberSliderInput {
   placeholder: string;
   name: string | number;
   isRequired?: boolean;
   value: number | '';
   error: string;
   handleChange: (
      e:
         | React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
         | IDateChangeEvent
         | INumberRangeChangeEvent,
   ) => void;
   id: string;
   isDisabled: boolean | undefined;
   type: string;
   numberLineInputProps: {
      min: number;
      max: number;
      displayAllNumbers?: boolean;
      displayLinePointers?: boolean;
   };
}

export default function NumberSliderInput(props: INumberSliderInput): JSX.Element {
   const {
      placeholder,
      name,
      isRequired,
      value,
      error,
      handleChange,
      id,
      isDisabled,
      numberLineInputProps,
   } = props;
   const { min, max, displayAllNumbers, displayLinePointers } = numberLineInputProps;
   const { isDarkTheme } = useThemeContext();
   const [isActive, setIsActive] = useState(false);
   const [inputHasValue, setInputHasValue] = useState(!!value || value === 0 || value !== '');

   useEffect(() => {
      if (isRequired) {
         const val = (value || min) as number;
         handleChange({ numberRangeValue: val, name });
      }
   }, []);

   useEffect(() => {
      setInputHasValue(!!value || value === 0 || value !== '');
   }, [value]);

   function handleFocus(): void {
      setIsActive(true);
   }

   function handleBlur(): void {
      setIsActive(false);
   }

   function createMarks(min: number, max: number, value: number): { [key: number]: MarkObj } {
      const marks: { [key: number]: MarkObj } = {};
      for (let i = min; i <= max; i++) {
         marks[i] = {
            style: numberLabelStyles(value === i, min, max, i, displayAllNumbers || false),
            label: i,
         };
      }
      return marks;
   }

   return (
      <InputContainer style={{ height: '5em' }}>
         <LabelWrapper htmlFor={id || name.toString()} style={{}}>
            <NumberSliderInputLabel
               focusedInput={isActive}
               isRequired={isRequired || false}
               inputHasValue={inputHasValue}
               isDarkTheme
               isDisabled={isDisabled || false}
               hideLabel={false}
            >
               {placeholder}
            </NumberSliderInputLabel>
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
               onChange={(currentVal) => {
                  const val = (currentVal || min) as number;
                  handleChange({ numberRangeValue: val, name });
               }}
               disabled={isDisabled}
               marks={createMarks(min, max, value || min)}
               styles={{
                  track: activeLineStyles,
                  rail: inactiveLineStyles(!!error),
                  handle: activeDotStyles(inputHasValue),
               }}
               dotStyle={dotTouchAreaStyles(min, max)}
               style={numberSliderStyles}
            />
            <ConditionalRender condition={displayLinePointers || false}>
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
