import { Fragment } from 'react';
import Color from '../../../../css/colors';
import Device from '../../../../helpers/pwa/deviceHelper';
import { TextColourizer } from '../../../lib/font/textColorizer/TextColourizer';
import { TextIndenter } from '../../../lib/font/textIndenter/TextIndenter';
import { VerticalSeperator } from '../../../lib/positionModifiers/verticalSeperator/VerticalSeperator';
import ConditionalRender from '../../../lib/renderModifiers/conditionalRender/ConditionalRender';

interface IInstallAppSteps {
   title?: string;
}

export default function InstallAppSteps(props: IInstallAppSteps): JSX.Element {
   const { title } = props;
   const iPhoneInstallSteps = [
      'Tap the share button',
      'Tap "Add to Home Screen"',
      'Tap "Add"',
      'Enjoy!',
   ];

   const desktopInstallSteps = [
      'Click the 3 vertical dots in the top right corner of your browser',
      'Click "More Tools"',
      'Click "Create Shortcut"',
      'Enjoy!',
   ];

   const androidInstallSteps = [
      'Click the 3 vertical dots in the top right corner of your browser',
      'Click "Add to Home Screen"',
      'Click "Add"',
      'Enjoy!',
   ];

   return (
      <>
         <ConditionalRender condition={!!title}>
            <TextColourizer bold>
               {title}
               <VerticalSeperator />
            </TextColourizer>
         </ConditionalRender>
         <ConditionalRender condition={Device.isIphone()}>
            {iPhoneInstallSteps.map((step, index) => (
               <Fragment key={step}>
                  <TextColourizer color={Color.darkThm.accent}>
                     <TextIndenter /> {`${index + 1}. `}
                  </TextColourizer>
                  {step}
                  <VerticalSeperator />
               </Fragment>
            ))}
         </ConditionalRender>
         <ConditionalRender condition={Device.isAndroid()}>
            {androidInstallSteps.map((step, index) => (
               <Fragment key={step}>
                  <TextColourizer color={Color.darkThm.accent}>
                     <TextIndenter /> {`${index + 1}. `}
                  </TextColourizer>
                  {step}
                  <VerticalSeperator />
               </Fragment>
            ))}
         </ConditionalRender>
         <ConditionalRender condition={Device.isDesktop()}>
            {desktopInstallSteps.map((step, index) => (
               <Fragment key={step}>
                  <TextColourizer color={Color.darkThm.accent}>
                     <TextIndenter /> {`${index + 1}. `}
                  </TextColourizer>
                  {step}
                  <VerticalSeperator />
               </Fragment>
            ))}
         </ConditionalRender>
      </>
   );
}
