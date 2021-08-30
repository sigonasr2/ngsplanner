import React from 'react';

function TestHeader() {
    return (
        <header>
            <div className="headerWrapper">
            <div className="logo"><a href="."><img alt="" src={process.env.PUBLIC_URL + '/icons/logo_sm.png'} />&emsp;NGS<span>planner.com</span></a></div>
               <div className="navigation"> <ul>
                    <li className="headerMenuItem"><a href=".">Build Planner</a></li>
                    <li className="headerMenuItem"><a href=".">Guides</a></li>
                    <li className="headerMenuItem"><a href=".">Blog</a></li>
                    <li className="headerMenuItem"><a href=".">About</a></li>
                </ul></div>
                <div className="rightNav"><a href="."><img alt="." src={process.env.PUBLIC_URL + '/icons/nicodotpng.png.png'} /> Guest &emsp; <span className="dotMenu">&#xb7;&#xb7;&#xb7;</span></a></div>
            </div>
        </header>
    )
}

export default TestHeader;