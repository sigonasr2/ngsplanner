//import './App.css'; Old CSS
import './reset.css'; // Generic reset
import './style.css'; // The new new
import React, {useState,useEffect,useRef,useReducer} from 'react';
import Modal from 'react-modal'

import {XSquare, XSquareFill} from 'react-bootstrap-icons'

import {
  HashRouter,
  Switch,
  Route
} from "react-router-dom";

import { HashLink as Link } from 'react-router-hash-link';

import TestHeader from './TestHeader'; // Test Header!
import TestPanel from './TestPanel'; // Dudley's Test Panel

const axios = require('axios');

const BACKEND_URL = process.env.REACT_APP_GITPOD_WORKSPACE_URL||process.env.REACT_APP_BACKEND_URL||'https://projectdivar.com:4504'; //You can specify a .env file locally with REACT_APP_BACKEND_URL defining a URL to retrieve data from.

function Col(p) {
	return <div className="con">
		{p.children}
	</div>
}

function Box(p) {
	return <>
		<div className="box">
		<h1>&#9830;&ensp;{p.title}</h1>
			{p.children}
		</div>
	</>
}

function EditBox(p) {
	useEffect(()=>{
		var timer1 = setTimeout(()=>{document.getElementById("editBox").focus()},100)
		return () => {
			clearTimeout(timer1);
		};
	})
	return <input id="editBox" onKeyDown={(e)=>{
		if (e.key==="Enter") {p.setEdit(false)}
		else if (e.key==="Escape") {p.setEdit(false)}
	}}	maxLength={p.maxlength?p.maxlength:20} onBlur={()=>{p.setEdit(false)}} value={p.value} onChange={(f)=>{f.currentTarget.value.length>0?p.setName(f.currentTarget.value):p.setName(p.originalName)}}>
	</input>
}

function EditableBox(p) {
	const [edit,setEdit] = useState(false)
	
	useEffect(()=>{
		if (p.callback) {
			p.callback()
		}
	},[edit,p])
	
	return <>
		<div className="hover" onClick={(f)=>{setEdit(true)}}>
			{edit?
			<EditBox maxlength={p.maxlength} setEdit={setEdit} originalName={p.data} setName={p.setData} value={p.data}/>
			:<>{p.data}</>}
		</div>
	</>
}

const CLASSES = {
	HUNTER:{
		name:"Hunter",
		icon:process.env.PUBLIC_URL+"/icons/UINGSClassHu.png"
	},
	FIGHTER:{
		name:"Fighter",
		icon:process.env.PUBLIC_URL+"/icons/UINGSClassFi.png"
	},
	RANGER:{
		name:"Ranger",
		icon:process.env.PUBLIC_URL+"/icons/UINGSClassRa.png"
	},
	GUNNER:{
		name:"Gunner",
		icon:process.env.PUBLIC_URL+"/icons/UINGSClassGu.png"
	},
	FORCE:{
		name:"Force",
		icon:process.env.PUBLIC_URL+"/icons/UINGSClassFo.png"
	},
	TECHTER:{
		name:"Techter",
		icon:process.env.PUBLIC_URL+"/icons/UINGSClassTe.png"
	}
}

const EFFECTS = {
	"Food Boost Effect":{
		perks:[
			"[Meat] Potency +10.0%",
			"[Crisp] Potency to Weak Point +5.0%"
		],
		icon:process.env.PUBLIC_URL+"/icons/TQ8EBW2.png"
	},
	"Shifta / Deband":{
		perks:[
			"Potency +5.0%",
			"Damage Resistance +10.0%"
		],
		icon:process.env.PUBLIC_URL+"/icons/VIYYNIm.png"
	},
	"Region Mag Boost":{
		perks:[
			"Potency +5.0%",
		],
		icon:process.env.PUBLIC_URL+"/icons/N6M74Qr.png"
	},
}

const EQUIPMENT = {
	"Ophistia Shooter":{
		icon:process.env.PUBLIC_URL+"/icons/uc1iBck.png"
	},
	"Klauzdyne":{
		icon:process.env.PUBLIC_URL+"/icons/uldt9lR.png"
	},
	"Klauznum":{
		icon:process.env.PUBLIC_URL+"/icons/F0t58xP.png"
	},
	"Klauzment":{
		icon:process.env.PUBLIC_URL+"/icons/20M6Z7t.png"
	}
}

