import './reset.css'; // Generic reset
import './style.css'; // The new new
import React, {useState,useEffect,useReducer} from 'react';
import Toggle from 'react-toggle' //Tooltip props: http://aaronshaf.github.io/react-toggle/
import Helmet from 'react-helmet'
import Builds from './Builds';

import {TrashFill, PlusCircle, LifePreserver, Server, CloudUploadFill} from 'react-bootstrap-icons'

import { SkillTreeEditor } from './skilltree/skillTreeEditor'

import { GoogleLogin } from 'react-google-login';

import {
  HashRouter,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";

import { HashLink as Link } from 'react-router-hash-link';

import TestHeader from './TestHeader'; // Test Header!
import TestPanel from './TestPanel'; // Dudley's Test Panel
import md5 from 'md5';


const cookies = require('cookie-handler');
const axios = require('axios');
const parse = require('csv-parse/lib/sync')

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
const APP_TITLE = "NGS Planner"

function GetBackendURL(p) {
	return (BACKENDURL)+(p.TESTMODE?"/test":"")
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

function Table(p) {
	return <span className={p.classes}>

			{p.children}

	</span>
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
		{p.data.map((item)=><option key={item.id} value={item.id}>{item.id} - {item.name||item.username}</option>)}
	</select>:<input disabled={p.lockSubmission} className={failed?"failedInput":sending?"submitting":""} value={value} onKeyDown={(f)=>{keydownFunc(f)}} onChange={(f)=>{changeFunc(f)}} onBlur={(f)=>{blurFunc(f)}}/>
}

function TableEditor(p) {
	
	const initialVals={}

	const { TESTMODE } = p
	
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
	const [lockSubmission,setLockSubmission] = useState(false)

	function patchValue(value,p,col,dat) {
		return axios.patch(p.BACKENDURL+p.path,{
			[col.name]:value==="null"?null:value,
			id:dat.id,
			pass:p.password
		})
	}
	
	function SubmitBoxes() {
		if (!lockSubmission) {
			setLockSubmission(true)
			axios.post(p.BACKENDURL+p.path,{...submitVals,pass:p.password})
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

	function SubmitDeletion() {
		if (!lockSubmission) {
			setLockSubmission(true)
			var promises = []
			for (var dat of data) {
				if (document.getElementById("delete_"+dat.id).checked) {
					promises.push(axios.delete(p.BACKENDURL+p.path,{data:{pass:p.password,id:dat.id}}))
				}
			}
			Promise.allSettled(promises)
			.catch((err)=>{
				alert(err.message)
			})
			.then((data)=>{
				setLockSubmission(false)
				setUpdate(true)
			})
		}
	}
	
	useEffect(()=>{
		setUpdate(true)
	},[p.path,TESTMODE])

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
			axios.get(p.BACKENDURL+p.path+"?pass="+p.password)
			.then((data)=>{
				var cols = data.data.fields
				var rows = data.data.rows
				
				setFields(cols.filter((col,i)=>col.name!=="id"&&!(i===0&&col.name==="name")))

				var promise_list = []

				cols.filter((col)=>col.name!=="id"&&col.name.includes("_id")).forEach((col)=>{
					promise_list.push(axios.get(p.BACKENDURL+"/"+col.name.replace("_id","")+"?pass="+p.password)
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
	},[update,p.path,p.BACKENDURL,p.password])
	
	return <>
	{!loading?<>			  {importAllowed&&<caption><label className="buttonLabel" htmlFor="uploads">Import CSV</label><input onChange={(f)=>{
				const reader = new FileReader()
				reader.onload=(ev)=>{
					var promises=[]
					parse(ev.target.result,{columns:true,skip_empty_lines:true}).forEach((entry)=>{
						for (var col of fields) {
							if ((col.dataTypeID===23||col.dataTypeID===701||col.dataTypeID===16)&&entry[col.name]==="") {
								entry[col.name]=0
							}
						}
						promises.push(axios.post(p.BACKENDURL+p.path,{...entry,pass:p.password}))
					})
					Promise.allSettled(promises)
					.then(()=>{
						setUpdate(true)
					})
				}
				reader.readAsText(f.target.files[0])
			  }} style={{opacity:0}} id="uploads" type="file" accept=".txt,.csv"/></caption>}
		<div>
			<table>
			  <thead>
				<tr>
					<th className="table-padding"><TrashFill onClick={()=>{SubmitDeletion()}} className="trashButton"/></th>
					{fields.map((field,i)=><React.Fragment key={i}><th scope="col" className="table-padding">{field.name}</th></React.Fragment>)}
				</tr>
			  </thead>
			  <tbody>
						{<tr><td></td>{fields.map((col,i)=><td key={i}>{<InputBox includeBlankValue={true} data={dependencies[col.name]} callback4={
							(f)=>{setSubmitVal({field:col.name,value:f});}}/>}</td>)}<td><input style={{display:"none"}}/><PlusCircle onClick={()=>{SubmitBoxes()}} className="submitbutton"/></td></tr>}
					{data.map((dat)=><tr key={dat.id}>
					<td><input id={"delete_"+dat.id} type="checkbox"/></td>{fields.map((col,i)=><td key={dat.id+"_"+i} className="table-padding table">
						<InputBox lockSubmission={lockSubmission} data={dependencies[col.name]} callback={(value)=>patchValue(value,p,col,dat)} callback2={(f,value)=>{if (f.key==='Enter') {f.currentTarget.blur()} else {return 'Chill'}}} value={String(dat[col.name])}/></td>)}</tr>)}
			  </tbody>
			</table>
		</div></>:<><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/></>}
	</>
}

function DatabaseEditor(p) {
	const [loading,setLoading] = useState(true)
	const [message,setMessage] = useState(<span style={{color:"black"}}></span>)
	const [databases,setDatabases] = useState([])
	const [update,setUpdate] = useState(true)

	useEffect(()=>{
		if (update) {
			axios.get(p.BACKENDURL+"/databases?pass="+p.password)
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
	},[update,p.BACKENDURL,p.password])

	return <>
		{!loading?<>
				<button className="basichover" style={{backgroundColor:"navy"}} onClick={()=>{
					setLoading(true)
					setMessage(<span style={{color:"black"}}>Uploading Test Database to Production...</span>)
					axios.post(p.BACKENDURL+"/databases/testtolive",{pass:p.password})
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
					axios.post(p.BACKENDURL+"/databases/livetotest",{pass:p.password})
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
					axios.post(p.BACKENDURL+"/databases/backup",{pass:p.password})
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
		{databases.map((db,i)=>{
			var label = ""
			if (db.datname!=="ngsplanner"&&db.datname!=="ngsplanner2") {
				var dateStr = db.datname.replace("ngsplanner","")
				var date = new Date(dateStr.slice(0,4),dateStr.slice(4,6),dateStr.slice(6,8),dateStr.slice(8,10),dateStr.slice(10,12),dateStr.slice(12,14))
				label=<><Server className="databaseIcon" style={{color:"blue"}}/>{"Backup from "+date}</>
				return <React.Fragment key={i}><span style={{fontSize:"24px",top:"-16px",position:"relative",height:"64px",lineHeight:"64px",textAlign:"center"}}>{label}<button style={{background:"blue"}}
				onClick={()=>{
					setLoading(true)
					axios.post(p.BACKENDURL+"/databases/restorefrombackup",{
						database:db.datname,
						pass:p.password
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
				}}><CloudUploadFill/> Restore</button></span><br/></React.Fragment>
			} else {
				return <React.Fragment key={i}/>
			}
		})}
	</>
}

function AdminPanel(p) {
	const [verified,setVerified] = useState(false)
	const [password,setPassword] = useState("")

	const navigationData=[
		{page:"Class",url:"/admin/class",table:"/class"},
		{page:"Class Data",url:"/admin/classdata",table:"/class_level_data"},
		{page:"Class-Weapon Compatibility",url:"/admin/classweaponcompatibility",table:"/class_weapon_type_data"},
		{page:"Class Skills",url:"/admin/classskills",table:"/class_skill"},
		{page:"Class Skill Data",url:"/admin/classskilldata",table:"/class_skill_data"},
		{hr:true},
		{page:"Weapons",url:"/admin/weapons",table:"/weapon"},
		{page:"Weapon Existence Data",url:"/admin/weaponexistencedata",table:"/weapon_existence_data"},
		{page:"Weapon Types",url:"/admin/weapontypes",table:"/weapon_type"},
		{page:"Class-Weapon Compatibility",url:"/admin/classweaponcompatibility",table:"/class_weapon_type_data",duplicate:true},
		{page:"Photon Arts",url:"/admin/photonarts",table:"/photon_art"},
		{hr:true},
		{page:"Armor",url:"/admin/armor",table:"/armor"},
		{page:"Potentials",url:"/admin/potentials",table:"/potential"},
		{page:"Potential Data",url:"/admin/potentialdata",table:"/potential_data"},
		{hr:true},
		{page:"Builds",url:"/admin/builds",table:"/builds"},
		{page:"Likes",url:"/admin/likes",table:"/like_data"},
		{hr:true},
		{page:"Skills",url:"/admin/skills",table:"/skill"},
		{page:"Skill Types",url:"/admin/skilltypes",table:"/skill_type"},
		{page:"Skill Data",url:"/admin/skilldata",table:"/skill_data"},
		{page:<span style={{color:"gold"}}>Skill Tree Editor</span>,url:"/admin/skilltreeeditor",render:<SkillTreeEditor setUpdate={p.setUpdate} password={password} BACKENDURL={GetBackendURL(p)} GetData={p.DATA}/>},
		{page:"Skill Tree Data",url:"/admin/skilltreedata",table:"/skill_tree_data"},
		{page:"Photon Arts",url:"/admin/photonarts",table:"/photon_art",duplicate:true},
		{page:"Class Skills",url:"/admin/classskills",table:"/class_skill",duplicate:true},
		{page:"Class Skill Data",url:"/admin/classskilldata",table:"/class_skill_data",duplicate:true},
		{hr:true},
		{page:"Augment Types",url:"/admin/augmenttypes",table:"/augment_type"},
		{page:"Augments",url:"/admin/augments",table:"/augment"},
		{page:"Elements",url:"/admin/elements",table:"/element"},
		{hr:true},
		{page:"Enemy Data",url:"/admin/enemydata",table:"/enemy_data"},
		{hr:true},
		{page:"Food",url:"/admin/food",table:"/food"},
		{page:"Food Multipliers",url:"/admin/foodmultipliers",table:"/food_mult"},
		{hr:true},
		{page:"Roles",url:"/admin/roles",table:"/roles"},
		{page:"Users",url:"/admin/users",table:"/users"},
		{hr:true},
		{page:"Misc. Site Data",url:"/admin/sitedata",table:"/site_data"},
		{page:"Database Audit",url:"/admin/database_audit",table:"/database_audit"},
	]

	return <div className="adminMain">
		{!verified?
						<div className="modalOverlay">
						<div className="modal">
						<div className="box boxAdmin">
						<div className="boxTitleBar"><h1>Admin</h1></div>
						<p></p>
			<input type="password" value={password} onChange={(f)=>{setPassword(f.currentTarget.value)}} onKeyDown={(e)=>{
				if (e.key==="Enter") {
					axios.post(GetBackendURL(p)+"/passwordcheck",{
						pass:password
					})
					.then((data)=>{
						if (data.data.verified) {
							setVerified(data.data.verified)
						}
					})
					.catch((err)=>{
						setVerified(false)
						setPassword("")
					})}}}></input>
						</div>
						</div>
						</div>
:<>
		
		<div className="box boxAdminNav">
		<div className="boxTitleBar">
		<h1>Navigation</h1>
		</div>
		<p>Testing Mode <span><Toggle checked={p.TESTMODE} onChange={(f)=>{p.setTESTMODE(f.target.checked)}}/> {p.TESTMODE?<b>ON</b>:<b>OFF</b>}</span></p>
		<div className="adminNavContainer customScrollbar">
		  <Table classes="adminNav">
		  {navigationData.map((nav,i)=>(nav.hr)?<hr key={i}/>:<React.Fragment key={i}><Link to={process.env.PUBLIC_URL+nav.url}>{nav.page}</Link><br/></React.Fragment>)}
		  <Link to={process.env.PUBLIC_URL+"/admin/database_manager"}>Database Manager</Link><br/>
		</Table>
		</div>
		</div>		
		



			{navigationData.map((nav,i)=>(nav.duplicate===undefined&&nav.hr===undefined)&&<Route key={i} path={process.env.PUBLIC_URL+nav.url}>
			<div className="box boxAdminContent">
		<div className="boxTitleBar">
		<h1>{nav.page}</h1></div>
		<div className="adminContainer adminScrollbar">
		<Helmet>
					<title>{APP_TITLE+" - Admin Panel: "+nav.page}</title>
				</Helmet>
				{nav.render??<TableEditor TESTMODE={p.TESTMODE} password={password} BACKENDURL={GetBackendURL(p)} path={nav.table}/>}
				</div></div></Route>)}

			<Route path={process.env.PUBLIC_URL+"/admin/database_manager"}>
			<div className="box boxAdminContent">
			<div className="boxTitleBar">
		<h1>Database Editor</h1></div>
		<div className="adminContainer">
					<DatabaseEditor password={password} BACKENDURL={GetBackendURL(p)}/>
				</div>					
				</div>	
			</Route>
		
		
		
		
		
		
		</>}
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

function FormField(p) {
	return <><label className="formField" for={p.field}>{p.label}</label>{
		p.type==="toggle"?<><Toggle id={p.field} checked={p.checked} onChange={p.onChange} disabled={p.loading}/> <label className="formDescription" for={p.field}>{p.checked?<b>YES</b>:<b>NO</b>}</label></>:<input type={p.type??"text"} disabled={p.loading} id={p.field} maxlength={p.maxlength} value={p.value} checked={p.checked} onChange={p.onChange} placeholder={p.placeholder}/>} <label className="formDescription" for={p.field}>{p.tooltip}</label></>
}

function VerifyLogin(p) {
	axios.post(GetBackendURL(p)+"/validUser",{
		username:p.LOGGEDINUSER,
		password:p.LOGGEDINHASH,
		recoveryhash:cookies.get("userID")
	})
	.then((data)=>{
		if (data.data.verified) {
			p.history.push("/")
		}
	})
	.catch((err)=>{
		console.log(err.message)
	})
}

function LoginForm(p) {

	function useHashQuery() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());
		return params
	}

	const query = useHashQuery()

	const [username,setUsername] = useState("")
	const [password,setPassword] = useState("")
	const [rememberMe,setRememberMe] = useState(false)
	const [error,setError] = useState("")
	const [loading,setLoading] = useState(false)
	const [message,setMessage] = useState("")

	const history = useHistory()

	useEffect(()=>{
		VerifyLogin({...p,history:history})
	},[history,p])

	function SubmitLogin() {
		setError("")
		setLoading(true)
		axios.post(GetBackendURL(p)+"/validUser",{
			username:username,
			password:md5(password)
		})
		.then((data)=>{
			if (data.data.verified) {
				p.setLOGGEDINUSER(username)
				p.setLOGGEDINHASH(md5(password))
				cookies.set("username",username,30,'d')
				cookies.set("password",md5(password),30,'d')
				setUsername("")
				setPassword("")
				setRememberMe(false)
				history.push("/")
			} else {
				setError("Could not authenticate!")
			}
		})
		.catch((err)=>{
			setError(err?.message??err);
		})
		.then(()=>{
			setLoading(false)
		})
	}

	function responseGoogle(response) {
		//setMessage(JSON.stringify(response))
		if (response.error) {
			setMessage(JSON.stringify(response))
		} else 
		if (response.profileObj.googleId&&
			response.profileObj.imageUrl&&
			response.profileObj.email&&
			response.profileObj.name&&
			response.tokenId){
			axios.post(GetBackendURL(p)+"/registerUser",{
				username:response.profileObj.name,
				email:response.profileObj.email,
				password:response.tokenId,
				avatar:response.profileObj.imageUrl,
				userID:response.profileObj.googleId,
				recoveryhash:response.profileObj.googleId
			})
			.then((data)=>{
				if (data.data.verified) {
					p.setLOGGEDINUSER(response.profileObj.name)
					p.setLOGGEDINHASH(response.tokenId)
					cookies.set("username",response.profileObj.name,30,'d')
					cookies.set("password",response.tokenId,30,'d')
					cookies.set("userID",response.profileObj.googleId,30,'d')
					setUsername("")
					setPassword("")
					setRememberMe(false)
					history.push("/")
				} else {
					cookies.remove("userID")
					setError("Could not authenticate!")
				}
			})
		}
	  }

	function DiscordLoginButton(){

		const [checkForLogin,setCheckForLogin] = useState(false)

		const history = useHistory()

		useEffect(()=>{
			if (query.code) {
				setCheckForLogin(true)
			}
 		},[])
		
		useEffect(()=>{
			if (checkForLogin) {
				console.log("Attempting login...")

				axios.get(GetBackendURL(p)+"/userData?token="+query.code)
				.then((data)=>{
					p.setLOGGEDINUSER(data.data.username)
					p.setLOGGEDINHASH(data.data.token)
					console.log(data.data.token)
					cookies.set("username",data.data.username,30,'d')
					cookies.set("password",data.data.token,30,'d')
					cookies.set("userID",data.data.id,30,'d')
					console.log(cookies.get("username"))
					console.log(cookies.get("password"))
					console.log(cookies.get("userID"))
					return axios.post(GetBackendURL(p)+"/registerUser",{
						username:data.data.username,
						email:data.data.email,
						password:data.data.token,
						avatar:"https://cdn.discordapp.com/avatars/"+data.data.id+"/"+data.data.avatar+".png",
						userID:data.data.id,
						recoveryhash:data.data.id
					})
					//window.location.href=""
					//console.log(data.data)
				})
				.then((data)=>{
					//window.location.href=""
					history.push("/")
				})
				.catch((err)=>{
					console.log(err.message)
				})
			}
		},[checkForLogin,history])
			
		return <>
			<button onClick={()=>{window.location.href=process.env.REACT_APP_LOCAL_REDIRECT?"https://discord.com/api/oauth2/authorize?client_id=885738904685281291&redirect_uri=https%3A%2F%2Flocalhost%3A3000%23%2Flogin&response_type=code&scope=identify%20email":"https://discord.com/api/oauth2/authorize?client_id=885738904685281291&redirect_uri=https%3A%2F%2Fngsplanner.com%23%2Flogin&response_type=code&scope=identify%20email"}}>Login</button>
		</>
	}

	return <>
	<Box title="Login Form">
	{loading?
		<img src={process.env.PUBLIC_URL+"/spinner.gif"} alt="" style={{background:"linear-gradient(white,#bca9f5)",marginTop:"10px"}} />
		:<><div  onKeyDown={(f)=>{if (f.key==="Enter") {SubmitLogin()}}}><h3 className="formError">{error}</h3>
		<FormField field="username" label="Username: " value={username} maxlength={20} onChange={(p)=>{setUsername(p.currentTarget.value)}} placeholder="Username"/><br/>
		<FormField field="password" label="Password: " type="password" value={password} onChange={(p)=>{setPassword(p.currentTarget.value)}} placeholder="Password"/><br/>
		<FormField field="rememberMe" label="Remember Me " type="toggle" checked={rememberMe} onChange={(p)=>{setRememberMe(p.currentTarget.checked)}}/><br/>
		<button type="submit" onClick={SubmitLogin}>Login</button></div>
		<hr/>
		{message}<br/>
		<GoogleLogin
			theme="dark"
			clientId="1081276553893-r50huhr0f9hkpcd7fdbb0oe4qcpglcpp.apps.googleusercontent.com"
			buttonText="Login"
			onSuccess={responseGoogle}
			onFailure={responseGoogle}
			cookiePolicy={'single_host_origin'}
		/>
		<DiscordLoginButton/>
		</>
	}
	</Box></>
}

function RegisterForm(p) {
	const [username,setUsername] = useState("")
	const [password,setPassword] = useState("")
	const [password2,setPassword2] = useState("")
	const [email,setEmail] = useState("")
	const [rememberMe,setRememberMe] = useState(false)
	const [error,setError] = useState("")
	const [loading,setLoading] = useState(false)

	const history = useHistory()

	useEffect(()=>{
		VerifyLogin({...p,history:history})
	},[history,p])

	function SubmitRegister() {
		setError("")
		setLoading(true)
		try{
			if (username.length<4) {throw new Error("Username must be at least 4 characters in length.")}
			if (username.length>20) {throw new Error("Username must be less than 21 characters in length.")}
			if (password.length<6) {throw new Error("Password must contain at least 6 characters.")}
			if (password!==password2) {throw new Error("Password fields must match.")}
			if (!email.includes("@")) {throw new Error("Invalid E-mail.")}
		}catch(err){
			setError(err?.message??err);
			setLoading(false)
			return
		}
		axios.post(GetBackendURL(p)+"/register",{
			username:username,
			password:md5(password),
			email:email
		})
		.then((data)=>{
			if (data.data.verified) {
				p.setLOGGEDINUSER(username)
				p.setLOGGEDINHASH(md5(password))
				setUsername("")
				setPassword("")
				setRememberMe(false)
			} else {
				setError("Could not authenticate!")
			}
		})
		.catch((err)=>{
			setError(err?.message??err);
		})
		.then(()=>{
			setLoading(false)
		})
	}

	return <>
	<Box title="Registration Form">
	{loading?
		<img src={process.env.PUBLIC_URL+"/spinner.gif"} alt="" style={{background:"linear-gradient(white,#bca9f5)",marginTop:"10px"}} />
		:<><h3 className="formError">{error}</h3>
		<FormField field="username" label="Username: " value={username} maxlength={20} onChange={(p)=>{setUsername(p.currentTarget.value)}} placeholder="Username" tooltip="Enter a username (4-20 characters, a-z and _ only)"/><br/>
		<FormField field="password" label="Password: " type="password" value={password} onChange={(p)=>{setPassword(p.currentTarget.value)}} placeholder="Password" tooltip="Enter a password (6 or more characters)"/><br/>
		<FormField field="password2" label="Verify Password: " type="password" value={password2} onChange={(p)=>{setPassword2(p.currentTarget.value)}} placeholder="Verify Password" tooltip="Enter password again."/><br/>
		<FormField field="email" label="E-mail: " type="email" value={email} onChange={(p)=>{setEmail(p.currentTarget.value)}} placeholder="email@example.com" tooltip="This is used to send you password reset emails."/><br/>
		<FormField field="rememberMe" label="Remember Me " type="toggle" checked={rememberMe} onChange={(p)=>{setRememberMe(p.currentTarget.checked)}}/><br/>
		<button type="submit" onClick={SubmitRegister}>Login</button></>
	}
	</Box></>
}


function App() {
	
	const [author] = useState("Dudley")
	const [buildName] = useState("Fatimah")
	const [className] = useState("Ranger")
	const [secondaryClassName] = useState("Force")
	const [classLv] = useState(20)
	const [secondaryClassLv] = useState(15)
		
	
	const [bp] = useState(1330)
	const [hp] = useState(388)
	const [pp] = useState(154)
	const [weaponTotalAtk] = useState(282)
	const [baseAtk] = useState(650)
	const [statDisplayAtk,setstatDisplayAtk] = useState(282)

	useEffect(()=>{
		setstatDisplayAtk(Number(weaponTotalAtk)+Number(baseAtk))
	},[weaponTotalAtk,baseAtk])

	const [def] = useState(932)
	const [weaponUp1] = useState(0.317)
	const [weaponUp2] = useState(0.241)
	const [weaponUp3] = useState(0.241)
	const [damageResist] = useState(0.18)
	const [burnResist] = useState(0)
	const [shockResist] = useState(0)
	const [panicResist] = useState(0)
	const [stunResist] = useState(0)
	const [freezeResist] = useState(0)
	const [blindResist] = useState(0)
	const [poisonResist] = useState(0)
	
	const [TESTMODE,setTESTMODE] = useState(false)
	const [DATA,setDATA] = useState(undefined)
	const [DATAID,setDATAID] = useState({GetData:()=>{}})
	const [update,setUpdate] = useState(false)

	const [LOGGEDINUSER,setLOGGEDINUSER] = useState(cookies.get("username"))
	const [LOGGEDINHASH,setLOGGEDINHASH] = useState(cookies.get("password"))

	const PANELPATHWBUILD = process.env.PUBLIC_URL+"/test/:BUILDID"
	const PANELPATH = process.env.PUBLIC_URL+"/test"

	function GetData(table,row,col,id){
		if (row===undefined) {row=''}
		if (col===undefined) {col=''}
		var data = id?DATAID:DATA
		if (!data) {
			return "no data"
		} else {
			return data!==undefined?data[table]!==undefined?data[table][row]!==undefined?data[table][row][col]!==undefined?data[table][row][col]:data[table][row]:data[table]:data:"no data"
		}
	}
	
	useEffect(()=>{
		if (update) {
			setUpdate(false)
			axios.get(GetBackendURL({TESTMODE:TESTMODE})+"/data")
			.then((data)=>{
				setDATA(data.data)
			})
			axios.get(GetBackendURL({TESTMODE:TESTMODE})+"/dataid")
			.then((data)=>{
				setDATAID(data.data)
			})
		}
	},[update,TESTMODE])

	useEffect(()=>{
		setLOGGEDINUSER(cookies.get("username"))
		setLOGGEDINHASH(cookies.get("password"))
		axios.get(GetBackendURL({TESTMODE:TESTMODE})+"/data")
		.then((data)=>{
			setDATA(data.data)
		})
		axios.get(GetBackendURL({TESTMODE:TESTMODE})+"/dataid")
		.then((data)=>{
			setDATAID(data.data)
		})
	},[TESTMODE])

  return (
  	<>
		<HashRouter>
			<Switch>
				<Route path={process.env.PUBLIC_URL+"/admin"}>
					<Helmet>
						<title>{APP_TITLE+" - Admin Panel"}</title>
					</Helmet>
					<AdminPanel setUpdate={setUpdate} setTESTMODE={setTESTMODE} BACKENDURL={BACKENDURL} TESTMODE={TESTMODE} DATA={GetData}/>
				</Route>
				<Route path={PANELPATHWBUILD}>
					<TestHeader
						LOGGEDINUSER={LOGGEDINUSER}
						LOGGEDINHASH={LOGGEDINHASH}
						BACKENDURL={GetBackendURL(BACKENDURL)}
					/>
					<TestPanel
						APP_TITLE={APP_TITLE}
						path={PANELPATHWBUILD}
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
						burnResist={burnResist} 
						shockResist={shockResist} 
						panicResist={panicResist} 
						stunResist={stunResist} 
						freezeResist={freezeResist} 
						blindResist={blindResist} 
						poisonResist={poisonResist} 
						statDisplayAtk={statDisplayAtk} 
						GetData={GetData}
						LOGGEDINUSER={LOGGEDINUSER}
						LOGGEDINHASH={LOGGEDINHASH}
						BACKENDURL={GetBackendURL(BACKENDURL)}
					/>
				</Route>
				<Route path={PANELPATH}>
					<TestHeader
						LOGGEDINUSER={LOGGEDINUSER}
						LOGGEDINHASH={LOGGEDINHASH}
						BACKENDURL={GetBackendURL(BACKENDURL)}
					/>
					<TestPanel
						APP_TITLE={APP_TITLE}
						path={PANELPATH}
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
						burnResist={burnResist} 
						shockResist={shockResist} 
						panicResist={panicResist} 
						stunResist={stunResist} 
						freezeResist={freezeResist} 
						blindResist={blindResist} 
						poisonResist={poisonResist} 
						statDisplayAtk={statDisplayAtk} 
						GetData={GetData}
						LOGGEDINUSER={LOGGEDINUSER}
						LOGGEDINHASH={LOGGEDINHASH}
						BACKENDURL={GetBackendURL(BACKENDURL)}
					/>
				</Route>
				<Route path={process.env.PUBLIC_URL+"/login"}>
					<Helmet>
						<title>{APP_TITLE+" - Login"}</title>
					</Helmet>
					<TestHeader
						LOGGEDINUSER={LOGGEDINUSER}
						LOGGEDINHASH={LOGGEDINHASH}
						BACKENDURL={GetBackendURL(BACKENDURL)}
					/>
					<LoginForm BACKENDURL={BACKENDURL} TESTMODE={TESTMODE} LOGGEDINUSER={LOGGEDINUSER} LOGGEDINHASH={LOGGEDINHASH} setLOGGEDINHASH={setLOGGEDINHASH} setLOGGEDINUSER={setLOGGEDINUSER}/>
				</Route>
				<Route path={process.env.PUBLIC_URL+"/register"}>
					<Helmet>
						<title>{APP_TITLE+" - Register"}</title>
					</Helmet>
					<TestHeader
						LOGGEDINUSER={LOGGEDINUSER}
						LOGGEDINHASH={LOGGEDINHASH}
						BACKENDURL={GetBackendURL(BACKENDURL)}
					/>
					<RegisterForm BACKENDURL={BACKENDURL} TESTMODE={TESTMODE} LOGGEDINUSER={LOGGEDINUSER} LOGGEDINHASH={LOGGEDINHASH} setLOGGEDINHASH={setLOGGEDINHASH} setLOGGEDINUSER={setLOGGEDINUSER}/>
				</Route>
				<Route path={process.env.PUBLIC_URL+"/builds"}>
					<Helmet>
						<title>{APP_TITLE+" - Builds"}</title>
					</Helmet>
					<TestHeader
						LOGGEDINUSER={LOGGEDINUSER}
						LOGGEDINHASH={LOGGEDINHASH}
						BACKENDURL={GetBackendURL(BACKENDURL)}
					/>
					<Builds 
						GetData={GetData}
						BACKENDURL={GetBackendURL(BACKENDURL)}
						PANELPATHWBUILD={PANELPATHWBUILD}/>
				</Route>
				<Route path={process.env.PUBLIC_URL+"/formula"}>
					<DamageCalculator/>
				</Route>
				<Route path="/">
					<Helmet>
						<title>{APP_TITLE}</title>
					</Helmet>
				<div className="modalOverlaySplash">
				<div className="modal">
				<div className="box boxMisc">
				<div className="boxTitleBar"><h1>{GetData("site_data","h1","data")}</h1></div><h2>{GetData("site_data","h2","data")}</h2><p><img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/>
				{GetData("site_data","UNDER_CONSTRUCTION_TEXT","data")}</p><br style={{clear:"both"}} />
				</div>
				</div>
				<footer><a href="https://github.com/sigonasr2/ngsplanner/"><span className="github">&nbsp;</span></a><a href="https://twitter.com/ngsplanner"><span className="twitter">@NGSPlanner</span></a></footer>
				</div>
				</Route>
			</Switch>
		</HashRouter>
	</>
  );
}

export default App;
