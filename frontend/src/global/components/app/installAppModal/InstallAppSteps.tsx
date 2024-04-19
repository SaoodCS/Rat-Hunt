import CSS_Color from '../../../css/utils/colors';
import Device from '../../../helpers/pwa/deviceHelper';
import { TextColourizer } from '../../lib/font/textColorizer/TextColourizer';
import { ListItem, OrderedList } from '../../lib/newList/Style';
import { VerticalSeperator } from '../../lib/positionModifiers/verticalSeperator/VerticalSeperator';
import ConditionalRender from '../../lib/renderModifiers/conditionalRender/ConditionalRender';

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
            <TextColourizer>
               {title}
               <VerticalSeperator />
            </TextColourizer>
         </ConditionalRender>
         <OrderedList
            bulletType="decimal"
            padding="0.5em 0em 1em 1.5em"
            margin="0"
            bulletAndTextSpacing="0.3em"
            bulletColor={CSS_Color.darkThm.accent}
            bulletBold
         >
            <ConditionalRender condition={Device.isIphone()}>
               {iPhoneInstallSteps.map((step) => (
                  <ListItem key={step}>
                     <TextColourizer color={CSS_Color.darkThm.txt}>{step}</TextColourizer>
                  </ListItem>
               ))}
            </ConditionalRender>
            <ConditionalRender condition={Device.isAndroid()}>
               {androidInstallSteps.map((step) => (
                  <ListItem key={step}>
                     <TextColourizer color={CSS_Color.darkThm.txt}>{step}</TextColourizer>
                  </ListItem>
               ))}
            </ConditionalRender>
            <ConditionalRender condition={Device.isDesktop()}>
               {desktopInstallSteps.map((step) => (
                  <ListItem key={step}>
                     <TextColourizer color={CSS_Color.darkThm.txt}>{step}</TextColourizer>
                  </ListItem>
               ))}
            </ConditionalRender>
         </OrderedList>
      </>
   );
}
