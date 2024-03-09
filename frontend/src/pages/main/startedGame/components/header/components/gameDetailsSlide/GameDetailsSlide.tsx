import { useContext, useEffect, useRef, useState } from 'react';
import { LogoText } from '../../../../../../../global/components/app/logo/LogoText';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import Color from '../../../../../../../global/css/colors';
import ArrOfObj from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DBConnect from '../../../../../../../global/utils/DBConnect/DBConnect';
import { GameDetailsContainer } from '../../style/Style';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import MyCSS from '../../../../../../../global/css/MyCSS';
import { FlexColumnWrapper } from '../../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { VerticalSeperator } from '../../../../../../../global/components/lib/positionModifiers/verticalSeperator/VerticalSeperator';

interface IGameHeaderDetails {
   label: string;
   value: string;
}

export default function GameDetailsSlide(): JSX.Element {
   const { localDbRoom, localDbUser, activeTopicWords } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [gameHeaderDetails, setGameHeaderDetails] = useState<IGameHeaderDetails[]>([]);
   const gameDetailsContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
         const scoreboardContainerDiv = entries[0].target as HTMLDivElement;
         const maskImage =
            scoreboardContainerDiv.scrollHeight <= scoreboardContainerDiv.clientHeight + 3
               ? 'none'
               : 'linear-gradient(to bottom, black calc(100% - 48px), transparent 100%)';
         scoreboardContainerDiv.style.maskImage = maskImage;
      });
      if (gameDetailsContainerRef.current) {
         resizeObserver.observe(gameDetailsContainerRef.current);
      }
      return () => {
         resizeObserver.disconnect();
      };
   }, [roomData]);

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

   function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>): void {
      const gameDetailsContainerRef = e.target as HTMLDivElement;
      const scrollTop = gameDetailsContainerRef.scrollTop;
      if (
         scrollTop + gameDetailsContainerRef.clientHeight >=
         gameDetailsContainerRef.scrollHeight - 3
      ) {
         gameDetailsContainerRef.style.maskImage = 'none';
      } else {
         gameDetailsContainerRef.style.maskImage =
            'linear-gradient(to bottom, black calc(100% - 48px), transparent 100%)';
      }
   }

   return (
      <GameDetailsContainer
         localStyles={screenStyles()}
         ref={gameDetailsContainerRef}
         onScroll={handleScroll}
      >
         {gameHeaderDetails.map((detail, index) => (
            <FlexColumnWrapper
               key={index}
               padding="0em 0em 0em 0em"
               style={{
                  wordWrap: 'break-word',
                  hyphens: 'auto',
                  textOverflow: 'ellipsis',
               }}
            >
               <ConditionalRender condition={!detail.value?.includes('THE RAT')}>
                  <LogoText size={'1.25em'} color={Color.darkThm.accent}>
                     {detail.label}
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
