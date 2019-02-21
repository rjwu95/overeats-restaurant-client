import socketIoClient from 'socket.io-client';

// eslint-disable-next-line no-undef
export default (socket = socketIoClient(
  'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080'
));
