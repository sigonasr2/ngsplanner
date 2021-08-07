//import './App.css'; Old CSS
import './reset.css'; // Generic reset
import './style.css'; // The new new
import React, {useState,useEffect,useRef,useReducer} from 'react';
import useGlobalKeyDown from 'react-global-key-down-hook'
import Modal from 'react-modal'
import Toggle from 'react-toggle' //Tooltip props: http://aaronshaf.github.io/react-toggle/

import {XSquare, XSquareFill, PlusCircle, LifePreserver, Server, CloudUploadFill} from 'react-bootstrap-icons'

import {
  HashRouter,
  Switch,
  Route
} from "react-router-dom";

import { HashLink as Link } from 'react-router-hash-link';

import TestHeader from './TestHeader'; // Test Header!
import TestPanel from './TestPanel'; // Dudley's Test Panel

const axios = require('axios');
const parse = require('csv-parse/lib/sync')

Function.prototype.toJSON = function() { return "Unstorable function" }

/*
Damage types
const MELEE_DMG = 0
const RANGE_DMG = 1
const TECH_DMG = 2

Art properties
const NORMAL = 0
const PHOTON_ART = 1
const WEAPON_ACTION = 2
const STEP_COUNTER = 3
const PARRY_COUNTER = 4
//NOT USED YET*/

const BACKENDURL=process.env.REACT_APP_GITPOD_WORKSPACE_URL||process.env.REACT_APP_BACKENDURL||'https://projectdivar.com:4504'

function GetBackendURL(p) {
	return (BACKENDURL)+(p.TESTMODE?"/test":"")
}

function Col(p) {
	return <div className="con">
		{p.children}
	</div>
}

