import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

const serverUrl: string = 'http://localhost:3000';

const socket: Socket = io(serverUrl);

export default socket;
