import * as React from "react";
import {useState, useEffect} from 'react';
import socketClient from 'socket.io-client';

const socketUrl = 'erratic-tungsten-report.glitch.me/';
const socket = socketClient(socketUrl);

function GlobalChat() {

    const [username, setUsername] = useState(null);
    const [newUser, setNewUser] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [chatRoom, setChatRoom] = useState(false);
    const [chatRoomMessage, setChatRoomMessage] = useState('');
    const [captchaData, setCaptchaData] = useState([]);
    const [captchaVerify, setCaptchaVerify] = useState('');
    const [sendMessage, setSendMessage] = useState('');
    let p = document.createElement('p');

    socket.on('captcha-data', data => {
        setCaptchaData(data.split(' '));
        // console.log(data.split(' '));
      
    })

    useEffect(() => {
        username != '' && captchaVerify != '' ? setDisabled(false) : setDisabled(true)
    }, [username, captchaVerify])

    useEffect(() => {
        const div = document.getElementById('chatRoom');
        chatRoomMessage && chatRoomMessage.name ? p.innerHTML = `<p>${chatRoomMessage.name} : ${chatRoomMessage.msg}</p>` : p.innerHTML = `<p class='removeUser'>${chatRoomMessage.msg}</p>`;
        div && div.prepend(p);
    }, [chatRoomMessage])

    useEffect(() => {
        const div = document.getElementById('chatRoom');
        p.innerHTML = `<p class='newUser'>${newUser} is connected</p>`;
        div && div.prepend(p);
    }, [newUser])

    const sendChatMessage = (e) => {
        e.preventDefault();
        setChatRoomMessage({
            name: "You",
            msg: sendMessage
        })
        socket.emit('client-message', sendMessage)
        setSendMessage('')
    }

    const enterChatRoom = () => {
        if (captchaVerify == captchaData[0]) {
            setChatRoom(true);
            socket.emit('client-connect', username)
            socket.on('new-user-connected', newUser => {
                setNewUser(newUser)
            })
            socket.on('user-message', welcomeMsg => {
                setChatRoomMessage(welcomeMsg)
            })
            socket.on('client-message', msg => {
                setChatRoomMessage(msg)
            })
            socket.on('global-message', msg => {
                setChatRoomMessage(msg)
            })
            socket.on('global-disconnection-message', msg => {
                setChatRoomMessage(msg)
            })
        } else {
            setChatRoom(false)
            alert('!!!Wrong CAPTCHA!!!--<*Enter again*>');
        }
    }
    

    if (!chatRoom) {

        return (
            <div className='chatLogin'>
                <h1>Global Chat Room</h1>
                <input
                    className='username'
                    onChange={e => setUsername(e.target.value)}
                    type="text" placeholder="...Enter Username/Name..."
                    required
                />
                <br />
                <>
                    <img
                        src={captchaData[1]}
                        alt='Verification Text'
                        title='Verification Text'
                    ></img>
                    <br />
                    <input
                        onChange={e => setCaptchaVerify(e.target.value)}
                        type="text"
                        placeholder="...Enter image text..."
                        required
                    />
                </>
                <br />
                <button
                    onClick={enterChatRoom}
                    disabled={disabled}
                >Enter</button>
            </div>
        )
    } else {
        return (
            <>
                <h2>Global Chat Room</h2>
                <div id="chatRoom"></div>
                <>
                    <input
                        className='messageBox'
                        value={sendMessage}
                        type="text"
                        placeholder='Enter Message to Send...'
                        onChange={e => setSendMessage(e.target.value)}
                    />
                    <button
                        disabled={sendMessage == ''}
                        className='sendButton'
                        onClick={e => sendChatMessage(e)}
                    >Send</button>

                </>

            </>
        )
    }

}

export default GlobalChat;