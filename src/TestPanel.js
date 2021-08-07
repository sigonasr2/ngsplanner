import React, { useEffect,useState,useRef } from 'react';
import Tooltip from 'react-simple-tooltip' //Mess with all tooltip props here: https://cedricdelpoux.github.io/react-simple-tooltip/
import Modal from 'react-modal'
import {XSquare} from 'react-bootstrap-icons'

/**
 * Hook that alerts clicks outside of the passed ref
 */
 function useOutsideAlerter(ref,setEdit) {
  useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
          if (ref.current && !ref.current.contains(event.target)) {
              setEdit(false)
          }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [ref,setEdit]);
}

function EditBox(p) {
	useEffect(()=>{
		var timer1 = setTimeout(()=>{
      document.getElementById("editBoxInput").focus()
      document.getElementById("editBoxInput").select()
  },100)
		return () => {
			clearTimeout(timer1);
		};
	},[p.edit])
	return <input id="editBoxInput" type={p.type} max={p.type==="number"?20:undefined} min={p.type==="number"?1:undefined} onKeyDown={(e)=>{
		if (e.key==="Enter") {p.setEdit(false)}
		else if (e.key==="Escape") {p.setEdit(false)}
	}}	maxLength={p.maxlength?p.maxlength:20} onBlur={()=>{p.setEdit(false)}} value={p.value} onChange={(f)=>{f.currentTarget.value.length>0?p.setName(f.currentTarget.value):p.setName(p.originalName)}}>
	</input>
}

function EditBoxInput(p) {
	const [edit,setEdit] = useState(false)
	
	useEffect(()=>{
		if (p.callback) {
			p.callback()
		}
	},[edit,p])
	
	return <>
		<div className={edit?"editBoxActive":"editBox"} onClick={(f)=>{setEdit(true)}}>
			{edit?
			<EditBox edit={edit} maxlength={p.maxlength} type={p.type} setEdit={setEdit} originalName={p.data} setName={p.setData} value={p.data}/>
			:<>{p.prefix}{p.data}</>}
		</div>
	</>
}

function PageControlButton(p) {
	return <li onClick={()=>{p.setCurrentPage(p.page)}} className={(p.currentPage===p.page)?"selected":""}>{p.pageName?p.pageName:p.page}</li>
}

function PageControl(p) {
	var pages = []
	for (var i=0;i<p.pages;i++) {
		pages.push(<PageControlButton pageName={p.pageNames?p.pageNames[i]:undefined} currentPage={p.currentPage} setCurrentPage={p.setCurrentPage} page={i+1}/>)
	}
	return <ul className="boxmenu">
			{pages.map((page,i)=>{return <React.Fragment key={i}>{page}</React.Fragment>})}
		</ul>
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

function Class(p) {
  const CLASSES = p.GetData("class")
	const class_obj = CLASSES[p.name]
	return class_obj?<><img src={process.env.PUBLIC_URL+class_obj.icon}/>{class_obj.name}</>:<></>
}

function ClassSelector(p){
  const CLASSES = p.GetData("class")
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef,p.setEdit);
	return <><div className="popup2" ref={wrapperRef}>
    Class Selector<hr/>
      <div className="popup">
        {Object.keys(CLASSES).map((cl,i)=>{
        return <button id={i} className="rounded" onClick={()=>{p.setClassName(cl);p.setEdit(false)}}><img src={process.env.PUBLIC_URL+CLASSES[cl].icon}/><br/>{CLASSES[cl].name}</button>
        })}
      </div>
    </div>
  </>
}

function EditableClass(p){
	const [edit,setEdit] = useState(false)
	return <><div className="editClass" onClick={()=>{setEdit(!edit)}}><Class GetData={p.GetData} name={p.class}/>
	</div>
	{edit&&<ClassSelector GetData={p.GetData} setClassName={p.setClassName} setEdit={setEdit}/>}
	</>
}

function PopupWindow(p) {
	return <Modal isOpen={p.modalOpen} onRequestClose={()=>{p.setModalOpen(false)}} shouldFocusAfterRender={true} shouldCloseOnOverlayClick={true} shouldCloseOnEsc={true} className="modal" overlayClassName="modalOverlay">
<div className="box boxModal">
<div className="boxTitleBar">
<h1>{p.title}</h1>
{p.showCloseButton&&<div className="boxExit" onClick={()=>{p.setModalOpen(false)}}></div>}
</div>
<PageControl pages={p.pageNames.length} pageNames={p.pageNames}/>
<div className="itemBar">
<div className="itemBarSort">
<select className="itemBarForm">
  {p.sortItems.map((item)=><option>{item.name}</option>)}
</select>
</div>
<div className="itemBarFilter">
{p.filter&&<input className="itemBarForm" type="text" placeholder="Filter" />}
</div>
</div>
{p.children}
</div>
	</Modal>
} 

