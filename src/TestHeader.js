import React from 'react';

function TestHeader() {
    return (
        <header>
            <div className="headerWrapper">
                <div className="logo"><a href="."><img alt="" src={process.env.PUBLIC_URL + '/icons/logo_sm.png'} />&emsp;NGS<span>planner</span></a></div>
                <div className="navigation"><ul>
                    <li className="headerMenuItem"><a href=".">Builds</a></li>
                    <li className="headerMenuItem"><a href=".">Guides</a></li>
                    <li className="headerMenuItem"><a href=".">Blog</a></li>
                    <li className="headerMenuItem"><a href=".">About</a></li></ul>
                    <section className="miniNav"><a href="."><span className="dotMenu">&#xb7;&#xb7;&#xb7;</span></a></section>
                </div>
                <div className="rightNav">
                    <section className="loginNav"><a href="."><img alt="." src={process.env.PUBLIC_URL + '/icons/nicodotpng.png.png'} /> Guest &emsp; <span className="dotMenu">&#xb7;&#xb7;&#xb7;</span></a></section>
                    <section className="miniNav"><a href="."><img alt="." src={process.env.PUBLIC_URL + '/icons/nicodotpng.png.png'} /></a></section>
                </div>
            </div>
        </header>
    )
}

export default TestHeader;