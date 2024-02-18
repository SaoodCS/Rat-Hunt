import { LogoText } from '../../global/components/app/logo/LogoText';
import { TextBtn } from '../../global/components/lib/button/textBtn/Style';
import { FlexRowWrapper } from '../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import Color from '../../global/css/colors';
import HTMLEntities from '../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import Unicode from '../../global/helpers/dataTypes/unicode/Unicode';
import { GameDetailsContainer, ScoreboardBtnContainer } from './Style';

export default function GameHeader(): JSX.Element {
   const topic = 'Cities';
   const word = 'A2';
   const round = '1/5';

   const gameHeaderDetails = [
      {
         label: 'Topic',
         value: topic,
      },
      {
         label: 'Word',
         value: word,
      },
      {
         label: 'Round',
         value: round,
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