const ABILITIES = {
	"Wellspring Unit Lv.3":{
		icon:process.env.PUBLIC_URL+"/icons/NGSUIItemPotentialAbility.png"
	},
	"Fixa Fatale Lv.5":{
		icon:process.env.PUBLIC_URL+"/icons/UINGSItemPresetAbility.png"
	}
}

const ABILITY_DEFAULT_ICON = process.env.PUBLIC_URL+"/icons/UINGSItemSpecialAbility.png"

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


function Class(p) {
	const class_obj = CLASSES[p.name]
	return <><img alt="" src={class_obj.icon}/>{class_obj.name}</>
}

function ClassSelector(p){
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef,p.setEdit);
	return <div className="popup" ref={wrapperRef}>
		Class Selector<br/>
		{Object.keys(CLASSES).map((cl,i)=>{
		return <button id={i} className="rounded" onClick={()=>{p.setClassName(cl);p.setEdit(false)}}><img alt="" src={CLASSES[cl].icon}/><br/>{CLASSES[cl].name}</button>
		})}
	</div>
}

function EditableClass(p){
	const [edit,setEdit] = useState(false)
	return <><span className="hover" onClick={()=>{setEdit(!edit)}}><Class name={p.class}/>
	</span>
	{edit&&<ClassSelector setClassName={p.setClassName} setEdit={setEdit}/>}
	</>
}

function Table(p) {
	return <table className={p.classes}>
		<tbody>
			{p.children}
		</tbody>
	</table>
}

function MainBox(p) {
	return <Box title="NGS Planner">
		<Table classes="ba">
			<ListRow title="Author"><EditableBox setData={p.setAuthor} data={p.author}/></ListRow>
			<ListRow title="Build Name"><EditableBox setData={p.setBuildName} data={p.buildName}/></ListRow>
			<ListRow title="Class" content={<EditableClass setClassName={p.setClassName} class={p.className}></EditableClass>}><span className="ye">Lv.20</span></ListRow>
			<ListRow content={<><EditableClass setClassName={p.setSecondaryClassName} class={p.secondaryClassName}></EditableClass></>}>Lv.15</ListRow>
			<ListRow><button>Share</button> <button>Save</button></ListRow>
		</Table>
	   </Box>
}

function StatsBox(p) {
	 return <Box title="Stats">
			<Table classes="st">
				<ListRow title="Battle Power" content={p.bp}></ListRow>
				<ListRow title="HP" content={p.hp}></ListRow>
				<ListRow title="PP" content={p.pp}></ListRow>
				<ListRow title="Defense" content={p.def}></ListRow>
				<ListRow title="Weapon Up" content={<><img alt="" src="/icons/MEL.png" /> <span className="ye">+{p.weaponUp1*100}%</span></>}><img alt="" src="/icons/RNG.png" /> <span className="ye">+{p.weaponUp2*100}%</span></ListRow>
				<ListRow content={<><img alt="" src="/icons/TEC.png" /> <span className="ye">+{p.weaponUp3*100}%</span></>}></ListRow>
				<ListRow title="Damage Resist." content={p.damageResist*100+"%"}></ListRow>
			</Table>
		</Box>
}

