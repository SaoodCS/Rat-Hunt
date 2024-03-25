import { Refresh } from '@styled-icons/material-rounded/Refresh';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Range } from 'react-range';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { N_Form } from '../N_Form';
import { ErrorLabel } from '../style/Style';
import {
   Label,
   NumberLineInputWrapper,
   RefreshBtnContainer,
   RefreshBtnTransitioner,
   StyledDot,
   StyledLine,
   StyledLineWrapper,
   ValueAndRefreshBtnContainer,
   ValueAndRefreshBtnWrapper,
   ValueItem,
   ValueItemContainer,
} from './Style';

export interface INumberLineOptions {
   min: number;
   max: number;
   increment: number;
}

interface INumberLineInput extends N_Form.Inputs.I.CommonInputProps {
   numberLineOptions: INumberLineOptions;
   value: number | '';
}

export default function NumberLineInput(props: INumberLineInput): JSX.Element {
   const { label, name, value, error, handleChange, id, isDisabled, numberLineOptions } = props;
   const { min, max, increment } = numberLineOptions;
   const { isDarkTheme } = useThemeContext();
   const [lineStart, setLineStart] = useState(min - increment);
   const [inputHasValue, setInputHasValue] = useState(value !== '');
   const [hasError, setHasError] = useState(!!error);

   useEffect(() => {
      setLineStart(min - increment);
   }, [min, increment]);

   useEffect(() => {
      setInputHasValue(!(value === '' || value === lineStart));
   }, [value, lineStart]);

   useEffect(() => {
      setHasError(!!error);
   }, [error]);

   function amendHandleChange(newValue: number): void {
      const atLineStart = newValue === lineStart;
      handleChange({
         target: { name, value: atLineStart ? '' : newValue },
      });
   }

   return (
      <div>
         <NumberLineInputWrapper id={id}>
            <Range
               step={increment}
               min={lineStart}
               max={max}
               values={[inputHasValue ? (value as number) : lineStart]}
               disabled={isDisabled}
               onChange={(values) => amendHandleChange(values[0])}
               renderTrack={({ props, children, isDragged }) => {
                  const defaultStyles: CSSProperties = { ...props.style };
                  return (
                     <StyledLineWrapper
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        propsStyles={defaultStyles}
                        isDragged={isDragged}
                        isDarkTheme={isDarkTheme}
                        hasError={hasError}
                     >
                        <Label isDragged={isDragged} value={value} isDarkTheme={isDarkTheme}>
                           {label}
                        </Label>
                        <StyledLine
                           ref={props.ref}
                           inputHasValue={inputHasValue}
                           isDarkTheme={isDarkTheme}
                           value={value}
                           min={lineStart}
                           max={max}
                        >
                           {children}
                        </StyledLine>
                     </StyledLineWrapper>
                  );
               }}
               renderThumb={({ props, isDragged }) => {
                  const defaultStyles: CSSProperties = { ...props.style };
                  return (
                     <StyledDot
                        {...props}
                        propsStyles={defaultStyles}
                        isDragged={isDragged}
                        value={value}
                        isDarkTheme={isDarkTheme}
                     />
                  );
               }}
            />
            <ValueAndRefreshBtnWrapper isDarkTheme={isDarkTheme}>
               <ValueAndRefreshBtnContainer>
                  <ValueItemContainer>
                     <ValueItem inputHasValue={inputHasValue}>{value}</ValueItem>
                  </ValueItemContainer>
                  <RefreshBtnContainer>
                     <RefreshBtnTransitioner
                        onClick={() => amendHandleChange(lineStart)}
                        inputHasValue={inputHasValue}
                        isDarkTheme={isDarkTheme}
                        style={{ transition: 'all 0.2s ease' }}
                     >
                        <Refresh height="1.4em" />
                     </RefreshBtnTransitioner>
                  </RefreshBtnContainer>
               </ValueAndRefreshBtnContainer>
            </ValueAndRefreshBtnWrapper>
         </NumberLineInputWrapper>
         <ErrorLabel isDarkTheme={isDarkTheme}>{error}</ErrorLabel>
      </div>
   );
}
