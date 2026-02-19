import io from 'socket.io-client';

const URL = 'http://localhost:4000'; // Adjust if backend runs on different port

export const socket = io(URL, {
    withCredentials: true,
    autoConnect: false
});
