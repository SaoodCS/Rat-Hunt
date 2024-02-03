import { useState } from 'react';
import { StyledLink } from '../../../global/components/app/layout/footer/Style';
import { LogoText } from '../../../global/components/app/logo/LogoText';
import RatExterminationLogo from '../../../global/components/app/logo/RatExterminationLogo';
import RatLogo from '../../../global/components/app/logo/RatLogo';
import Fader from '../../../global/components/lib/animation/fader/Fader';
import { StaticButton } from '../../../global/components/lib/button/staticButton/Style';
import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import { StyledForm } from '../../../global/components/lib/form/form/Style';
import InputCombination from '../../../global/components/lib/form/inputCombination/InputCombination';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import ConditionalRender from '../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../global/context/widget/apiError/hooks/useApiErrorContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import useForm from '../../../global/hooks/useForm';
import NameFormClass from './nameForm/Class';

function LogoFader(): JSX.Element {
   // This component fades in the RatExterminationLogo and then fades out the RatExterminationLogo and fades in the RatLogo every 3 seconds:
   const [isRatExtermination, setIsRatExtermination] = useState(true);
   setTimeout(() => {
      setIsRatExtermination(!isRatExtermination);
   }, 5000);
   return (
      <>
         <ConditionalRender condition={isRatExtermination}>
            <Fader fadeInCondition={isRatExtermination} transitionDuration={3}>
               <RatExterminationLogo size={'15em'} />
            </Fader>
         </ConditionalRender>
         <ConditionalRender condition={!isRatExtermination}>
            <Fader fadeInCondition={!isRatExtermination} transitionDuration={3}>
               <RatLogo size={'15em'} />
            </Fader>
         </ConditionalRender>
      </>
   );
}

export default function Play(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Rat Hunt');
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      NameFormClass.form.initialState,
      NameFormClass.form.initialErrors,
      NameFormClass.form.validate,
   );

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      console.log('isFormValid', isFormValid);
      if (!isFormValid) return;
   }

   return (
      <FlexColumnWrapper justifyContent="center" alignItems="center" height="100%">
         <LogoFader />
         <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
            {NameFormClass.form.inputs
               .filter((input) => input.name !== 'joinSessionId' || form.joinOrHost === 'join')
               .map((input) => (
                  <InputCombination
                     key={input.id}
                     id={input.id}
                     placeholder={input.placeholder}
                     name={input.name}
                     isRequired={input.isRequired}
                     autoComplete={input.autoComplete}
                     handleChange={handleChange}
                     error={errors[input.name]}
                     type={input.type}
                     value={form[input.name]}
                     dropDownOptions={input.dropDownOptions}
                  />
               ))}

            <StaticButton isDarkTheme={isDarkTheme}>Submit</StaticButton>
         </StyledForm>
      </FlexColumnWrapper>
   );
}
