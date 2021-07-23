import React from 'react';

function TestHeader() {
    return ( 
        <div id="header">
        <div>
        <ul>
            <li className="logo"><a href="./test"><img alt="" src={process.env.PUBLIC_URL + '/icons/logo_sm.png'} />&emsp;NGSplanner.com</a></li>
            <li className="headermenuitem"><a href="./test">Build Planner</a></li>
            <li className="headermenuitem"><a href="./test">Guides</a></li>
            <li className="headermenuitem"><a href="./test">Blog</a></li>
            <li className="headermenuitem"><a href="./test">About</a></li>
        </ul>
        </div>
        </div>
    )
    }

export default TestHeader;