import React from 'react';

function TestHeader() {
    return (
        <header>
            <div style={{gridArea:"1 / span 3"}}>
                <ul>
                    <li className="logo"><a href="."><img alt="" src={process.env.PUBLIC_URL + '/icons/logo_sm.png'} />&emsp;NGS<span>planner.com</span></a></li>
                    <li className="headerMenuItem"><a href=".">Build Planner</a></li>
                    <li className="headerMenuItem"><a href=".">Guides</a></li>
                    <li className="headerMenuItem"><a href=".">Blog</a></li>
                    <li className="headerMenuItem"><a href=".">About</a></li>
                </ul>
            </div>
        </header>
    )
}

export default TestHeader;