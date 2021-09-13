import React, { useEffect,useState } from 'react';
import { DisplayIcon } from './DEFAULTS';
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";

import { HashLink as Link } from 'react-router-hash-link';


const axios = require('axios');
const cookies = require('cookie-handler');

function TestHeader(p) {

    const {BACKENDURL,LOGGEDINUSER,LOGGEDINHASH} = p;

    const [avatar,setAvatar] = useState(undefined);
    const [username,setUsername] = useState(undefined);
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        axios.post(BACKENDURL+"/validUser",{
            username:LOGGEDINUSER,
            password:LOGGEDINHASH,
            recoveryhash:cookies.get("userID")
        })
        .then((data)=>{
            if (data.data.verified) {
                setAvatar(data.data.avatar)
                setUsername(LOGGEDINUSER)
            }
        })
        .catch((err)=>{})
        .finally(()=>{
            setLoading(false)
        })}
    ,[BACKENDURL,LOGGEDINUSER,LOGGEDINHASH])

    return (
        <header>
            <div className="headerWrapper">
                <div className="logo"><a href="."><img alt="" src={process.env.PUBLIC_URL + '/icons/logo_sm.png'} />&emsp;NGS<span>planner</span></a></div>
                <div className="navigation"><ul>
                    <li className="headerMenuItem"><Link to={process.env.PUBLIC_URL+"/builds"}>Builds</Link></li>
                    <li className="headerMenuItem"><a href=".">Guides</a></li>
                    <li className="headerMenuItem"><a href=".">Blog</a></li>
                    <li className="headerMenuItem"><a href=".">About</a></li></ul>
                    <section className="miniNav"><a href=".">&#9776;</a></section>
                </div>
                <div className="rightNav">
                    <section className="loginNav"><a href="."><ReactPlaceholder style={{width:240,height:42}} showLoadingAnimation ready={!loading} type="media" rows={1}><img alt="." src={DisplayIcon(avatar)} /> {username??"Guest"}  &emsp; <span className="dotMenu">&#xb7;&#xb7;&#xb7;</span></ReactPlaceholder></a></section>
                    <section className="miniNav"><a href="."><ReactPlaceholder style={{width:42,height:42}} showLoadingAnimation ready={!loading} type="round" rows={1}><img alt="." src={DisplayIcon(avatar)} /></ReactPlaceholder></a></section>
                </div>
            </div>
        </header>
    )
}

export default TestHeader;