function EffectListing(p) {
	return <li>{p.name}
			<ul>
			{EFFECTS[p.name].perks.map((perk,i)=>{
				return <li key={i}><img alt="" src={EFFECTS[p.name].icon} />&ensp;{perk}</li>
			})}
			</ul>
		</li>
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

function EffectsBox(p) {
	const [currentPage,setCurrentPage]=useState(1)
	
	return <Box title="Current Effects">
			<PageControl pages={2} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
			<h3>Effect Name</h3>
			{
				currentPage===1?
				<ul className="bu">
					{p.effectList.map((ef,i)=>{
							return <EffectListing key={i} name={ef}/>
					})}
				</ul>:
				<></>
			}
		</Box>
}

function EquipBox(p) {
	return <Box title="Equip">
			<div className="we">
				<div><h3>Weapon</h3><br /><img alt="" src={EQUIPMENT[p.weapon].icon} /><br />{p.weapon}+{p.weaponEnhancementLv}</div>
				<div><h3>Slot 1</h3><br /><img alt="" src={EQUIPMENT[p.armorSlot1].icon} /><br />{p.armorSlot1}+{p.armorSlot1EnhancementLv}</div>
				<div><h3>Slot 2</h3><br /><img alt="" src={EQUIPMENT[p.armorSlot2].icon} /><br />{p.armorSlot2}+{p.armorSlot2EnhancementLv}</div>
				<div><h3>Slot 3</h3><br /><img alt="" src={EQUIPMENT[p.armorSlot3].icon} /><br />{p.armorSlot3}+{p.armorSlot3EnhancementLv}</div>
			</div>
		</Box>
}

function EquippedWeaponBox(p) {
	const [currentPage,setCurrentPage] = useState(1)
	const [selectedEquip,setSelectedEquip] = useState(p.weapon)
	const [selectedEquipEnhancementLv,setSelectedEquipEnhancementLv] = useState(p.weaponEnhancementLv)
	const [selectedEquipAbilities,setSelectedEquipAbilities] = useState(p.weaponAbilityList)
	
	useEffect(()=>{
		switch (currentPage) {
			case 2:
				setSelectedEquip(p.armorSlot1)
				setSelectedEquipEnhancementLv(p.armorSlot1EnhancementLv)
				setSelectedEquipAbilities(p.armorSlot1AbilityList)
			break;
			case 3:
				setSelectedEquip(p.armorSlot2)
				setSelectedEquipEnhancementLv(p.armorSlot2EnhancementLv)
				setSelectedEquipAbilities(p.armorSlot2AbilityList)
			break;
			case 4:
				setSelectedEquip(p.armorSlot3)
				setSelectedEquipEnhancementLv(p.armorSlot3EnhancementLv)
				setSelectedEquipAbilities(p.armorSlot3AbilityList)
			break;
			default:{
				setSelectedEquip(p.weapon)
				setSelectedEquipEnhancementLv(p.weaponEnhancementLv)
				setSelectedEquipAbilities(p.weaponAbilityList)
			}
		}
	},[currentPage,p.armorSlot1,p.armorSlot1EnhancementLv,p.armorSlot1AbilityList,p.armorSlot2,p.armorSlot2EnhancementLv,p.armorSlot2AbilityList,p.armorSlot3,p.armorSlot3EnhancementLv,p.armorSlot3AbilityList,p.weapon,p.weaponEnhancementLv,p.weaponAbilityList])
	
	return <Box title="Equipped Weapon">
		<h2><img alt="" src="/icons/NGSUIItemAssaultRifleMini.png" />{selectedEquip}+{selectedEquipEnhancementLv}</h2>
		<PageControl pages={4} currentPage={currentPage} setCurrentPage={setCurrentPage} pageNames={["W",1,2,3]}/>
		<div className="de">
			<div>
				<h3>Ability Details</h3>
				<ul className="aug">
				{
					selectedEquipAbilities?selectedEquipAbilities.map((ability,i)=>{
						return <li key={i}><img alt="" src={ABILITIES[ability]?ABILITIES[ability].icon:ABILITY_DEFAULT_ICON} /> {ability}</li>
						}):<></>
				}
				</ul>
			</div>
			<div>
				<h3>Properties</h3>
				<ul className="pr">
				<li>Enhancement Lv.&emsp;<span>+{selectedEquipEnhancementLv}</span></li>
				<li>Multi-Weapon&emsp;<span>-</span></li>
				<li>Element&emsp;<span>-</span></li>
				</ul>
			</div>
		</div>
	</Box>
}

function DamageBox(p) {
	const [currentPage,setCurrentPage] = useState(1)
	
	return <Box title="Damage">
		<PageControl pages={3} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
		<br /><br />
		{
			currentPage===1&&
			<Table classes="ba">
				<ListRow title="Critical Hit Rate">{p.criticalHitRate*100}%</ListRow>
				<ListRow title="Critical Multiplier">{p.criticalMultiplier*100}%</ListRow>
				<ListRow title="Midrange">{p.midRange}</ListRow>
				<ListRow title="Critical">{p.critical}</ListRow>
				<ListRow title="Effective"><span className="ye">{p.effective}</span></ListRow>
			</Table>
		}
		</Box>
}

function ListRow(p) {
	return <tr>
		<td>{p.title}</td>
		<td>{p.content}</td>
		<td>{p.children}</td>
	</tr>
}

function PopupWindow(p) {
	return <Modal isOpen={p.modalOpen} onRequestClose={()=>{p.setModalOpen(false)}} shouldFocusAfterRender={true} shouldCloseOnOverlayClick={true} shouldCloseOnEsc={true}>
		<h1>{p.title}<XSquare onClick={()=>{p.setModalOpen(false)}} className="modalCloseButton"/></h1>
		{p.children}
	</Modal>
}

function InputBox(p) {
	const [value,setValue] = useState(p.value)
	const [failed,setFailed] = useState(false)
	const [sending,setSending] = useState(false)

	function changeFunc(f){setValue(f.currentTarget.value)}
	function blurFunc(f){
		setSending(true)
		setFailed(false)
		p.callback(f.currentTarget.value)
		.then(()=>{setFailed(false)})
		.catch(()=>{setFailed(true)})
		.then(()=>{setSending(false)})}

	return p.data?<select className={failed?"failedInput":sending?"submitting":""} value={value} onChange={(f)=>{changeFunc(f)}} onBlur={(f)=>{blurFunc(f)}}>
		{p.data.map((item)=><option value={item.id}>{item.id} - {item.name||item.username}</option>)}
	</select>:<input className={failed?"failedInput":sending?"submitting":""} value={value} onChange={(f)=>{changeFunc(f)}} onBlur={(f)=>{blurFunc(f)}}/>
}

function TableEditor(p) {
	
	const initialVals={}
	
	function updateVals(state,update) {
		if (update==='Clear') {
			return initialVals
		}
		state[update.field]=update.value
		return state
	}
	
	const [fields,setFields] = useState([])
	const [data,setData] = useState([])
	const [update,setUpdate] = useState(false)
	const [submitVals,setSubmitVal] = useReducer(updateVals,initialVals)
	const [loading,setLoading] = useState(false)
	const [dependencies,setDependencies] = useState([])
	
	function SubmitBoxes() {
		axios.post(BACKEND_URL+p.path,submitVals)
		.then(()=>{
			setUpdate(true)
		})
		.catch((err)=>{
			alert(JSON.stringify(err.response.data))
		})
	}
	
	useEffect(()=>{
		setUpdate(true)
	},[p.path])
	
	useEffect(()=>{
		if (update) {
			setLoading(true)
			axios.get(BACKEND_URL+p.path)
			.then((data)=>{
				var cols = data.data.fields
				var rows = data.data.rows
				
				setFields(cols.filter((col)=>col.name!=="id"))

				var dependency_map = {}
				var promise_list = []

				cols.filter((col)=>col.name!=="id"&&col.name.includes("_id")).forEach((col)=>{
					promise_list.push(axios.get(BACKEND_URL+"/"+col.name.replace("_id",""))
					.then((data)=>{
						dependency_map[col.name]=data.data.rows.reverse()
					}))
				})
				setDependencies(dependency_map)
				setData(rows)
				return Promise.allSettled(promise_list)
			})
			.then(()=>{
				setLoading(false)
			})
			setUpdate(false)
		}
	},[update,p.path])
	
	return <>
	{!loading?
		<div className="table-responsive">
			<table cellPadding="10" className="table text-light table-padding">
			<caption>{JSON.stringify(dependencies)}</caption>
			  <thead>
				<tr>
					<th className="table-padding"></th>
					{fields.map((field,i)=><React.Fragment key={i}><th scope="col" className="table-padding">{field.name}</th></React.Fragment>)}
				</tr>
			  </thead>
			  <tbody>
					{data.map((dat)=><tr key={dat.id}>
					<td><XSquareFill className="webicon" onClick={()=>{axios.delete(BACKEND_URL+p.path,{data:{id:dat.id}}).then(()=>{setUpdate(true)}).catch((err)=>{alert(err.response.data)})}}/></td>{fields.map((col,i)=><td key={dat.id+"_"+i} className="table-padding table">
						<InputBox data={dependencies[col.name]} callback={(value)=>{
						return axios.patch(BACKEND_URL+p.path,{
							[col.name]:value,
							id:dat.id
						})
						}} value={String(dat[col.name])}/></td>)}</tr>)}
						{<tr><td></td>{fields.map((col,i)=><td key={i}>{<input id={"submitField"+i} onBlur={(i===fields.length-1)?(f)=>{setSubmitVal({field:col.name,value:f.currentTarget.value});SubmitBoxes();document.getElementById("submitField0").focus()}:(f)=>{setSubmitVal({field:col.name,value:f.currentTarget.value})}}/>}</td>)}</tr>}
			  </tbody>
			</table>
		</div>:<img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/>}
	</>
}

function AdminPanel(p) {
	return <div id="main" style={{background:"white"}}>
	  <div className="w-25"><Box title="Navigation">
		  <Table classes="st">
		  <Link to={process.env.PUBLIC_URL+"/admin/class"}>Class</Link><br/>
		  <Link to={process.env.PUBLIC_URL+"/admin/classdata"}>Class Data</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/classweaponcompatibility"}>Class-Weapon Compatibility</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/weapons"}>Weapons</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/weaponexistencedata"}>Weapon Existence Data</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/weapontypes"}>Weapon Types</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/classweaponcompatibility"}>Class-Weapon Compatibility</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/armor"}>Armor</Link><br/>
		  <Link to={process.env.PUBLIC_URL+"/admin/potentials"}>Potentials</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/potentialdata"}>Potential Data</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/builds"}>Builds</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/skills"}>Skills</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/skilltypes"}>Skill Types</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/skilldata"}>Skill Data</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/augments"}>Augments</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/augmenttypes"}>Augment Types</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/food"}>Food</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/foodmultipliers"}>Food Multipliers</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/roles"}>Roles</Link><br/>
		<hr/>
		<Link to={process.env.PUBLIC_URL+"/admin/users"}>Users</Link><br/></Table></Box></div>
		<div className="w-75" style={{background:"rgba(20,29,40,0.66)"}}>
			<Route path={process.env.PUBLIC_URL+"/admin/class"}>
				<TableEditor path="/class"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/classdata"}>
				<TableEditor path="/class_level_data"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/classweaponcompatibility"}>
				<TableEditor path="/class_weapon_type_data"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/weapons"}>
				<TableEditor path="/weapon"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/weaponexistencedata"}>
				<TableEditor path="/weapon_existence_data"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/weapontypes"}>
				<TableEditor path="/weapon_type"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/armor"}>
				<TableEditor path="/armor"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/potentials"}>
				<TableEditor path="/potential"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/potentialdata"}>
				<TableEditor path="/potential_data"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/builds"}>
				<TableEditor path="/builds"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/skills"}>
				<TableEditor path="/skill"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/skilltypes"}>
				<TableEditor path="/skill_type"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/skilldata"}>
				<TableEditor path="/skill_data"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/augments"}>
				<TableEditor path="/augment"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/augmenttypes"}>
				<TableEditor path="/augment_type"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/food"}>
				<TableEditor path="/food"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/foodmultipliers"}>
				<TableEditor path="/food_mult"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/roles"}>
				<TableEditor path="/roles"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/users"}>
				<TableEditor path="/users"/>
			</Route>
		</div>
		</div>
}

