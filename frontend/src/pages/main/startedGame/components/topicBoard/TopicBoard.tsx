import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { GameContext } from '../../../../../global/context/game/GameContext';
import MyCSS from '../../../../../global/css/MyCSS';
import DBConnect from '../../../../../global/database/DBConnect/DBConnect';
import { BoardCell, BoardContainer, BoardRow, CellValue } from './style/Style';
import type GameHelper from '../../../../../../../shared/app/GameHelper/GameHelper';

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
                        <CellValue>{item.word}</CellValue>
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
      height: 100%;
      margin: 0 auto;
   `;
   const forDesktop = MyCSS.Media.desktop(css`
      font-size: 1.15em;
   `);
   const forTablet = MyCSS.Media.tablet(css``);
   return MyCSS.Helper.concatStyles(forDesktop, forTablet, allStyles);
};
