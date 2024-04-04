import { useContext, useEffect, useState } from 'react';
import DBConnect from '../../../../../global/database/DBConnect/DBConnect';
import { GameContext } from '../../../../../global/context/game/GameContext';
import useScrollFader from '../../../../../global/hooks/useScrollFader';
import { GameDetailsContainer, GameDetailsItemWrapper, ItemLabel, ItemValue } from './style/Style';
import Color from '../../../../../global/css/colors';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import MyCSS from '../../../../../global/css/MyCSS';

interface IGameHeaderDetails {
   label: string;
   value: string;
}

export default function GameDetails(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
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
      ];
      setGameHeaderDetails(newGameHeaderDetails);
   }, [
      roomData?.gameState?.currentRound,
      roomData?.gameState?.numberOfRoundsSet,
      roomData?.gameState?.activeTopic,
   ]);

   return (
      <>
         <GameDetailsContainer
            ref={faderElRef}
            onScroll={handleScroll}
            localStyles={screenStyles()}
         >
            {gameHeaderDetails.map(({ label, value }, index) => (
               <GameDetailsItemWrapper key={index}>
                  <ConditionalRender condition={!!value && !value.includes('THE RAT')}>
                     <ItemLabel color={Color.darkThm.error}>{label}</ItemLabel>
                  </ConditionalRender>
                  <ItemValue
                     color={Color.darkThm.success}
                     ratUser={!!value && value.includes('THE RAT')}
                  >
                     {value}
                  </ItemValue>
               </GameDetailsItemWrapper>
            ))}
         </GameDetailsContainer>
      </>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forMobile = MyCSS.Media.mobile(css``);
   const forDesktop = MyCSS.Media.desktop(css`
      font-size: 1em;
   `);
   const medium = css`
      @media (min-width: 544px) {
         margin: 0 auto;
         & > * {
            & > * {
               width: 50%;
               &:first-child {
                  text-align: end;
               }
            }
         }
      }
   `;
   return MyCSS.Helper.concatStyles(forDesktop, forMobile, medium);
};
