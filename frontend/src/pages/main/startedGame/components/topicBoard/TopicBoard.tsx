import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import { LogoText } from '../../../../../global/components/app/logo/LogoText';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { GameContext } from '../../../../../global/context/game/GameContext';
import MyCSS from '../../../../../global/css/MyCSS';
import Color from '../../../../../global/css/colors';
import DBConnect from '../../../../../global/utils/DBConnect/DBConnect';
import type GameHelper from '../../../../../global/utils/GameHelper/GameHelper';
import { BoardCell, BoardContainer, BoardRow, CellUID, CellValue } from './style/Style';

export default function TopicBoard(): JSX.Element {
   const { localDbRoom, localDbUser, activeTopicWords } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [rows, setRows] = useState<GameHelper.I.WordCell[][]>([[]]);
   const [isThisUserRat, setIsThisUserRat] = useState<boolean>(false);

   useEffect(() => {
      setIsThisUserRat(localDbUser === roomData?.gameState?.currentRat);
   }, [roomData?.gameState?.currentRat, localDbUser]);

   useEffect(() => {
      const rowA = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'A');
      const rowB = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'B');
      const rowC = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'C');
      setRows([rowA, rowB, rowC]);
   }, [activeTopicWords]);

   function isItemActiveWord(word: string): boolean {
      return roomData?.gameState?.activeWord === word;
   }

   function setColor(word: string): string {
      if (isItemActiveWord(word) && !isThisUserRat) {
         return Color.darkThm.success;
      }
      return Color.setRgbOpacity(Color.darkThm.txt, 0.6);
   }

   return (
      <FlexColumnWrapper localStyles={screenStyles()}>
         <BoardContainer>
            {rows.map((row, index) => (
               <BoardRow key={index}>
                  {row.map((item, index) => (
                     <BoardCell
                        key={index}
                        isActiveWord={isItemActiveWord(item.word)}
                        isUserRat={isThisUserRat}
                     >
                        <CellUID>
                           <LogoText size="0.6em" color={setColor(item.word)}>
                              {item.cellId}
                           </LogoText>
                        </CellUID>
                        <CellValue>
                           <LogoText size="0.65em" color={setColor(item.word)}>
                              {item.word}
                           </LogoText>
                        </CellValue>
                     </BoardCell>
                  ))}
               </BoardRow>
            ))}
         </BoardContainer>
      </FlexColumnWrapper>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const allStyles = css`
      height: 92.5%;
      width: 43.5dvh;
      margin: 1em auto;
      //border: 1px solid red;
   `;
   const forDesktop = MyCSS.Media.desktop(css``);
   const forTablet = MyCSS.Media.tablet(css``);
   return MyCSS.Helper.concatStyles(forDesktop, forTablet, allStyles);
};
