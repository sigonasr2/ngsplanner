import React from 'react';

function TestHeader() {
    return ( 
        <div id="header">
        <div>
        <ul>
            <li className="logo"><a><img alt="" src={process.env.PUBLIC_URL + '/icons/logo_sm.png'} />&emsp;NGSplanner.com</a></li>
            <li className="headermenuitem"><a>Build Planner</a></li>
            <li className="headermenuitem"><a>Guides</a></li>
            <li className="headermenuitem"><a>Blog</a></li>
            <li className="headermenuitem"><a>About</a></li>
        </ul>
        </div>
        </div>
    )
    }

export default TestHeader;