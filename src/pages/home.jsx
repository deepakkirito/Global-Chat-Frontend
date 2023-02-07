import * as React from "react";
import {useState} from 'react';
import socketClient from 'socket.io-client';

const socketUrl = 'erratic-tungsten-report.glitch.me/';
const socket = socketClient(socketUrl);

export default function Home() {
  const [message, setMessage] = useState('null');
  
  socket.on('test', data => {
    setMessage(data);
  })

  return (
    <>
     <p>{message}</p>
    </>
  );
}
