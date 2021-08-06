import React from 'react';
import Tooltip from 'react-simple-tooltip' //Mess with all tooltip props here: https://cedricdelpoux.github.io/react-simple-tooltip/
function DefaultTooltip(p) {
	return <Tooltip className="jTooltip" content={p.tooltip}>{p.mouseOverText}</Tooltip>
}
function ExpandTooltip(p) {
	return <Tooltip
  background="rgba(38,53,63,0.95);"
  border="0"
  arrow={10}
  fadeDuration={200}
  fadeEasing="linear"
  fixed={false}
  offset={0}
  padding={16}
  placement="top"
  radius={5}
  zIndex={1} 
  className="xTooltip" content={p.tooltip}>{p.mouseOverText}</Tooltip>
}

function TestPanel(p) {
    return ( //Futasuke is a genius
<div className="main">
<div className="containerA">
<div className="box">
<div className="boxTitleBar">
<h1>Basic Information</h1>
<div className="boxExit"></div>
</div>

<div>

 </div> 

<table className="basicInfo">
  <tr>
    <td>Author</td>
	<td>&nbsp;</td>
    <td>Dudley</td>
  </tr>
  <tr>
    <td>Build Name</td>
	<td>&nbsp;</td>
    <td>Fatimah</td>
  </tr>
  <tr>
    <td>Class</td>
    <td><img alt="" src="Ra.png" /> Ranger</td>
    <td><span className="ye">Lv.20</span></td>
  </tr>
   <tr>
    <td>&nbsp;</td>
    <td><img alt="" src="Fo.png" /> Force</td>
    <td>Lv.15</td>
  </tr>
</table>
</div>
<div className="box">
<div className="boxTitleBar">
<h1>Current Effects</h1>
<div className="boxExit"></div>
</div>
<ul className="boxmenu">
<li>1</li>
<li>2</li>
</ul>
<h3>Effect Name</h3>
<ul className="infoBuffs">
	<li>Food Bost Effect
		<ul>
			<li><img alt="" src="https://i.imgur.com/TQ8EBW2.png" />&ensp;[Meat] Potency +10.0%</li>
			<li><img alt="" src="https://i.imgur.com/TQ8EBW2.png" />&ensp;[Crisp] Potency to Weak Point +5.0%</li>
		</ul>
	</li>
	<li>Shifta / Deband
		<ul>
			<li><img alt="" src="https://i.imgur.com/VIYYNIm.png" />&ensp;Potency +5.0%</li>
			<li><img alt="" src="https://i.imgur.com/VIYYNIm.png" />&ensp;Damage Resistance +10.0%</li>
		</ul>
	</li>
	<li>Region Mag Boost
		<ul>
			<li><img alt="" src="https://i.imgur.com/N6M74Qr.png" />&ensp;Potency +5.0%</li>
		</ul>
	</li>
</ul>
</div>
</div>
<div className="containerB">
<div className="box">
<div className="boxTitleBar">
<h1>Equip</h1>
<div className="boxExit"></div>
</div>
<div className="equipPalette">
	<div className="equipPaletteSlot"><h3>Weapons</h3><div className="equipPaletteSlotWrapper"><span>1</span><img className="r4" alt="" src="./64px-NGSUIItemResurgirRifle.png" /></div></div>
	<div className="equipPaletteSlot"><h3>Armor 1</h3><div className="equipPaletteSlotWrapper"><img className="r3" alt="" src="./photon_barrier.png" /></div></div>
	<div className="equipPaletteSlot"><h3>Armor 2</h3><div className="equipPaletteSlotWrapper"><img className="r3" alt="" src="./photon_barrier.png" /></div></div>
	<div className="equipPaletteSlot"><h3>Armor 3</h3><div className="equipPaletteSlotWrapper"><img className="r3" alt="" src="./photon_barrier.png" /></div></div>
</div>
</div>
<div className="box">
<div className="boxTitleBar">
<h1>Equipped Weapon</h1>
<div className="boxExit"></div>
</div>
<h2 className="rifle">Resurgir Rifle+40</h2>
<ul className="boxmenu">
<li>1</li>
<li>2</li>
<li>3</li>
<li>4</li>
<li>5</li>
<li>6</li>
</ul>
<div className="equipDetails">
<div className="equipAugs">
<h3>Abilitiy Details</h3>
<ul>
<li><ExpandTooltip mouseOverText={<img alt="" src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} />} tooltip={<>Potency +20%/<br />Critical Hit Rage +15% for 30 seconds after a successful sidestep</>}/><span className="pot">Dynamo Unit Lv.3</span></li>
<li><ExpandTooltip mouseOverText={<img alt="" src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} />} tooltip={<>Potency +4%</>}/><span className="fixa">Fixa Attack Lv.3</span></li>
<li><ExpandTooltip mouseOverText={<img alt="" src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} />} tooltip={<>PP +5<br />Ranged Weapon Potency +2.0%</>}/><span className="aug">Pettas Soul II</span></li>
<li><ExpandTooltip mouseOverText={<img alt="" src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} />} tooltip={<>HP -10, Potency +1.5%,<br />Potency Floor Increase +1.5%<br />Damage Resistance -1.5%</>}/><span className="aug">Alts Secreta II</span></li>
<li><ExpandTooltip mouseOverText={<img alt="" src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} />} tooltip={<>HP +10<br />Ranged Weapon Potency +2.0%</>}/><span className="aug">Gigas Precision II</span></li>
<li><ExpandTooltip mouseOverText={<img alt="" src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} />} tooltip={<>Ranged Weapon Potency +2.0%</>}/><span className="aug">Precision III</span></li>
<li><img alt="" src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} /></li>
</ul>
</div>
<div className="pr">
<h3>Properties</h3>
<ul>
<li>Enhancement Lv.&emsp;<span>+35</span></li>
<li>Multi-Weapon&emsp;<span>-</span></li>
<li>Element&emsp;<span>-</span></li>
</ul>
</div>
</div>
</div>
</div>
<div className="containerC">
<div className="box">
<div className="boxTitleBar">
<h1>Basic Stats</h1>
<div className="boxExit"></div>
</div>
<table className="statsInfo">
  <tr>
    <td>Battle Power</td>
	<td className="ri">{p.bp}</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>HP</td>
	<td>289</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>PP</td>
    <td>100</td>
    <td>&nbsp;</td>
  </tr>
   <tr>
    <td>Defense</td>
    <td>402</td>
    <td>&nbsp;</td>
  </tr>
   <tr>
    <td>Weapon Up</td>
    <td className="statsMelWeaponUp"><span className="ye">+34%</span></td>
    <td className="statsRngWeaponUp"><span className="ye">+34%</span></td>
  </tr>
  <tr>
    <td></td>
    <td className="statsTecWeaponUp"><span className="ye">+34%</span></td>
    <td>&nbsp;</td>
  </tr>
    <tr>
    <td>Damage Resist.</td>
    <td>18%</td>
    <td>&nbsp;</td>
</tr>
</table>
</div>
<div className="box">
<div className="boxTitleBar">
<h1>Damage Stats</h1>
<div className="boxExit"></div>
</div>
<ul className="boxmenu">
<li>1</li>
<li>2</li>
<li>3</li>
</ul>
<table className="basicInfo">
  <tr>
    <td>Critical Hit Rate</td>
    <td>5%</td>
  </tr>
   <tr>
    <td>Critical Multiplier</td>
    <td>120%</td>
  </tr>
  <tr>
    <td>Midrange</td>
    <td>126</td>
  </tr>
  <tr>
    <td>Critcal</td>
    <td>152</td>
  </tr>
   <tr>
    <td>Effective</td>
    <td><span className="ye">127</span></td>
  </tr>
</table>
</div>
</div>
</div>
    )
    }

export default TestPanel;