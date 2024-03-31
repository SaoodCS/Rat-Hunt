import Device from '../../../helpers/pwa/deviceHelper';
import useLocalStorage from '../../../hooks/useLocalStorage';
import Modal from '../../lib/modal/Modal';
import { FlexColumnWrapper } from '../../lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { VerticalSeperator } from '../../lib/positionModifiers/verticalSeperator/VerticalSeperator';
import InstallAppSteps from './InstallAppSteps';

export default function InstallAppModal(): JSX.Element {
   const [installationRequested, setInstallationRequested] = useLocalStorage(
      'installationRequested',
      false,
   );

   const toggleClose = (): void => {
      setInstallationRequested(true);
   };

   return (
      <>
         <Modal
            isOpen={!Device.hasInstalledApp() && !installationRequested}
            onClose={() => toggleClose()}
            header="Installation"
         >
            <FlexColumnWrapper padding="1em 1em 0em 1em">
               {'Install this app to your home screen for a better experience!'}
               <VerticalSeperator />
               <InstallAppSteps />
            </FlexColumnWrapper>
         </Modal>
      </>
   );
}