function TestPanel(p) {
const [bpGraphMax,setbpGraphMax] = useState(1000)
const [hpGraphMax,sethpGraphMax] = useState(1000)
const [ppGraphMax,setppGraphMax] = useState(1000)
const [atkGraphMax,setatkGraphMax] = useState(1000)
const [defGraphMax,setdefGraphMax] = useState(1000)

const [author,setauthor] = useState("Player")
const [buildName,setbuildName] = useState("Character")
const [className,setclassName] = useState("Hunter")
const [subclassName,setsubclassName] = useState("Force")
const [level,setLevel] = useState(1)
const [secondaryLevel,setsecondaryLevel] = useState(1)

const [effectPage,setEffectPage] = useState(1)
const [weaponPage,setWeaponPage] = useState(1)
const [statPage,setStatPage] = useState(1)

const [modalOpen,setModalOpen] = useState(true)

useEffect(()=>{
  if (p.bp>1000) {
    setbpGraphMax(3000)
    sethpGraphMax(3000)
    setppGraphMax(3000)
    setatkGraphMax(3000)
    setdefGraphMax(3000)
  } else {
    setbpGraphMax(1000)
    sethpGraphMax(1000)
    setppGraphMax(1000)
    setatkGraphMax(1000)
    setdefGraphMax(1000)
  }
},[p.bp]) 

//console.log(p.GetData("class",p.className,"icon"))

    return (<>
<div className="main">
<div className="containerA">
<div className="box">
<div className="boxTitleBar">
<h1>Basic Information</h1>
<div className="boxExit"></div>
</div>

<table className="basicInfo">
  <tr>
    <td>Author</td>
    <td colspan="2"><EditBoxInput setData={setauthor} data={author}/></td>
  </tr>
  <tr>
    <td>Build Name</td>
    <td colspan="2"><EditBoxInput setData={setbuildName} data={buildName}/></td>
  </tr>
  <tr>
    <td>Class</td>
    <td>
    <EditableClass GetData={p.GetData} setClassName={setclassName} class={className}></EditableClass>
    </td>
    <td>
    <span className="ye"><EditBoxInput prefix="Lv." setData={setLevel} data={level} type="number"/></span>
    </td>
  </tr>
  <tr>
    <td>Sub-Class</td>
    <td>
    <EditableClass GetData={p.GetData} setClassName={setsubclassName} class={subclassName}></EditableClass>
    </td>
    <td>
    <EditBoxInput prefix="Lv." setData={setsecondaryLevel} data={secondaryLevel} type="number"/>
    </td>
  </tr>
</table>
</div>
<div className="box">
<div className="boxTitleBar">
<h1>Current Effects</h1>
<div className="boxExit"></div>
</div>
<PageControl pages={2} currentPage={effectPage} setCurrentPage={setEffectPage}/>
<h3>Effect Name</h3>
<ul className="infoBuffs">
	{
    effectPage===1?<><li>Food Boost Effect
      <ul>
        <li><img src="https://i.imgur.com/TQ8EBW2.png" />&ensp;[Meat] Potency +10.0%</li>
        <li><img src="https://i.imgur.com/TQ8EBW2.png" />&ensp;[Crisp] Potency to Weak Point +5.0%</li>
      </ul>
    </li>
    <li>Shifta / Deband
      <ul>
        <li><img src="https://i.imgur.com/VIYYNIm.png" />&ensp;Potency +5.0%</li>
        <li><img src="https://i.imgur.com/VIYYNIm.png" />&ensp;Damage Resistance +10.0%</li>
      </ul>
    </li>
    <li>Region Mag Boost
      <ul>
        <li><img src="https://i.imgur.com/N6M74Qr.png" />&ensp;Potency +5.0%</li>
      </ul>
    </li></>:<></>
  }
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
	<div className="equipPaletteSlot"><h3>Weapons</h3><div className="equipPaletteSlotWrapper"><span>1</span><img className="r4" src="./64px-NGSUIItemResurgirRifle.png" /></div></div>
	<div className="equipPaletteSlot"><h3>Armor 1</h3><div className="equipPaletteSlotWrapper"><img className="r3" src="./photon_barrier.png" /></div></div>
	<div className="equipPaletteSlot"><h3>Armor 2</h3><div className="equipPaletteSlotWrapper"><img className="r3" src="./photon_barrier.png" /></div></div>
	<div className="equipPaletteSlot"><h3>Armor 3</h3><div className="equipPaletteSlotWrapper"><img className="r3" src="./photon_barrier.png" /></div></div>
</div>
</div>
<div className="box">
<div className="boxTitleBar">
<h1>Equipped Weapon</h1>
<div className="boxExit"></div>
</div>
<h2 className="rifle">Resurgir Rifle+40</h2>
<PageControl pages={6} currentPage={weaponPage} setCurrentPage={setWeaponPage}/>
<div className="equipDetails">
<div className="equipAugs">
<h3>Abilitiy Details</h3>
{weaponPage===1?
  <ul>
  <li><ExpandTooltip mouseOverText={<img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} />} tooltip={<>Potency +20%/<br />Critical Hit Rage +15% for 30 seconds after a successful sidestep</>}/><span className="pot">Dynamo Unit Lv.3</span></li>
  <li><ExpandTooltip mouseOverText={<img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} />} tooltip={<>Potency +4%</>}/><span className="fixa">Fixa Attack Lv.3</span></li>
  <li><ExpandTooltip mouseOverText={<img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} />} tooltip={<>PP +5<br />Ranged Weapon Potency +2.0%</>}/><span className="aug">Pettas Soul II</span></li>
  <li><ExpandTooltip mouseOverText={<img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} />} tooltip={<>HP -10, Potency +1.5%,<br />Potency Floor Increase +1.5%<br />Damage Resistance -1.5%</>}/><span className="aug">Alts Secreta II</span></li>
  <li><ExpandTooltip mouseOverText={<img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} />} tooltip={<>HP +10<br />Ranged Weapon Potency +2.0%</>}/><span className="aug">Gigas Precision II</span></li>
  <li><ExpandTooltip mouseOverText={<img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} />} tooltip={<>Ranged Weapon Potency +2.0%</>}/><span className="aug">Precision III</span></li>
  <li className="addAug"><img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} /></li>
  </ul>