function Box(p) {
	return <>
		<div className="box">
		<div className="boxTitleBar">
		<h1>{p.title}</h1>
		</div>
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
	Hunter:{
		name:"Hunter",
		icon:process.env.PUBLIC_URL+"/icons/UINGSClassHu.png"
	},
	Fighter:{
		name:"Fighter",
		icon:process.env.PUBLIC_URL+"/icons/UINGSClassFi.png"
	},
	Ranger:{
		name:"Ranger",
		icon:process.env.PUBLIC_URL+"/icons/UINGSClassRa.png"
	},
	Gunner:{
		name:"Gunner",
		icon:process.env.PUBLIC_URL+"/icons/UINGSClassGu.png"
	},
	Force:{
		name:"Force",
		icon:process.env.PUBLIC_URL+"/icons/UINGSClassFo.png"
	},
	Techter:{
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
	return <p className={p.classes}>

			{p.children}

	</p>
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
		<h1>{p.title}{p.showCloseButton&&<XSquare onClick={()=>{p.setModalOpen(false)}} className="modalCloseButton"/>}</h1>
		{p.children}
	</Modal>
}

function InputBox(p) {
	const [value,setValue] = useState(p.value)
	const [failed,setFailed] = useState(false)
	const [sending,setSending] = useState(false)

	function changeFunc(f){setValue(f.currentTarget.value)
		if (p.callback4) {
			p.callback4(f.currentTarget.value)
		}}
	function blurFunc(f){
		if (p.callback) {
			setSending(true)
			setFailed(false)
			p.callback(f.currentTarget.value)
			.then(()=>{setFailed(false)})
			.catch(()=>{setFailed(true)})
			.then(()=>{setSending(false)})}
		else 
		if (p.callback3) {
			p.callback3(f.currentTarget.value)
		}}
	function keydownFunc(f){
		if (p.callback2) {
			p.callback2(f,value)
		}
	}

	return p.data?<select disabled={p.lockSubmission} className={failed?"failedInput":sending?"submitting":""} value={value} onKeyDown={(f)=>{keydownFunc(f)}} onChange={(f)=>{changeFunc(f)}} onBlur={(f)=>{blurFunc(f)}}>
		{p.includeBlankValue&&<option/>}
		{p.data.map((item)=><option value={item.id}>{item.id} - {item.name||item.username}</option>)}
	</select>:<input disabled={p.lockSubmission} className={failed?"failedInput":sending?"submitting":""} value={value} onKeyDown={(f)=>{keydownFunc(f)}} onChange={(f)=>{changeFunc(f)}} onBlur={(f)=>{blurFunc(f)}}/>
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
	const [importAllowed,setImportAllowed] = useState(false)
	const [fileData,setFileData] = useState(undefined)
	const [lockSubmission,setLockSubmission] = useState(false)
	
	function SubmitBoxes() {
		if (!lockSubmission) {
			setLockSubmission(true)
			axios.post(p.BACKENDURL+p.path,submitVals)
			.then(()=>{
				setSubmitVal("Clear")
				setUpdate(true)
			})
			.catch((err)=>{
				alert(JSON.stringify(err.response.data))
			})
			.then(()=>{
				setLockSubmission(false)
			})
		}
	}

	useGlobalKeyDown(()=>{
		SubmitBoxes()
	},['Enter'])
	
	useEffect(()=>{
		setUpdate(true)
	},[p.path])

	useEffect(()=>{
		var promises=[]
		parse(fileData,{columns:true,skip_empty_lines:true}).forEach((entry)=>{
			promises.push(axios.post(p.BACKENDURL+p.path,entry))
		})
		Promise.allSettled(promises)
		.then(()=>{
			setUpdate(true)
		})
	},[fileData,p.path,p.BACKENDURL])

	useEffect(()=>{
		for (var col of fields) {
			if (col.name==="name") {
				setImportAllowed(true)
				break;
			}
		}
	},[fields])
	
	useEffect(()=>{
		if (update) {
			setLoading(true)
			var dependency_map = {}
			axios.get(p.BACKENDURL+p.path)
			.then((data)=>{
				var cols = data.data.fields
				var rows = data.data.rows
				
				setFields(cols.filter((col,i)=>col.name!=="id"&&!(i===0&&col.name==="name")))

				var promise_list = []

				cols.filter((col)=>col.name!=="id"&&col.name.includes("_id")).forEach((col)=>{
					promise_list.push(axios.get(p.BACKENDURL+"/"+col.name.replace("_id",""))
					.then((data)=>{
						dependency_map[col.name]=data.data.rows.sort((a,b)=>b.id-a.id)
					}))
				})
				setData(rows)
				return Promise.allSettled(promise_list)
			})
			.then(()=>{
				setDependencies(dependency_map)
				setLoading(false)
			})
			setUpdate(false)
		}
	},[update,p.path,p.BACKENDURL])
	
	return <>
	{!loading?
		<div className="table-responsive">
			<table cellPadding="10" className="table text-light table-padding">
			  {importAllowed&&<caption><label className="buttonLabel" for="uploads">Import CSV</label><input onChange={(f)=>{
				const reader = new FileReader()
				reader.onload=(ev)=>{
					setFileData(ev.target.result)
				}
				reader.readAsText(f.target.files[0])
			  }} style={{opacity:0}} id="uploads" type="file" accept=".txt,.csv"/></caption>}
			  <thead>
				<tr>
					<th className="table-padding"></th>
					{fields.map((field,i)=><React.Fragment key={i}><th scope="col" className="table-padding">{field.name}</th></React.Fragment>)}
				</tr>
			  </thead>
			  <tbody>
						{<tr><td></td>{fields.map((col,i)=><td key={i}>{<InputBox includeBlankValue={true} data={dependencies[col.name]} callback4={
							(f)=>{setSubmitVal({field:col.name,value:f});}}/>}</td>)}<input style={{position:'absolute',top:"-1000px"}}/><PlusCircle onClick={()=>{SubmitBoxes()}} className="submitbutton"/></tr>}
					{data.map((dat)=><tr key={dat.id}>
					<td><XSquareFill className="webicon" onClick={()=>{axios.delete(p.BACKENDURL+p.path,{data:{id:dat.id}}).then(()=>{setUpdate(true)}).catch((err)=>{alert(err.response.data)})}}/></td>{fields.map((col,i)=><td key={dat.id+"_"+i} className="table-padding table">
						<InputBox lockSubmission={lockSubmission} data={dependencies[col.name]} callback={(value)=>{
						return axios.patch(p.BACKENDURL+p.path,{
							[col.name]:value,
							id:dat.id
						})
						}} value={String(dat[col.name])}/></td>)}</tr>)}
			  </tbody>
			</table>
		</div>:<img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/>}
	</>
}

function DatabaseEditor(p) {
	const [loading,setLoading] = useState(true)
	const [message,setMessage] = useState(<span style={{color:"black"}}></span>)
	const [databases,setDatabases] = useState([])
	const [update,setUpdate] = useState(true)

	useEffect(()=>{
		if (update) {
			axios.get(p.BACKENDURL+"/databases")
			.then((data)=>{
				setDatabases(data.data)
			})
			.catch((err)=>{
				console.log(err.message)
			})
			.then(()=>{
				setLoading(false)
			})
			setUpdate(false)
		}
	},[update])

	return <>
		{!loading?<>
				<button className="basichover" style={{backgroundColor:"navy"}} onClick={()=>{
					setLoading(true)
					setMessage(<span style={{color:"black"}}>Uploading Test Database to Production...</span>)
					axios.post(p.BACKENDURL+"/databases/testtolive")
					.then(()=>{
						setMessage(<span style={{color:"green"}}>Success! Test Database is now live!</span>)
					})
					.catch((err)=>{
						setMessage(<span style={{color:"red"}}>{err.message}</span>)
					})
					.then(()=>{
						setLoading(false)
					})
				}}>Apply TEST Database to LIVE Database</button><br/><br/>
				<button className="basichover" style={{backgroundColor:"maroon"}}  onClick={()=>{
					setLoading(true)
					setMessage(<span style={{color:"black"}}>Restoring Test Database using Live Database...</span>)
					axios.post(p.BACKENDURL+"/databases/livetotest")
					.then(()=>{
						setMessage(<span style={{color:"green"}}>Success! Live Database has been applied to the Test Database!</span>)
					})
					.catch((err)=>{
						setMessage(<span style={{color:"red"}}>{err.message}</span>)
					})
					.then(()=>{
						setLoading(false)
					})
				}}>Reset TEST database using current LIVE Database</button><br/><br/>
				<button className="basichover" style={{backgroundColor:"darkgreen"}}  onClick={()=>{
					setLoading(true)
					setMessage(<span style={{color:"black"}}>Backing up the Live database...</span>)
					axios.post(p.BACKENDURL+"/databases/backup")
					.then(()=>{
						setMessage(<span style={{color:"green"}}>Success! Live Database has been saved!</span>)
					})
					.catch((err)=>{
						setMessage(<span style={{color:"red"}}>{err.message}</span>)
					})
					.then(()=>{
						setUpdate(true)
					})}}>Backup current LIVE Database</button><br/><br/>
			</>:<img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/>
		}
		{message}
		<hr/>
		<br/><br/>
		<h2><u>Current Databases</u></h2>
		<br/><br/>
		<span style={{fontSize:"24px",top:"-16px",position:"relative",height:"64px",lineHeight:"64px",textAlign:"center"}}><LifePreserver className="databaseIcon" style={{color:"green"}}/>Live Database</span>
		&nbsp;&nbsp;&nbsp;<span style={{fontSize:"24px",top:"-16px",position:"relative",height:"64px",lineHeight:"64px",textAlign:"center"}}><LifePreserver className="databaseIcon" style={{color:"red"}}/>Test Database</span><br/>
		{databases.map((db)=>{
			var label = ""
			if (db.datname!=="ngsplanner"&&db.datname!=="ngsplanner2") {
				var dateStr = db.datname.replace("ngsplanner","")
				var date = new Date(dateStr.slice(0,4),dateStr.slice(4,6),dateStr.slice(6,8),dateStr.slice(8,10),dateStr.slice(10,12),dateStr.slice(12,14))
				label=<><Server className="databaseIcon" style={{color:"blue"}}/>{"Backup from "+date}</>
				return <><span style={{fontSize:"24px",top:"-16px",position:"relative",height:"64px",lineHeight:"64px",textAlign:"center"}}>{label}<button style={{background:"blue"}}
				onClick={()=>{
					setLoading(true)
					axios.post(p.BACKENDURL+"/databases/restorefrombackup",{
						database:db.datname
					})
					.then((data)=>{
						setMessage(<span style={{color:"green"}}>{"Success! Database has been set to the state from "+date}</span>)
					})
					.catch((err)=>{
						setMessage(<span style={{color:"red"}}>{err.message}</span>)
					})
					.then(()=>{
						setLoading(false)
					})
				}}><CloudUploadFill/> Restore</button></span><br/></>
			}
		})}
	</>
}

function AdminPanel(p) {
	return <div className="main">
	  <div className="w-25"><Box title="Navigation">
		  <Table classes="adminNav">
		  <Link to={process.env.PUBLIC_URL+"/admin/class"}>Class</Link><br/>
		  <Link to={process.env.PUBLIC_URL+"/admin/classdata"}>Class Data</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/classweaponcompatibility"}>Class-Weapon Compatibility</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/classskills"}>Class Skills</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/classskilldata"}>Class Skill Data</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/weapons"}>Weapons</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/weaponexistencedata"}>Weapon Existence Data</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/weapontypes"}>Weapon Types</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/classweaponcompatibility"}>Class-Weapon Compatibility</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/photonarts"}>Photon Arts</Link><br/>
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
		<Link to={process.env.PUBLIC_URL+"/admin/photonarts"}>Photon Arts</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/classskills"}>Class Skills</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/classskilldata"}>Class Skill Data</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/augments"}>Augments</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/augmenttypes"}>Augment Types</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/enemydata"}>Enemy Data</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/food"}>Food</Link><br/>
		<Link to={process.env.PUBLIC_URL+"/admin/foodmultipliers"}>Food Multipliers</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/roles"}>Roles</Link><br/>
		  <Link to={process.env.PUBLIC_URL+"/admin/users"}>Users</Link><br/>
		<hr/>
		  <Link to={process.env.PUBLIC_URL+"/admin/database_audit"}>Database Audit</Link><br/>
		  <Link to={process.env.PUBLIC_URL+"/admin/database_manager"}>Database Manager</Link><br/>
		</Table></Box></div>
		<div className="w-75">
			<Route path={process.env.PUBLIC_URL+"/admin/class"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/class"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/classdata"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/class_level_data"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/classweaponcompatibility"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/class_weapon_type_data"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/photonarts"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/photon_art"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/weapons"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/weapon"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/weaponexistencedata"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/weapon_existence_data"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/weapontypes"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/weapon_type"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/armor"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/armor"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/potentials"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/potential"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/potentialdata"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/potential_data"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/builds"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/builds"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/skills"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/skill"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/skilltypes"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/skill_type"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/skilldata"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/skill_data"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/classskills"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/class_skill"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/classskilldata"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/class_skill_data"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/augments"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/augment"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/augmenttypes"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/augment_type"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/enemydata"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/enemy_data"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/food"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/food"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/foodmultipliers"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/food_mult"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/roles"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/roles"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/users"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/users"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/database_audit"}>
				<TableEditor BACKENDURL={GetBackendURL(p)} path="/database_audit"/>
			</Route>
			<Route path={process.env.PUBLIC_URL+"/admin/database_manager"}>
				<DatabaseEditor BACKENDURL={GetBackendURL(p)}/>
			</Route>
		</div>
		</div>
}

