import { io, Socket } from 'socket.io-client';

const serverUrl: string = 'http://localhost:3000';

const socket: Socket = io(serverUrl);

export default socket;
