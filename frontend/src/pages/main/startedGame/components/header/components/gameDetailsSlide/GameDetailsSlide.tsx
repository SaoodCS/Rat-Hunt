import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import { LogoText } from '../../../../../../../global/components/app/logo/LogoText';
import { FlexColumnWrapper } from '../../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { VerticalSeperator } from '../../../../../../../global/components/lib/positionModifiers/verticalSeperator/VerticalSeperator';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import MyCSS from '../../../../../../../global/css/MyCSS';
import Color from '../../../../../../../global/css/colors';
import ArrOfObj from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import useScrollFader from '../../../../../../../global/hooks/useScrollFader';
import DBConnect from '../../../../../../../global/utils/DBConnect/DBConnect';
import { GameDetailsContainer } from '../../style/Style';

interface IGameHeaderDetails {
   label: string;
   value: string;
}

export default function GameDetailsSlide(): JSX.Element {
   const { localDbRoom, localDbUser, activeTopicWords } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [gameHeaderDetails, setGameHeaderDetails] = useState<IGameHeaderDetails[]>([]);
   const { handleScroll, faderElRef } = useScrollFader([roomData], 3);

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
      <GameDetailsContainer localStyles={screenStyles()} ref={faderElRef} onScroll={handleScroll}>
         {gameHeaderDetails.map((detail, index) => (
            <FlexColumnWrapper key={index} padding="0em 0em 0em 0em">
               <ConditionalRender condition={!detail.value?.includes('THE RAT')}>
                  <LogoText size={'1.25em'} color={Color.darkThm.accent} wrapAndHyphenate>
                     {detail.label}
                  </LogoText>
               </ConditionalRender>
               <LogoText
                  size={'1.25em'}
                  wrapAndHyphenate
                  color={
                     detail.value?.includes('THE RAT')
                        ? Color.darkThm.error
                        : Color.darkThm.accentAlt
                  }
               >
                  {detail.value}
               </LogoText>
               <VerticalSeperator margBottomEm={0.1} />
            </FlexColumnWrapper>
         ))}
      </GameDetailsContainer>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forMobile = MyCSS.Media.mobile(css`
      width: 50%;
      height: calc(100% - 1em);
      overflow-y: scroll;
      padding-left: 1em;
      padding-top: 1em;
      font-size: 0.9em;
   `);
   const forDesktop = MyCSS.Media.desktop(css`
      margin: 0 auto;
      font-size: 1.25em;
      text-align: center;
      justify-content: space-evenly;
   `);
   return MyCSS.Helper.concatStyles(forDesktop, forMobile);
};