function EditStatBox(p) {

	const [value,setValue] = useState(p.value)

	useEffect(()=>{
		setValue(p.value)
	},[p.value])

	return <><input value={value} onChange={(f)=>{setValue(f.currentTarget.value);p.callback(f.currentTarget.value)}}/> ({value})<br/></>
}

function DamageCalculator(p) {

	const [augmentData,setAugmentData] = useState({})
	//const [update,setUpdate] = useState(false)

	useEffect(()=>{
		axios.get(p.BACKENDURL+"/augment")
		.then((data)=>{
			var augmentData = {}
			data.data.rows.forEach((entry)=>{augmentData[entry.name]=entry})
			setAugmentData(augmentData)
		})
	},[p.BACKENDURL])

	const character = {
		weapon:{
			augments:["1","2"]
		},
		armor1:{
			augments:["2"]
		},
		armor2:{
			augments:[]
		},
		armor3:{
			augments:[]
		}
	}

	useEffect(()=>{
		if (Object.keys(augmentData).length>0) {
			var searchFields = [{field:"variance",variable:0},{field:"mel_dmg",variable:0}]
			for (var equip of [character.weapon,character.armor1,character.armor2,character.armor3]) {
				for (var field of searchFields) {
					for (var i=0;i<equip.augments.length;i++) {
						var variance = augmentData[equip.augments[i]][field.field]
						field.variable+=variance
					}
				}
			}
			setAugDmgVariance(searchFields[0].variable)
		}
	},[augmentData,character.armor1,character.armor2,character.armor3,character.weapon])

	const [rawDmg,setRawDmg] = useState(0)
	
	const [weaponTotalAtk,setWeaponTotalAtk] = useState(100)
	
		const [weaponBaseAtk,setWeaponBaseAtk] = useState(1)
		const [weaponEnhanceLv,setweaponEnhanceLv] = useState(1)

	useEffect(()=>{
		setWeaponTotalAtk(Number(weaponBaseAtk)+Number(weaponEnhanceLv))
	},[weaponBaseAtk,weaponEnhanceLv])

	const [dmgVariance,setDmgVariance] = useState(1)

		const [weaponDmgVariance,setWeaponDmgVariance] = useState(1)
		const [augDmgVariance,setAugDmgVariance] = useState(1)

	useEffect(()=>{
		setDmgVariance(Number(weaponDmgVariance)+Number(augDmgVariance))
	},[weaponDmgVariance,augDmgVariance])

	const [baseAtk,setBaseAtk] = useState(100)
	const [enemyDef,setEnemyDef] = useState(5)
	const [multipliers,setMultipliers] = useState(1)

	useEffect(()=>{
		setRawDmg(((Number(weaponTotalAtk)*Number(dmgVariance))+Number(baseAtk)-Number(enemyDef))*Number(multipliers)/5)
	},[weaponTotalAtk,dmgVariance,baseAtk,enemyDef,multipliers])
	
	const [atkmult,setAtkMult] = useState(1);
	const [partmult,setPartMult] = useState(1);
	const [elementalWeaknessMult,setElementalWeaknessMult] = useState(1.2)
	const [mainClassWeaponBoost,setMainClassWeaponBoost] = useState(1.1)
	const [classSkillMult,setClassSkillMult] = useState(1)
	const [equipMult,setEquipMult] = useState(1)

	const [augmentEquipMult,setAugmentEquipMult] = useState(1)
	const [potencyFloorEquipMult,setPotencyFloorEquipMult] = useState(1)
	const [elementalWeaponEquipMult,setElementalWeaponEquipMult] = useState(1.1)
	
	const [critMult,setCritMult] = useState(1.2)
	const [appropriateDistance,setAppropriateDistance] = useState(1)
	
	const [foodBoost,setFoodBoost] = useState(1)
	const [fieldEffects,setFieldEffects] = useState(1.05)
	const [statusAilments,setStatusAilments] = useState(1)

	const [enemyCorrectionMult,setEnemyCorrectionMult] = useState(1)

	const [highLevelEnemy,setHighLevelEnemy] = useState(1)

	useEffect(()=>{
		setMultipliers(Number(atkmult)*Number(partmult)*Number(elementalWeaknessMult)*Number(mainClassWeaponBoost)*Number(classSkillMult)*Number(equipMult)*Number(augmentEquipMult)*Number(potencyFloorEquipMult)*Number(elementalWeaponEquipMult)*Number(critMult)*Number(appropriateDistance)*Number(foodBoost)*Number(fieldEffects)*Number(statusAilments)*Number(enemyCorrectionMult)*Number(highLevelEnemy))
	},[atkmult,partmult,elementalWeaknessMult,mainClassWeaponBoost,classSkillMult,equipMult,augmentEquipMult,potencyFloorEquipMult,elementalWeaponEquipMult,critMult,appropriateDistance,foodBoost,fieldEffects,statusAilments,enemyCorrectionMult,highLevelEnemy])

	return <>
		<div style={{background:"rgba(200,255,200,1)"}}>
			Weapon Total Atk:<EditStatBox value={weaponTotalAtk} callback={(val)=>{setWeaponTotalAtk(val)}}/>
			<ul>
				<li>●Weapon Base Atk:<EditStatBox value={weaponBaseAtk} callback={(val)=>{setWeaponBaseAtk(val)}}/></li>
				<li>●Weapon Enhance Lv:<EditStatBox value={weaponEnhanceLv} callback={(val)=>{setweaponEnhanceLv(val)}}/></li>
			</ul>
			<br/><br/><br/>
			Damage Variance:<EditStatBox value={dmgVariance} callback={(val)=>{setDmgVariance(val)}}/>
			<ul>
				<li>●Weapon Damage Variance:<EditStatBox value={weaponDmgVariance} callback={(val)=>{setWeaponDmgVariance(val)}}/></li>
				<li>●Augment Damage Variance:<EditStatBox value={augDmgVariance} callback={(val)=>{setAugDmgVariance(val)}}/></li>
			</ul>
			<br/><br/><br/>
			Base Attack:<EditStatBox value={baseAtk} callback={(val)=>{setBaseAtk(val)}}/>
			Enemy Defense:<EditStatBox value={enemyDef} callback={(val)=>{setEnemyDef(val)}}/>
			Multipliers:<EditStatBox value={multipliers} callback={(val)=>{setMultipliers(val)}}/>
			<ul>
				<li>●Atk Mult:<EditStatBox value={atkmult} callback={(val)=>{setAtkMult(val)}}/></li>
				<li>●Part Mult:<EditStatBox value={partmult} callback={(val)=>{setPartMult(val)}}/></li>
				<li>●Elemental Weakness Mult:<EditStatBox value={elementalWeaknessMult} callback={(val)=>{setElementalWeaknessMult(val)}}/></li>
				<li>●Main Class Weapon Boost:<EditStatBox value={mainClassWeaponBoost} callback={(val)=>{setMainClassWeaponBoost(val)}}/></li>
				<li>●Class Skill Mult:<EditStatBox value={classSkillMult} callback={(val)=>{setClassSkillMult(val)}}/></li>
				<li>●Equip Mult:<EditStatBox value={equipMult} callback={(val)=>{setEquipMult(val)}}/></li>
				<li>
					<ul>
						<li>●Augment Equip Mult:<EditStatBox value={augmentEquipMult} callback={(val)=>{setAugmentEquipMult(val)}}/></li>
						<li>●Potency Floor Equip Mult:<EditStatBox value={potencyFloorEquipMult} callback={(val)=>{setPotencyFloorEquipMult(val)}}/></li>
						<li>●Elemental Weapon Equip Mult:<EditStatBox value={elementalWeaponEquipMult} callback={(val)=>{setElementalWeaponEquipMult(val)}}/></li>
					</ul>
				</li>
				<li>●Crit Mult:<EditStatBox value={critMult} callback={(val)=>{setCritMult(val)}}/></li>
				<li>●Appropriate Distance:<EditStatBox value={appropriateDistance} callback={(val)=>{setAppropriateDistance(val)}}/></li>
				<li>●Food Boost:<EditStatBox value={foodBoost} callback={(val)=>{setFoodBoost(val)}}/></li>
				<li>●Field Effects:<EditStatBox value={fieldEffects} callback={(val)=>{setFieldEffects(val)}}/></li>
				<li>●Status Ailments:<EditStatBox value={statusAilments} callback={(val)=>{setStatusAilments(val)}}/></li>
				<li>●Enemy Correction Multiplier:<EditStatBox value={enemyCorrectionMult} callback={(val)=>{setEnemyCorrectionMult(val)}}/></li>
				<li>●High Level Enemy:<EditStatBox value={highLevelEnemy} callback={(val)=>{setHighLevelEnemy(val)}}/></li>
			</ul>
			<br/><br/><br/>
			Raw Dmg:{rawDmg}
		</div>
	</>
}



