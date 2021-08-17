import React from 'react';

function TestHeader() {
    return ( 
        <div className="header">
        <div>
        <ul>
            <li className="logo"><a href="."><img alt="" src={process.env.PUBLIC_URL + '/icons/logo_sm.png'} />&emsp;NGS<span>planner.com</span></a></li>
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