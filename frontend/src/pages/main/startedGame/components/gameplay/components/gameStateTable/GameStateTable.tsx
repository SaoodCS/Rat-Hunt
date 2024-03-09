import { useContext, useEffect, useRef, useState } from 'react';
import { LogoText } from '../../../../../../../global/components/app/logo/LogoText';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import Color from '../../../../../../../global/css/colors';
import ArrOfObj from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../../../../../global/utils/DBConnect/DBConnect';
import {
   Cell,
   DataTableWrapper,
   HeaderRowContainer,
   RowContainer,
   UserRowsWrapper,
} from './style/Style';
//mask-image: linear-gradient(to bottom, black calc(100% - 48px), transparent 100%);
export default function GameStateTable(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [sortedUserStates, setSortedUserStates] = useState<DBConnect.FSDB.I.UserState[]>();
   const userRowsWrapperRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
         const userRowsWrapperDiv = entries[0].target as HTMLDivElement;
         const maskImage =
            userRowsWrapperDiv.scrollHeight <= userRowsWrapperDiv.clientHeight
               ? 'none'
               : 'linear-gradient(to bottom, black calc(100% - 48px), transparent 100%)';
         userRowsWrapperDiv.style.maskImage = maskImage;
      });
      if (userRowsWrapperRef.current) {
         resizeObserver.observe(userRowsWrapperRef.current);
      }
      return () => {
         resizeObserver.disconnect();
      };
   }, [roomData]);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      setSortedUserStates(ArrOfObj.sort(userStates, 'userId'));
   }, [roomData?.gameState?.userStates, localDbUser]);

   function valueCol(userState: DBConnect.FSDB.I.UserState): string {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return 'disconnected';
      if (!MiscHelper.isNotFalsyOrEmpty(userState)) return 'disconnected';
      const { users } = roomData;
      const thisUser = ArrOfObj.findObj(users, 'userId', userState.userId);
      const isSpectating = userState.spectate;
      const isDisconnected = thisUser?.userStatus === 'disconnected';
      if (isDisconnected || isSpectating) return Color.setRgbOpacity(Color.darkThm.txt, 0.35);
      return '';
   }

   function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>): void {
      const userRowsWrapperDiv = e.target as HTMLDivElement;
      const scrollTop = userRowsWrapperDiv.scrollTop;
      if (scrollTop + userRowsWrapperDiv.clientHeight >= userRowsWrapperDiv.scrollHeight - 0.5) {
         userRowsWrapperDiv.style.maskImage = 'none';
      } else {
         userRowsWrapperDiv.style.maskImage =
            'linear-gradient(to bottom, black calc(100% - 48px), transparent 100%)';
      }
   }

   return (
      <DataTableWrapper style={{ marginBottom: '1em' }}>
         <HeaderRowContainer height="2.5em">
            <Cell>
               <LogoText size="1em"> User</LogoText>
            </Cell>
            <Cell>
               <LogoText size="1em"> Clue</LogoText>
            </Cell>
            <Cell>
               <LogoText size="1em"> Voted For</LogoText>
            </Cell>
         </HeaderRowContainer>
         <UserRowsWrapper
            headerRowHeight="3em"
            ref={userRowsWrapperRef}
            onScroll={(e) => handleScroll(e)}
         >
            <div>
               {sortedUserStates?.map((user) => (
                  <RowContainer
                     key={user.userId}
                     isThisUser={user.userId === localDbUser}
                     currentTurn={user.userId === roomData?.gameState.currentTurn}
                  >
                     <Cell>
                        <LogoText size="1em" color={valueCol(user)}>
                           {user.userId}
                        </LogoText>
                     </Cell>
                     <Cell>
                        <LogoText size="1em" color={valueCol(user)}>
                           {user.clue}
                        </LogoText>
                     </Cell>
                     <Cell>
                        <LogoText size="1em" color={valueCol(user)}>
                           {user.votedFor}
                        </LogoText>
                     </Cell>
                  </RowContainer>
               ))}
            </div>
         </UserRowsWrapper>
      </DataTableWrapper>
   );
}