function App() {
	
	const [author,setAuthor] = useState("Dudley")
	const [buildName,setBuildName] = useState("Fatimah")
	const [className,setClassName] = useState("Ranger")
	const [secondaryClassName,setSecondaryClassName] = useState("Force")
	const [classLv,setClassLv] = useState(20)
	const [secondaryClassLv,setSecondaryClassLv] = useState(15)
		
	
	const [bp,setBP] = useState(1330)
	const [hp,setHP] = useState(388)
	const [pp,setPP] = useState(154)
	const [weaponTotalAtk,setweaponTotalAtk] = useState(282)
	const [baseAtk,setbaseAtk] = useState(650)
	const [statDisplayAtk,setstatDisplayAtk] = useState(282)

	useEffect(()=>{
		setstatDisplayAtk(Number(weaponTotalAtk)+Number(baseAtk))
	},[weaponTotalAtk,baseAtk])

	const [def,setDef] = useState(932)
	const [weaponUp1,setWeaponUp1] = useState(0.317)
	const [weaponUp2,setWeaponUp2] = useState(0.241)
	const [weaponUp3,setWeaponUp3] = useState(0.241)
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

	const [TESTMODE,setTESTMODE] = useState(false)
	const [DATA,setDATA] = useState({GetData:()=>{}})


	function GetData(table,row,col){
		return DATA!==undefined?DATA[table]!==undefined?DATA[table][row]!==undefined?DATA[table][row][col]!==undefined?DATA[table][row][col]:DATA[table][row]:DATA[table]:DATA:"no data"
	}
	

	useEffect(()=>{
		axios.get(GetBackendURL({TESTMODE:TESTMODE})+"/data")
		.then((data)=>{
			setDATA(data.data)
		})
	},[TESTMODE])

  return (
  	<>
		<HashRouter>
			<Switch>
				<Route path={process.env.PUBLIC_URL+"/admin"}>
				<TestHeader/>
					<AdminPanel BACKENDURL={BACKENDURL} TESTMODE={TESTMODE} DATA={GetData}/>
				</Route>
				<Route path={process.env.PUBLIC_URL+"/test"}>
					<TestHeader/>
					<TestPanel
					author={author} 
					buildName={buildName} 
					className={className} 
					secondaryClassName={secondaryClassName}
					classLv={classLv} 
					secondaryClassLv={secondaryClassLv} 
					bp={bp} 
					hp={hp} 
					pp={pp} 
					def={def} 
					weaponUp1={weaponUp1} 
					weaponUp2={weaponUp2} 
					weaponUp3={weaponUp3} 
					damageResist={damageResist} 
					statDisplayAtk={statDisplayAtk} 
					GetData={GetData}
					/>
				</Route>
				<Route path={process.env.PUBLIC_URL+"/formula"}>
					<DamageCalculator/>
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
						<PopupWindow modalOpen={modalOpen} setModalOpen={setModalOpen} showCloseButton={true} title="Modal Title">Modal content goes here.{BACKENDURL}
						<br/><br/>
						<Toggle className="testmode" defaultChecked={TESTMODE} value={TESTMODE} onChange={(t)=>{setTESTMODE(t.target.checked)}}/>Test Mode: {JSON.stringify(TESTMODE)}
						<br/><br/>{"Fighter Icon URL: "+GetData("class","Fighter","icon")}
						<br/><br/>Gunner Level Stats:{
						[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
						.map((numb)=>{
							var data=GetData("class_level_data","Gunner Lv."+numb);
							return <><br/>{"Lv."+data.level+": "+data.hp+","+data.atk+","+data.def}</>
						})}
						</PopupWindow>
					</div>
				</Route>
			</Switch>
		</HashRouter>
	</>
  );
}

export default App;
