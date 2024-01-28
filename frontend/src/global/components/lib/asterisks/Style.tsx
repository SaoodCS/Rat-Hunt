import { Asterisk } from '@styled-icons/bootstrap/Asterisk';
import styled from 'styled-components';
export const StyledAsterisk = styled(Asterisk)<{ size: string }>`
   height: ${({ size }) => size};
`;