function App() {
	
	const [author,setAuthor] = useState("Dudley")
	const [buildName,setBuildName] = useState("Fatimah")
	const [className,setClassName] = useState("RANGER")
	const [secondaryClassName,setSecondaryClassName] = useState("FORCE")
	
	const [bp,setBP] = useState(1344)
	const [hp,setHP] = useState(289)
	const [pp,setPP] = useState(100)
	const [def,setDef] = useState(402)
	const [weaponUp1,setWeaponUp1] = useState(0.34)
	const [weaponUp2,setWeaponUp2] = useState(0.34)
	const [weaponUp3,setWeaponUp3] = useState(0.34)
	const [damageResist,setDamageResist] = useState(0.18)
	
	const [effectList,setEffectList] = useState([
		"Food Boost Effect",
		"Shifta / Deband",
		"Region Mag Boost"
	])
	
	const [weapon,setWeapon] = useState("Ophistia Shooter")
	const [armorSlot1,setArmorSlot1] = useState("Klauzdyne")
	const [armorSlot2,setArmorSlot2] = useState("Klauznum")
	const [armorSlot3,setArmorSlot3] = useState("Klauzment")
	const [weaponEnhancementLv,setWeaponEnhancementLv] = useState(35)
	const [armorSlot1EnhancementLv,setArmorSlot1EnhancementLv] = useState(10)
	const [armorSlot2EnhancementLv,setArmorSlot2EnhancementLv] = useState(10)
	const [armorSlot3EnhancementLv,setArmorSlot3EnhancementLv] = useState(10)
	
	const [weaponAbilityList,setWeaponAbilityList] = useState([		
		"Wellspring Unit Lv.3",
		"Fixa Fatale Lv.5",
		"Legaro S Attack II",
		"Legaro S Efficiet",
		"Legaro S Efficiet",
		"Legaro Souls 2",
		"Legaro Reverij",
		"Legaro Factalz",
		"Legaro Crakus",
		"Legaro Attack Vaz III",
	])
	const [armor1AbilityList,setArmor1AbilityList] = useState([])
	const [armor2AbilityList,setArmor2AbilityList] = useState([])
	const [armor3AbilityList,setArmor3AbilityList] = useState([])
	
	const [criticalHitRate,setCriticalHitRate] = useState(0.05)
	const [criticalMultiplier,setCriticalMultiplier] = useState(1.2)
	const [midRange,setMidRange] = useState(126)
	const [critical,setCritical] = useState(152)
	const [effective,setEffective] = useState(127)

	const [modalOpen,setModalOpen] = useState(true)
	
  return (
  <>
	<HashRouter>
		<Switch>
			<Route path={process.env.PUBLIC_URL+"/test"}>
			  <AdminPanel/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin"}>
			  <AdminPanel/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/test"}>
			<TestHeader/>
			<div id="main"><TestPanel/></div>
			</Route>
			<Route path="/">
			  <div id="main">
				   <Col>
						<MainBox author={author} setAuthor={setAuthor} buildName={buildName} setBuildName={setBuildName} className={className} setClassName={setClassName} secondaryClassName={secondaryClassName} setSecondaryClassName={setSecondaryClassName}/>
						<EffectsBox effectList={effectList} setEffectList={setEffectList}/>
					</Col>
					<Col>
						<EquipBox weapon={weapon} setWeapon={setWeapon} armorSlot1={armorSlot1} setArmorSlot1={setArmorSlot1} armorSlot2={armorSlot2} setArmorSlot2={setArmorSlot2} armorSlot3={armorSlot3} setArmorSlot3={setArmorSlot3} weaponEnhancementLv={weaponEnhancementLv} setWeaponEnhancementLv={setWeaponEnhancementLv} armorSlot1EnhancementLv={armorSlot1EnhancementLv} setArmorSlot1EnhancementLv={setArmorSlot1EnhancementLv} armorSlot2EnhancementLv={armorSlot2EnhancementLv} setArmorSlot2EnhancementLv={setArmorSlot2EnhancementLv} armorSlot3EnhancementLv={armorSlot3EnhancementLv} setArmorSlot3EnhancementLv={setArmorSlot3EnhancementLv}/>
						<EquippedWeaponBox weapon={weapon} armorSlot1={armorSlot1} armorSlot2={armorSlot2} armorSlot3={armorSlot3} weaponAbilityList={weaponAbilityList} setWeaponAbilityList={setWeaponAbilityList} armor1AbilityList={armor1AbilityList} setArmor1AbilityList={setArmor1AbilityList} armor2AbilityList={armor2AbilityList} setArmor2AbilityList={setArmor2AbilityList} armor3AbilityList={armor3AbilityList} setArmor3AbilityList={setArmor3AbilityList} weaponEnhancementLv={weaponEnhancementLv}armorSlot1EnhancementLv={armorSlot1EnhancementLv}armorSlot2EnhancementLv={armorSlot2EnhancementLv}armorSlot3EnhancementLv={armorSlot3EnhancementLv}/>
					</Col>
					<Col>
						
						<StatsBox bp={bp} setBP={setBP} hp={hp} setHP={setHP} pp={pp} setPP={setPP} def={def} setDef={setDef} weaponUp1={weaponUp1} setWeaponUp1={setWeaponUp1} weaponUp2={weaponUp2} setWeaponUp2={setWeaponUp2} weaponUp3={weaponUp3} setWeaponUp3={setWeaponUp3} damageResist={damageResist} setDamageResist={setDamageResist}/>
						<DamageBox criticalHitRate={criticalHitRate} setCriticalHitRate={setCriticalHitRate} criticalMultiplier={criticalMultiplier} setCriticalMultiplier={setCriticalMultiplier} midRange={midRange} setMidRange={setMidRange} critical={critical} setCritical={setCritical} effective={effective} setEffective={setEffective}/>
					</Col>
					<PopupWindow modalOpen={modalOpen} setModalOpen={setModalOpen} showCloseButton={false} title="Modal Title">Modal content goes here.{BACKEND_URL}</PopupWindow>
				</div>
			</Route>
		</Switch>
	</HashRouter>
	</>
  );
}

export default App;
