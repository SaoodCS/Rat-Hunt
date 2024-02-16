import styled from 'styled-components';
import { LogoText } from '../global/components/app/logo/LogoText';
import { TextColourizer } from '../global/components/lib/font/textColorizer/TextColourizer';
import { FlexRowWrapper } from '../global/components/lib/positionModifiers/flexRowWrapper/Style';
import Color from '../global/css/colors';

const TopicBoardWrapper = styled.div`
   border: 1px solid red;
   position: absolute;
   width: 100dvw;
   top: 31%;
   bottom: 0px;
`;

const GameStateWrapper = styled.div`
   // border: 1px solid red;
   border-bottom: 1px solid ${Color.darkThm.accent};
   border-radius: 1em;
   position: absolute;
   width: 100dvw;
   height: 20%;
   top: 10%;
`;

const TopicAndItemWrapper = styled.div`
   // border: 1px solid red;
   border-bottom: 1px solid ${Color.darkThm.accent};
   border-radius: 1em;
   position: absolute;
   width: 100dvw;
   height: 10%;
`;

export default function TopicGrid(): JSX.Element {
   return (
      <>
         {/*  */}
         <TopicAndItemWrapper>
            <FlexRowWrapper alignItems="center" justifyContent="space-around" height="100%">
               <LogoText size="2em" color={Color.darkThm.accentAlt}>
                  CITIES
               </LogoText>

               <FlexRowWrapper>
                  {/* <LogoText size="2em" color={Color.darkThm.accentAlt}>
                     B3
                  </LogoText> */}
                  <LogoText size="2em" color={Color.darkThm.error}>
                     RAT
                  </LogoText>
               </FlexRowWrapper>
            </FlexRowWrapper>
         </TopicAndItemWrapper>
         {/*  */}
         <GameStateWrapper>
            <FlexRowWrapper padding="1em">
               <LogoText size="1.5em" color={Color.darkThm.warning}>
                  ROUND 1
               </LogoText>
            </FlexRowWrapper>
            <FlexRowWrapper padding="0em 0em 0.3em 1em">
               <TextColourizer color={Color.darkThm.accentAlt}>
                  Saood Clue: Skyscrapers
               </TextColourizer>
            </FlexRowWrapper>
            <FlexRowWrapper padding="0em 0em 0.3em 1em">
               <TextColourizer color={Color.darkThm.accentAlt}>JCs Clue: Buildings</TextColourizer>
            </FlexRowWrapper>
            <FlexRowWrapper padding="0em 0em 0.3em 1em">
               <TextColourizer color={Color.darkThm.accentAlt}>Bens Clue: Gay</TextColourizer>
            </FlexRowWrapper>
            <FlexRowWrapper padding="0em 0em 0.3em 1em">
               <TextColourizer color={Color.darkThm.accentAlt}>Emmas Clue: Ugands</TextColourizer>
            </FlexRowWrapper>
         </GameStateWrapper>
         {/*  */}
         <TopicBoardWrapper></TopicBoardWrapper>
      </>
   );
}