:
  <ul>
     <li className="addAug"><img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} /></li>
     <li className="addAug"><img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} /></li>
     <li className="addAug"><img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} /></li>
     <li className="addAug"><img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} /></li>
     <li className="addAug"><img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} /></li>
     <li className="addAug"><img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} /></li>
     <li className="addAug"><img src={process.env.PUBLIC_URL+"/icons/aug_plus.png"} /></li>
</ul>
}
</div>
<div className="pr">
<h3>Properties</h3>
{weaponPage===1?
  <ul>
    <li>Enhancement Lv.&emsp;<span>+35</span></li>
    <li>Multi-Weapon&emsp;<span>-</span></li>
    <li>Element&emsp;<span>-</span></li>
  </ul>:
  <ul>
    <li>Enhancement Lv.&emsp;<span>-</span></li>
    <li>Multi-Weapon&emsp;<span>-</span></li>
    <li>Element&emsp;<span>-</span></li>
  </ul>
}
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
	<td>{p.bp}</td>
  <td colspan="2"><div className="barGraph"><span className="barOverlay" style={{background:"linear-gradient(90deg,transparent 0% "+((p.bp/bpGraphMax)*100)+"%,black "+((p.bp/bpGraphMax)*100)+"%)"}}>&nbsp;</span></div></td>
  </tr>
  <tr>
    <td>HP</td>
	<td>{p.hp}</td>
  <td colspan="2"><div className="barGraph"><span className="barOverlay" style={{background:"linear-gradient(90deg,transparent 0% "+((p.hp/hpGraphMax)*100)+"%,black "+((p.hp/hpGraphMax)*100)+"%)"}}>&nbsp;</span></div></td>
  </tr>
  <tr>
    <td>PP</td>
    <td>{p.pp}</td>
    <td colspan="2"><div className="barGraph"><span className="barOverlay" style={{background:"linear-gradient(90deg,transparent 0% "+((p.pp/ppGraphMax)*100)+"%,black "+((p.pp/ppGraphMax)*100)+"%)"}}>&nbsp;</span></div></td>
  </tr>
  <tr>
    <td>Attack</td>
    <td>{p.statDisplayAtk}</td>
    <td colspan="2"><div className="barGraph"><span className="barOverlay" style={{background:"linear-gradient(90deg,transparent 0% "+((p.statDisplayAtk/atkGraphMax)*100)+"%,black "+((p.statDisplayAtk/atkGraphMax)*100)+"%)"}}>&nbsp;</span></div></td>
  </tr>
   <tr>
    <td>Defense</td>
    <td>{p.def}</td>
    <td colspan="2"><div className="barGraph"><span className="barOverlay" style={{background:"linear-gradient(90deg,transparent 0% "+((p.def/defGraphMax)*100)+"%,black "+((p.def/defGraphMax)*100)+"%)"}}>&nbsp;</span></div></td>
  </tr>
   <tr>
    <td>Weapon Up</td>
    <td><img src={process.env.PUBLIC_URL+"/icons/mel.png"} /><span className="ye">&nbsp;+{(p.weaponUp1*100).toFixed(1)}%</span><br />
    <img src={process.env.PUBLIC_URL+"/icons/tec.png"} /><span className="ye">&nbsp;+{(p.weaponUp3*100).toFixed(1)}%</span></td>
    <td><img src={process.env.PUBLIC_URL+"/icons/rng.png"} /><span className="ye">&nbsp;+{(p.weaponUp2*100).toFixed(1)}%</span></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>Ailment Resist.</td>
    <td>{p.damageResist}</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
