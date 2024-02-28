import { useContext } from 'react';
import { LogoText } from '../../../../../global/components/app/logo/LogoText';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import Color from '../../../../../global/css/colors';
import { GameContext } from '../../../context/GameContext';
import FirestoreDB from '../../../class/FirestoreDb';

export default function GamplayForm(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   return (
      <FlexRowWrapper position="absolute" height="1em">
         <LogoText size="1em" color={Color.darkThm.accent}>
            Current Turn&nbsp;:&nbsp;&nbsp;
         </LogoText>
         <LogoText size="1em" color={Color.darkThm.accentAlt}>
            {roomData?.gameState.currentTurn === localDbUser
               ? 'You'
               : roomData?.gameState.currentTurn}
         </LogoText>
         {/* Display the form here for the user to submit a clue, or vote for the rat depending on the game state and whether it's their turn  */}
      </FlexRowWrapper>
   );
}
