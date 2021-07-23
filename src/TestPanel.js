import React from 'react';

function TestPanel() {
    return ( //Futasuke is a genius

<div className="container">
<div className="box itembox">
<div className="boxTitleBar">
<h1>Weapon Select</h1>
<div className="boxExit"></div>
</div>
<ul className="boxmenu">
<li>Rifle</li>
<li>Launcher</li>
<li>Rod</li>
<li>Talis</li>
</ul>
<div className="itemBar">
<div className="itemBarSort">
<select className="itemBarForm">
  <option>Standard Sort</option>
  <option>Rarity</option>
  <option>Attack</option>
  <option>Potency</option>
</select>
</div>
<div className="itemBarFilter">
<input className="itemBarForm" type="text" placeholder="Filter" />
</div>
</div>
<div className="itemlistcontainer customScrollbar">
<ul className="itemlist">
<li className="itemwep r1"><img className="itemimg" alt="" src={process.env.PUBLIC_URL+"/icons/64px-NGSUIItemPrimmRifle.png"} /><em className="rifle">Primm Rifle</em><br /><span className="atk">177</span>					<span className="pot tooltip">Recycler Unit<span>Lv.4: Potency +24%/<br />20% chance of Restasigne not being consumed on use. Effect starts 10 sec after equip</span></span></li>
<li className="itemwep r2"><img className="itemimg" alt="" src={process.env.PUBLIC_URL+"/icons/64px-NGSUIItemTzviaRifle.png"} /><em className="rifle">Tzvia Rifle</em><br /><span className="atk">195</span>					<span className="pot tooltip">Indomitable Unit<span>Lv.4: Potency +26%/<br />All Down Resistances +20%</span></span></li>
<li className="itemwep r3"><img className="itemimg" alt="" src={process.env.PUBLIC_URL+"/icons/64px-NGSUIItemTheseusRifle.png"} /><em className="rifle">Theseus Rifle</em><br /><span className="atk">223</span>				<span className="pot tooltip">Defensive Formation<span>Lv.4: Potency +22%/<br />Critical Hit Rate increases based on Defense, up to a maximum of +18% at 1,000 Defense.</span></span></li>
<li className="itemwep r4"><img className="itemimg" alt="" src={process.env.PUBLIC_URL+"/icons/64px-NGSUIItemResurgirRifle.png"} /><em className="rifle">Resurgir Rifle</em><br /><span className="atk">240</span>				<span className="pot tooltip">Dynamo Unit<span>Lv.4: Potency +21%/<br />Critical Hit Rate +18% for 30 seconds after a successful Sidestep.</span></span></li>
<li className="itemwep r4"><img className="itemimg" alt="" src={process.env.PUBLIC_URL+"/icons/64px-NGSUIItemFoursisRifle.png"} /><em className="rifle">Foursis Rifle</em><br /><span className="atk">242</span>				<span className="pot tooltip">Bastion Unit<span>Lv.4: Potency +24%/<br />Creates a barrier that provides Damage Resistance +50% when at Max HP.</span></span></li>
<li className="itemwep"><img className="itemimg" alt="" src={process.env.PUBLIC_URL+"/icons/logo_test.png"} /><em className="gb">Test</em><br /><span className="atk">999</span>												<span className="pot tooltip" title="Test">Test<span>Test</span></span></li>
<li className="itemwep"><img className="itemimg" alt="" src={process.env.PUBLIC_URL+"/icons/logo_test.png"} /><em className="gb">Test</em><br /><span className="atk">999</span>												<span className="pot tooltip" title="Test">Test<span>Test</span></span></li>
<li className="itemwep"><img className="itemimg" alt="" src={process.env.PUBLIC_URL+"/icons/logo_test.png"} /><em className="gb">Test</em><br /><span className="atk">999</span>												<span className="pot tooltip" title="Test">Test<span>Test</span></span></li>
</ul>
</div>
</div>
<div className="box itembox">
<div className="boxTitleBar">
<h1>Food List</h1>
<div className="boxExit"></div>
</div>
<div className="itemBar">
<div className="itemBarSort">
</div>
<div className="itemBarFilter">
<input className="itemBarForm" type="text" placeholder="Filter" />
</div>
</div>
<div className="itemlistcontainer customScrollbar">
<ul className="itemlist">
<li className="itemwep r1"><img className="itemimg" alt="" src={process.env.PUBLIC_URL+"/icons/food/rich_aelio_herb.png"} /><em className="vege">Rich Aelio Herb</em><br /><span className="atk">177</span>						</li>	
</ul>
</div>
</div>
</div>

    )
    }

export default TestPanel;