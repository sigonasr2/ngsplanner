import React from 'react';

function TestHeader() {
    return ( 
        <div id="header">
        <div>
        <ul>
            <li className="logo"><a href="."><img alt="" src={process.env.PUBLIC_URL + '/icons/logo_sm.png'} />&emsp;NGSplanner.com</a></li>
            <li className="headermenuitem"><a href=".">Build Planner</a></li>
            <li className="headermenuitem"><a href=".">Guides</a></li>
            <li className="headermenuitem"><a href=".">Blog</a></li>
            <li className="headermenuitem"><a href=".">About</a></li>
        </ul>
        </div>
        </div>
    )
    }

export default TestHeader;