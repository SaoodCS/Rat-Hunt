import styled from 'styled-components';

export const ProgressChartInfo = styled.div`
   top: 0;
   box-sizing: border-box;
   padding: 0;
   display: flex;
   flex-direction: column;
   align-items: start;
`;

export const ProgressChartTitle = styled.div`
   position: absolute;
   padding: 1em 0em 0em 1em;
   box-sizing: border-box;
   display: flex;
   justify-content: center;
   align-items: center;
   & > :first-child {
      padding-right: 0.25em;
   }
`;