</tr>
    <tr>
    <td>Damage Resist.</td>
    <td>{p.damageResist}</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
</tr>
</table>
</div>
<div className="box">
<div className="boxTitleBar">
<h1>Damage Stats</h1>
<div className="boxExit"></div>
</div>
<PageControl pages={3} currentPage={statPage} setCurrentPage={setStatPage}/>
<table className="basicInfo">
  {statPage===1?<>
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
  </>:<>
    <tr>
      <td>Critical Hit Rate</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Critical Multiplier</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Midrange</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Critcal</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Effective</td>
      <td><span className="ye">-</span></td>
    </tr>
    </>
  }
</table>
</div>
</div>
</div>

<PopupWindow modalOpen={modalOpen} setModalOpen={setModalOpen} showCloseButton={true} title="Modal Title"
  pageNames={["All","Rifle","Launcher","Rod","Talis"]}
  sortItems={[
    {name:"Standard Sort",value:"id"},
    {name:"Rarity",value:"rarity"},
    {name:"Attack",value:"atk"},
    {name:"Potency",value:"potency"}]}
  filter={true}
>
  <div className="modalItemListContainer customScrollbar">
  <ul className="itemlist">
  <li className="itemwep r1"><img className="itemimg" alt="" src="64px-NGSUIItemPrimmRifle.png" /><em className="rifle">Primm Rifle</em><br /><span className="atk">177</span>					<span className="pot tooltip">Recycler Unit<span>Lv.4: Potency +24%/<br />20% chance of Restasigne not being consumed on use. Effect starts 10 sec after equip</span></span></li>
  <li className="itemwep r2"><img className="itemimg" alt="" src="64px-NGSUIItemTzviaRifle.png" /><em className="rifle">Tzvia Rifle</em><br /><span className="atk">195</span>					<span className="pot tooltip">Indomitable Unit<span>Lv.4: Potency +26%/<br />All Down Resistances +20%</span></span></li>
  <li className="itemwep r3"><img className="itemimg" alt="" src="64px-NGSUIItemTheseusRifle.png" /><em className="rifle">Theseus Rifle</em><br /><span className="atk">223</span>				<span className="pot tooltip">Defensive Formation<span>Lv.4: Potency +22%/<br />Critical Hit Rate increases based on Defense, up to a maximum of +18% at 1,000 Defense.</span></span></li>
  <li className="itemwep r4"><img className="itemimg" alt="" src="64px-NGSUIItemResurgirRifle.png" /><em className="rifle">Resurgir Rifle</em><br /><span className="atk">240</span>				<span className="pot tooltip">Dynamo Unit<span>Lv.4: Potency +21%/<br />Critical Hit Rate +18% for 30 seconds after a successful Sidestep.</span></span></li>
  <li className="itemwep r4"><img className="itemimg" alt="" src="64px-NGSUIItemFoursisRifle.png" /><em className="rifle">Foursis Rifle</em><br /><span className="atk">242</span>				<span className="pot tooltip">Bastion Unit<span>Lv.4: Potency +24%/<br />Creates a barrier that provides Damage Resistance +50% when at Max HP.</span></span></li>
  <li className="itemwep"><img className="itemimg" alt="" src="logo_test.png" /><em className="gb">Test</em><br /><span className="atk">999</span>												<span className="pot tooltip" title="Test">Test<span>Test</span></span></li>
  <li className="itemwep"><img className="itemimg" alt="" src="logo_test.png" /><em className="gb">Test</em><br /><span className="atk">999</span>												<span className="pot tooltip" title="Test">Test<span>Test</span></span></li>
  <li className="itemwep"><img className="itemimg" alt="" src="logo_test.png" /><em className="gb">Test</em><br /><span className="atk">999</span>												<span className="pot tooltip" title="Test">Test<span>Test</span></span></li>
  </ul>
  </div>
</PopupWindow>

</>
)
}

export default TestPanel;