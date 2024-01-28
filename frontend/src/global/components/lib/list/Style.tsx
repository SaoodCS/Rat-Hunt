import styled from 'styled-components';

export const ListItem = styled.li<{ color?: string }>`
   color: ${({ color }) => (color ? color : 'inherit')};
`;

export const BulletList = styled.ul<{ removeBullets?: boolean }>`
   list-style-type: ${({ removeBullets }) => (removeBullets ? 'none' : 'disc')};
   margin-left: ${({ removeBullets }) => (removeBullets ? '-2em' : '-1em')};
   & > * {
      margin-bottom: 0.5em;
      margin-left: 0;
      padding-left: 0;
   }
`;
