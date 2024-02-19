import { useContext } from 'react';
import { LogoText } from '../../global/components/app/logo/LogoText';
import { TextBtn } from '../../global/components/lib/button/textBtn/Style';
import { FlexRowWrapper } from '../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import Color from '../../global/css/colors';
import HTMLEntities from '../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import Unicode from '../../global/helpers/dataTypes/unicode/Unicode';
import FirestoreDB from '../../pages/main/class/FirestoreDb';
import { GameContext } from '../../pages/main/context/GameContext';
import { GameDetailsContainer, ScoreboardBtnContainer } from './Style';

export default function GameHeader(): JSX.Element {
   const { allUsers, setAllUsers, localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const { data: topicsData } = FirestoreDB.Topics.getTopicsQuery();
   const gameHeaderDetails = [
      {
         label: 'Topic',
         value: roomData?.gameState?.activeTopic,
      },
      {
         label: 'Word',
         value: roomData?.gameState?.activeWord,
      },
      {
         label: 'Round',
         value: roomData?.gameState?.currentRound + ' / ' + roomData?.gameState?.numberOfRoundsSet,
      },
   ];

   return (
      <>
         <GameDetailsContainer>
            {gameHeaderDetails.map((detail, index) => (
               <FlexRowWrapper alignItems="center" key={index} padding="0em 0em 0.5em 0em">
                  <LogoText size={'1.5em'} color={Color.darkThm.accent}>
                     {detail.label}
                     {HTMLEntities.space} {Unicode.rightArrow()} {HTMLEntities.space}
                  </LogoText>
                  <LogoText size={'1.5em'} color={Color.darkThm.accentAlt}>
                     {detail.value}
                  </LogoText>
               </FlexRowWrapper>
            ))}
         </GameDetailsContainer>
         <ScoreboardBtnContainer>
            <TextBtn isDarkTheme style={{ fontSize: '1em' }}>
               Scoreboard
            </TextBtn>
         </ScoreboardBtnContainer>
      </>
   );
}
