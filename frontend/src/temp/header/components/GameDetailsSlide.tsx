import { useContext } from 'react';
import { LogoText } from '../../../global/components/app/logo/LogoText';
import { FlexRowWrapper } from '../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import Color from '../../../global/css/colors';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import HTMLEntities from '../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import Unicode from '../../../global/helpers/dataTypes/unicode/Unicode';
import FirestoreDB from '../../../pages/main/class/FirestoreDb';
import { GameContext } from '../../../pages/main/context/GameContext';
import { GameDetailsContainer } from '../Style';

export default function GameDetailsSlide(): JSX.Element {
   const { localDbRoom, localDbUser, activeTopicWords } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);

   const gameHeaderDetails = [
      {
         label: 'Round',
         value: roomData?.gameState?.currentRound + ' / ' + roomData?.gameState?.numberOfRoundsSet,
      },
      {
         label: 'Topic',
         value: roomData?.gameState?.activeTopic,
      },
      {
         label: 'Word',
         value:
            roomData?.gameState.currentRat === localDbUser
               ? 'YOU ARE THE RAT'
               : ArrayOfObjects.getObjWithKeyValuePair(
                    activeTopicWords,
                    'word',
                    roomData?.gameState?.activeWord || '',
                 )?.cellId,
      },
   ];
   return (
      <GameDetailsContainer>
         {gameHeaderDetails.map((detail, index) => (
            <FlexRowWrapper alignItems="center" key={index} padding="0em 0em 0em 0em">
               <ConditionalRender condition={!detail.value?.includes('THE RAT')}>
                  <LogoText size={'1.25em'} color={Color.darkThm.accent}>
                     {detail.label}
                     {HTMLEntities.space} {Unicode.rightArrow()} {HTMLEntities.space}
                  </LogoText>
               </ConditionalRender>
               <LogoText
                  size={'1.25em'}
                  color={
                     detail.value?.includes('THE RAT')
                        ? Color.darkThm.error
                        : Color.darkThm.accentAlt
                  }
               >
                  {detail.value}
               </LogoText>
            </FlexRowWrapper>
         ))}
      </GameDetailsContainer>
   );
}
