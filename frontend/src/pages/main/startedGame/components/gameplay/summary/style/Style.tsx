import styled from 'styled-components';
import { Cell } from '../../gameDataTable/Style';

export const ScoreTableWrapper = styled.div`
   position: absolute;
   top: 0px;
   bottom: 0px;
   left: 0.5em;
   right: 0.5em;
`;

export const ScoreTableCell = styled(Cell)<{ leftcell?: boolean; rightcell?: boolean }>`
   text-align: ${({ leftcell }) => leftcell && 'start'};
   padding-left: ${({ leftcell }) => leftcell && '0.5em'};
   padding-right: ${({ rightcell }) => rightcell && '0.5em'};
   display: ${({ rightcell }) => rightcell && 'flex'};
   justify-content: ${({ rightcell }) => rightcell && 'end'};
   align-items: ${({ rightcell }) => rightcell && 'center'};
`;
