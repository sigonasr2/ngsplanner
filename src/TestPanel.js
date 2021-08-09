import React, { useEffect,useState,useRef } from 'react';
import Tooltip from 'react-simple-tooltip' //Mess with all tooltip props here: https://cedricdelpoux.github.io/react-simple-tooltip/
import Modal from 'react-modal'

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
	return <li onClick={()=>{p.setCurrentPage(p.page)}} className={(p.currentPage===p.page)?"selected":"unselected"}>{p.pageName?p.pageName:p.page}</li>
}

function PageControl(p) {
	var pages = []
	for (var i=0;i<p.pages;i++) {
		pages.push(<PageControlButton pageName={p.pageNames?p.pageNames[i]:undefined} currentPage={p.currentPage} setCurrentPage={p.setCurrentPage} page={i+1}/>)
	}
	return pages.length>0&&<ul className="boxmenu">
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
  className="xTooltip" content={p.tooltip}>{p.children}</Tooltip>
}

function Class(p) {
  const CLASSES = p.GetData("class")
	const class_obj = CLASSES[p.name]
	return class_obj?<><img alt="" src={process.env.PUBLIC_URL+class_obj.icon}/>{class_obj.name}</>:<></>
}

function ClassSelector(p){
  const CLASSES = p.GetData("class")
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef,p.setEdit);
	return <><div className="popup2" ref={wrapperRef}>
    Class Selector<hr/>
      <div className="popup">
        {Object.keys(CLASSES).map((cl,i)=>{
        return <button id={i} className="rounded" onClick={()=>{p.setClassName(cl);p.setEdit(false)}}><img alt="" src={process.env.PUBLIC_URL+CLASSES[cl].icon}/><br/>{CLASSES[cl].name}</button>
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
    <PageControl  pages={p.pageNames?p.pageNames.length:0} pageNames={p.pageNames}  currentPage={p.page} setCurrentPage={p.setPage}/>
    
    {p.children}
  </div>
	</Modal>
} 

function SelectorWindow(p) {

  const [itemList,setItemList] = useState([])

  const [tabPage,setTabPage] = useState(1)
  const [sortSelector,setSortSelector] = useState(p.sortItems?p.sortItems[0]:"")
  const [filter,setFilter] = useState("")
  
  useEffect(()=>{
    if (p.dataFunction) {
      setItemList(p.dataFunction())
    }
  },[p])
  
  return <PopupWindow page={tabPage} setPage={setTabPage} modalOpen={p.modalOpen} setModalOpen={p.setModalOpen} showCloseButton={true} title={p.title}
      pageNames={p.pageNames}
      filter={true}
    >
    {(p.sortItems||p.filter)&&<div className="itemBar">
        <div className="itemBarSort">
          {p.sortItems&&<select className="itemBarForm" value={sortSelector} onChange={(f)=>{setSortSelector(f.currentTarget.value)}}>
            {p.sortItems.map((item)=><option value={item}>{item}</option>)}
          </select>}
        </div>
        <div className="itemBarFilter">
          {p.filter&&<input className="itemBarForm" type="text" placeholder="Filter" value={filter} onChange={(f)=>{setFilter(f.currentTarget.value)}} />}
        </div>
      </div>
    }<div className="tooltipAnchor">
    <div className="modalItemListContainer customScrollbar">
    <ul className="itemlist">
    {itemList.filter((item)=>p.filterFunction(tabPage,item)).filter((item)=>p.searchFieldFunction(filter,item)).sort((a,b)=>p.sortOrderFunction(sortSelector,a,b)).map((item)=>p.displayFunction(item))}
    {p.children}
    </ul>
    </div>
    </div>
  </PopupWindow>
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
const [level,setLevel] = useState(20)
const [secondaryLevel,setsecondaryLevel] = useState(20)

const [effectPage,setEffectPage] = useState(1)
const [weaponPage,setWeaponPage] = useState(1)
const [statPage,setStatPage] = useState(1)

const [classSelectWindowOpen,setClassSelectWindowOpen] = useState(false)
const [weaponSelectWindowOpen,setWeaponSelectWindowOpen] = useState(false)

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
    <div className="box basicInfoBox">
      <div className="boxTitleBar">
      <h1>Basic Information</h1></div>

      <table className="basicInfoTable">
        <tr>
          <td>Author</td>
          <td colspan="2"><EditBoxInput setData={setauthor} data={author}/></td>
        </tr>
        <tr>
          <td>Build Name</td>
          <td colspan="2"><EditBoxInput setData={setbuildName} data={buildName}/></td>
        </tr>
        <tr>
          <td onClick={()=>{setClassSelectWindowOpen(true)}} >Class</td>
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
      <h1>Current Effects</h1></div>
      <PageControl pages={2} currentPage={effectPage} setCurrentPage={setEffectPage}/>
      <h3>Effect Name</h3>
      <ul className="infoBuffs">
        {
          effectPage===1?<><li>Food Boost Effect
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
          </li></>:<></>
        }
      </ul>
      </div>
      </div>
      <div className="containerB">
        <div className="box">
          <div className="boxTitleBar">
          <h1>Equip</h1></div>
          <div className="equipPalette">
              <div onClick={()=>{setWeaponSelectWindowOpen(true)}} className="equipPaletteSlot"><h3>Weapons</h3><div className="equipPaletteSlotWrapper"><span>1</span><img alt="" className="r4" src="https://i.imgur.com/Xvx0qvt.png" /></div></div>
                <div className="equipPaletteSlot"><h3>Armor 1</h3><div className="equipPaletteSlotWrapper"><img alt="" className="r3" src="https://i.imgur.com/GtusK2X.png" /></div></div>
                  <div className="equipPaletteSlot"><h3>Armor 2</h3><div className="equipPaletteSlotWrapper"><img alt="" className="r3" src="https://i.imgur.com/GtusK2X.png" /></div></div>
                  <div className="equipPaletteSlot"><h3>Armor 3</h3><div className="equipPaletteSlotWrapper"><img alt="" className="r3" src="https://i.imgur.com/GtusK2X.png" /></div></div>
                </div>
              </div>

              <div className="box">
              <div className="boxTitleBar">
              <h1>Equipped Weapon</h1></div>
              <h2 className="rifle">Resurgir Rifle+40</h2>
              <PageControl pages={3} currentPage={weaponPage} setCurrentPage={setWeaponPage}/>


              {weaponPage===3?
                <div class="equipDetails">
<div class="equipAugs">
<h3>Ability Details</h3>
<ul>
<li><div class="equipAugsExpand tooltip"><img alt="" src="./icons/aug_plus.png" /><span>Potency +20%/<br />Critical Hit Rage +15% for 30 seconds after a successful sidestep</span></div><span class="pot">Dynamo Unit Lv.3</span></li>
<li><div class="equipAugsExpand tooltip"><img alt="" src="./icons/aug_plus.png" /><span>Potency +4%</span></div><span class="fixa">Fixa Attack Lv.3</span></li>
<li><div class="equipAugsExpand tooltip"><img alt="" src="./icons/aug_plus.png" /><span>PP +5<br />Ranged Weapon Potency +2.0%</span></div><span class="aug">Pettas Soul II</span></li>
<li><div class="equipAugsExpand tooltip"><img alt="" src="./icons/aug_plus.png" /><span>HP -10, Potency +1.5%,<br />Potency Floor Increase +1.5%<br />Damage Resistance -1.5%</span></div><span class="aug">Alts Secreta II</span></li>
<li><div class="equipAugsExpand tooltip"><img alt="" src="./icons/aug_plus.png" /><span>HP +10<br />Ranged Weapon Potency +2.0%</span></div><span class="aug">Gigas Precision II</span></li>
<li><div class="equipAugsExpand tooltip"><img alt="" src="./icons/aug_plus.png" /><span>Ranged Weapon Potency +2.0%</span></div><span class="aug">Precision III</span></li>
<li><img alt="" src="./icons/aug_plus.png" /></li>
</ul>
</div>
<div class="pr">
<h3>Stat Adjustment</h3>
<ul>
<li>Enhancement Lv.&emsp;<span>+35</span></li>
<li>Multi-Weapon&emsp;<span>-</span></li>
<li>Element&emsp;<span>-</span></li>
</ul>
</div>
</div>
              :
              <>hi</>
              }


        </div>
      </div>
      <div className="containerC">
      <div className="box">
      <div className="boxTitleBar">
      <h1>Basic Stats</h1></div>
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
          <td><img alt="" src={process.env.PUBLIC_URL+"/icons/mel.png"} /><span className="ye">&nbsp;+{(p.weaponUp1*100).toFixed(1)}%</span><br />
          <img alt="" src={process.env.PUBLIC_URL+"/icons/tec.png"} /><span className="ye">&nbsp;+{(p.weaponUp3*100).toFixed(1)}%</span></td>
          <td><img alt="" src={process.env.PUBLIC_URL+"/icons/rng.png"} /><span className="ye">&nbsp;+{(p.weaponUp2*100).toFixed(1)}%</span></td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>Ailment Resist.</td>
          <td>
            <img alt="" src={process.env.PUBLIC_URL+"/icons/status/burn.png"} /> {(p.burnResist*100).toFixed(1)}%<br />
            <img alt="" src={process.env.PUBLIC_URL+"/icons/status/shock.png"} /> {(p.shockResist*100).toFixed(1)}%<br />
            <img alt="" src={process.env.PUBLIC_URL+"/icons/status/panic.png"} /> {(p.panicResist*100).toFixed(1)}%<br />
            <img alt="" src={process.env.PUBLIC_URL+"/icons/status/stun.png"} /> {(p.stunResist*100).toFixed(1)}%<br />
          </td>
          <td>
            <img alt="" src={process.env.PUBLIC_URL+"/icons/status/freeze.png"} /> {(p.freezeResist*100).toFixed(1)}%<br />
            <img alt="" src={process.env.PUBLIC_URL+"/icons/status/blind.png"} /> {(p.blindResist*100).toFixed(1)}%<br />
            <img alt="" src={process.env.PUBLIC_URL+"/icons/status/poison.png"} /> {(p.poisonResist*100).toFixed(1)}%<br />
          </td>
          <td>&nbsp;</td>
      </tr>
          <tr>
          <td>Damage Resist.</td>
          <td>{(p.damageResist*100).toFixed(1)}%</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
      </tr>
      </table>
      </div>
      <div className="box">
      <div className="boxTitleBar">
      <h1>Damage Stats</h1></div>
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

<SelectorWindow title="Class Select" modalOpen={classSelectWindowOpen} setModalOpen={setClassSelectWindowOpen} GetData={p.GetData}>ez pz</SelectorWindow>

<SelectorWindow title="Weapon Selection" modalOpen={weaponSelectWindowOpen} setModalOpen={setWeaponSelectWindowOpen} GetData={p.GetData}
  pageNames={["All","Rifle","Launcher","Rod","Talis"]}
  sortItems={["Standard Sort","Rarity","Attack","Potency"]}
  filter={true}
  dataFunction={()=>{
    var dat1=p.GetData("weapon_existence_data")
      return Array.isArray(dat1)?dat1.map((we)=>{
        var weapon_type=p.GetData("weapon_type",we.weapon_type_id,undefined,true)
        var weapon=p.GetData("weapon",we.weapon_id,undefined,true)
        var potential=p.GetData("potential",weapon.potential_id,undefined,true)
        var potential_all=p.GetData("potential_data")
        var potential_tooltip=[]
        for (var pot in potential_all) {
          if (pot.includes(potential.name)) {
            potential_tooltip.push(p.GetData("potential_data",pot))
          }
        }
        return [weapon_type,weapon,potential,potential_tooltip]
      }):[]
  }}
  filterFunction={(page,item)=>{
    switch (page) {
      case 2:return item[0].name==="Assault Rifle"
      case 3:return item[0].name==="Launcher"
      case 4:return item[0].name==="Rod"
      case 5:return item[0].name==="Talis"
      default:return true
    }
  }}
  searchFieldFunction={(searchText,item)=>searchText.length>0?(item[1].name.toLowerCase()+" "+item[0].name.toLowerCase()).includes(searchText.toLowerCase()):true}
  sortOrderFunction={(sort,itemA,itemB)=>{
    switch (sort) {
      case "Rarity":return itemB[1].rarity-itemA[1].rarity
      case "Attack":return itemB[1].atk-itemA[1].atk
      default:return 0
    }  
  }}
  displayFunction={(item)=>{
  return <li className={"itemwep r"+item[1].rarity}><div class="itemWeaponWrapper"><img className="itemimg" alt="" src="64px-NGSUIItemPrimmRifle.png" /><em className="rifle">{item[1].name} {item[0].name}</em></div><br /><span className="atk">{item[1].atk}</span> <ExpandTooltip tooltip={<>{item[3].map((pot,i)=><>{(i!==0)&&<br/>}{pot.name}: {pot.description.split("\\n").map((it)=><>{it}<br/> </>)}</>)}</>}>
    <span className="pot">{item[2].name}</span>
    </ExpandTooltip></li>}}
  
  />

</>
)
}

export default TestPanel;