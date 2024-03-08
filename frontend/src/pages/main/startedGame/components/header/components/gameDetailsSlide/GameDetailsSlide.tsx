import { useContext, useEffect, useState } from 'react';
import { LogoText } from '../../../../../../../global/components/app/logo/LogoText';
import { FlexRowWrapper } from '../../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import Color from '../../../../../../../global/css/colors';
import ArrOfObj from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import HTMLEntities from '../../../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import Unicode from '../../../../../../../global/helpers/dataTypes/unicode/Unicode';
import DBConnect from '../../../../../../../global/utils/DBConnect/DBConnect';
import { GameDetailsContainer } from '../../style/Style';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import MyCSS from '../../../../../../../global/css/MyCSS';

interface IGameHeaderDetails {
   label: string;
   value: string;
}

export default function GameDetailsSlide(): JSX.Element {
   const { localDbRoom, localDbUser, activeTopicWords } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [gameHeaderDetails, setGameHeaderDetails] = useState<IGameHeaderDetails[]>([]);

   useEffect(() => {
      const newGameHeaderDetails: IGameHeaderDetails[] = [
         {
            label: 'Round',
            value: `${roomData?.gameState?.currentRound} / ${roomData?.gameState?.numberOfRoundsSet}`,
         },
         {
            label: 'Topic',
            value: roomData?.gameState?.activeTopic || 'No Topic',
         },
         {
            label: 'Word',
            value:
               roomData?.gameState?.currentRat === localDbUser
                  ? 'YOU ARE THE RAT'
                  : ArrOfObj.findObj(
                       activeTopicWords,
                       'word',
                       roomData?.gameState?.activeWord || '',
                    )?.cellId,
         },
      ];
      setGameHeaderDetails(newGameHeaderDetails);
   }, [
      roomData?.gameState?.currentRound,
      roomData?.gameState?.numberOfRoundsSet,
      roomData?.gameState?.activeTopic,
      roomData?.gameState?.currentRat,
      roomData?.gameState?.activeWord,
      activeTopicWords,
      localDbUser,
   ]);

   return (
      <GameDetailsContainer localStyles={screenStyles()}>
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

const screenStyles = (): FlattenSimpleInterpolation => {
   const forDesktop = MyCSS.Media.desktop(css`
      margin: 0 auto;
      font-size: 1.25em;
   `);
   return MyCSS.Helper.concatStyles(forDesktop);
};
