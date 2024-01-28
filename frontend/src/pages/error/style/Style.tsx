import styled from 'styled-components';

export const ErrorText = styled.span`
   text-align: center;
   font-size: 1em;
   font-weight: 500;
   margin-top: 1em;
   padding-left: 1em;
   padding-right: 1em;
`;

export const ErrorSubheading = styled.span`
   font-size: 1.75em;
   font-weight: 600;
   padding-left: 1em;
   padding-right: 1em;
`;

export const ErrorHeading = styled.span`
   font-size: 6em;
   font-weight: 600;
`;

export const ErrorPageWrapper = styled.div`
   position: fixed;
   width: 100dvw;
   height: 100dvh;
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   margin: 0px;
   text-align: center;
`;
