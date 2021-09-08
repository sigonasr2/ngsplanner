import React, { useEffect,useState } from 'react';
import { DisplayIcon } from './DEFAULTS';


const axios = require('axios');
const cookies = require('cookie-handler');

function TestHeader(p) {

    const [avatar,setAvatar] = useState(undefined);
    const [username,setUsername] = useState(undefined);

    useEffect(()=>{
        axios.post(p.BACKENDURL+"/validUser",{
            username:p.LOGGEDINUSER,
            password:p.LOGGEDINHASH,
            recoveryhash:cookies.get("userID")
        })
        .then((data)=>{
            if (data.data.verified) {
                setAvatar(data.data.avatar)
                setUsername(p.LOGGEDINUSER)
            }
        })}
    ,[])

    return (
        <header>
            <div className="headerWrapper">
                <div className="logo"><a href="."><img alt="" src={process.env.PUBLIC_URL + '/icons/logo_sm.png'} />&emsp;NGS<span>planner</span></a></div>
                <div className="navigation"><ul>
                    <li className="headerMenuItem"><a href=".">Builds</a></li>
                    <li className="headerMenuItem"><a href=".">Guides</a></li>
                    <li className="headerMenuItem"><a href=".">Blog</a></li>
                    <li className="headerMenuItem"><a href=".">About</a></li></ul>
                    <section className="miniNav"><a href=".">&#9776;</a></section>
                </div>
                <div className="rightNav">
                    <section className="loginNav"><a href="."><img alt="." src={DisplayIcon(avatar)} /> {username??"Guest"} &emsp; <span className="dotMenu">&#xb7;&#xb7;&#xb7;</span></a></section>
                    <section className="miniNav"><a href="."><img alt="." src={DisplayIcon(avatar)} /></a></section>
                </div>
            </div>
        </header>
    )
}

export default TestHeader;