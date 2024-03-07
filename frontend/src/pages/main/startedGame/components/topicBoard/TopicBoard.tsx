import { useContext, useEffect, useState } from 'react';
import { LogoText } from '../../../../../global/components/app/logo/LogoText';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { GameContext } from '../../../../../global/context/game/GameContext';
import Color from '../../../../../global/css/colors';
import { BoardCell, BoardContainer, BoardRow, CellUID, CellValue } from './Style';
import DBConnect from '../../../../../global/utils/DBConnect/DBConnect';
import type GameHelper from '../../../../../global/utils/GameHelper/GameHelper';

export default function TopicBoard(): JSX.Element {
   const { localDbRoom, localDbUser, activeTopicWords } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [rows, setRows] = useState<GameHelper.I.WordCell[][]>([[]]);

   useEffect(() => {
      const rowA = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'A');
      const rowB = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'B');
      const rowC = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'C');
      const rowD = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'D');
      setRows([rowA, rowB, rowC, rowD]);
   }, [activeTopicWords]);

   function setColor(word: string): string {
      const currentWord = roomData?.gameState?.activeWord;
      const isUserRat = localDbUser === roomData?.gameState?.currentRat;
      if (word === currentWord && !isUserRat) {
         return Color.darkThm.error;
      }
      return Color.setRgbOpacity(Color.darkThm.txt, 0.7);
   }

   return (
      <FlexColumnWrapper style={{ height: '90%', margin: '1em' }}>
         <BoardContainer>
            {rows.map((row, index) => (
               <BoardRow key={index}>
                  {row.map((item, index) => (
                     <BoardCell key={index}>
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
