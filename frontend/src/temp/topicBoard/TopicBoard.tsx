import { useContext } from 'react';
import { LogoText } from '../../global/components/app/logo/LogoText';
import { FlexColumnWrapper } from '../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import Color from '../../global/css/colors';
import FirestoreDB from '../../pages/main/class/FirestoreDb';
import { GameContext } from '../../pages/main/context/GameContext';
import { BoardCell, BoardContainer, BoardRow, CellUID, CellValue } from './Style';

export default function TopicBoard(): JSX.Element {
   const { localDbRoom, localDbUser, activeTopicWords } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const currentWord = roomData?.gameState?.activeWord;
   const isUserRat = localDbUser === roomData?.gameState?.currentRat;
   const rowA = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'A');
   const rowB = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'B');
   const rowC = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'C');
   const rowD = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'D');
   const rows = [rowA, rowB, rowC, rowD];

   function setColor(word: string): string {
      if (word === currentWord && !isUserRat) {
         return Color.darkThm.error;
      } else {
         return Color.setRgbOpacity(Color.darkThm.txt, 0.7);
      }
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
