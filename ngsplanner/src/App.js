import logo from './logo.svg';
import './App.css';
import React, {useState,useEffect,useRef,useReducer} from 'react';

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
	const [loaded,setLoaded] = useState(false)
	useEffect(()=>{
		setTimeout(()=>{document.getElementById("editBox").focus()},100)
		setLoaded(true)
	})
return <input id="editBox" onKeyDown={(e)=>{
	if (e.key==="Enter") {p.setEdit(false)}
}}	maxLength={p.maxlength?p.maxlength:20} onBlur={()=>{p.setEdit(false)}} value={p.value} onChange={(f)=>{f.currentTarget.value.length>0?p.setName(f.currentTarget.value):p.setName(p.originalName)}}>
	
	</input>
}

function EditableBox(p) {
	const [edit,setEdit] = useState(false)
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
		icon:"icons/UINGSClassHu.png"
	},
	FIGHTER:{
		name:"Fighter",
		icon:"icons/UINGSClassFi.png"
	},
	RANGER:{
		name:"Ranger",
		icon:"icons/UINGSClassRa.png"
	},
	GUNNER:{
		name:"Gunner",
		icon:"icons/UINGSClassGu.png"
	},
	FORCE:{
		name:"Force",
		icon:"icons/UINGSClassFo.png"
	},
	TECHTER:{
		name:"Techter",
		icon:"icons/UINGSClassTe.png"
	}
}

const EFFECTS = {
	"Food Boost Effect":{
		perks:[
			"[Meat] Potency +10.0%",
			"[Crisp] Potency to Weak Point +5.0%"
		],
		icon:"icons/TQ8EBW2.png"
	},
	"Shifta / Deband":{
		perks:[
			"Potency +5.0%",
			"Damage Resistance +10.0%"
		],
		icon:"icons/VIYYNIm.png"
	},
	"Region Mag Boost":{
		perks:[
			"Potency +5.0%",
		],
		icon:"icons/N6M74Qr.png"
	},
}

const EQUIPMENT = {
	"Ophistia Shooter":{
		icon:"icons/uc1iBck.png"
	},
	"Klauzdyne":{
		icon:"icons/uldt9lR.png"
	},
	"Klauznum":{
		icon:"icons/F0t58xP.png"
	},
	"Klauzment":{
		icon:"icons/20M6Z7t.png"
	}
}

const ABILITIES = {
	"Wellspring Unit Lv.3":{
		icon:"icons/NGSUIItemPotentialAbility.png"
	},
	"Fixa Fatale Lv.5":{
		icon:"icons/UINGSItemPresetAbility.png"
	}
}

const ABILITY_DEFAULT_ICON = "icons/UINGSItemSpecialAbility.png"

function Class(p) {
	const class_obj = CLASSES[p.name]
	return <><img src={class_obj.icon}/>{class_obj.name}</>
}

function ClassSelector(p){
	return <div className="popup">
		Class Selector<br/>
		{Object.keys(CLASSES).map((cl,i)=>{
		return <button id={i} className="rounded" onClick={()=>{p.setClassName(cl);p.setEdit(false)}}><img src={CLASSES[cl].icon}/><br/>{CLASSES[cl].name}</button>
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

function MainBox(p) {
	return <Box title="NGS Planner">
		<table className="ba">
			<ListRow title="Author"><EditableBox setData={p.setAuthor} data={p.author}/></ListRow>
			<ListRow title="Build Name"><EditableBox setData={p.setBuildName} data={p.buildName}/></ListRow>
			<ListRow title="Class" content={<EditableClass setClassName={p.setClassName} class={p.className}></EditableClass>}><span className="ye">Lv.20</span></ListRow>
			<ListRow content={<><EditableClass setClassName={p.setSecondaryClassName} class={p.secondaryClassName}></EditableClass></>}>Lv.15</ListRow>
		</table>
	   </Box>
}

function StatsBox(p) {
	 return <Box title="Stats">
			<table className="st">
				<ListRow title="Battle Power" content={p.bp}></ListRow>
				<ListRow title="HP" content={p.hp}></ListRow>
				<ListRow title="PP" content={p.pp}></ListRow>
				<ListRow title="Defense" content={p.def}></ListRow>
				<ListRow title="Weapon Up" content={<><img alt="" src="https://pso2na.arks-visiphone.com/images/3/37/NGSUIStatSATK.png" /> <span className="ye">+{p.weaponUp1*100}%</span></>}><img alt="" src="https://pso2na.arks-visiphone.com/images/c/c5/NGSUIStatRATK.png" /> <span className="ye">+{p.weaponUp2*100}%</span></ListRow>
				<ListRow content={<><img alt="" src="https://pso2na.arks-visiphone.com/images/a/ae/NGSUIStatTATK.png" /> <span className="ye">+{p.weaponUp3*100}%</span></>}></ListRow>
				<ListRow title="Damage Resist." content={p.damageResist*100+"%"}></ListRow>
			</table>
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
	return <li onClick={()=>{p.setCurrentPage(p.page)}} className={(p.currentPage==p.page)?"selected":""}>{p.pageName?p.pageName:p.page}</li>
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
				currentPage==1?
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
			case 2:{
				setSelectedEquip(p.armorSlot1)
				setSelectedEquipEnhancementLv(p.armorSlot1EnhancementLv)
				setSelectedEquipAbilities(p.armorSlot1AbilityList)
			}break;
			case 3:{
				setSelectedEquip(p.armorSlot2)
				setSelectedEquipEnhancementLv(p.armorSlot2EnhancementLv)
				setSelectedEquipAbilities(p.armorSlot2AbilityList)
			}break;
			case 4:{
				setSelectedEquip(p.armorSlot3)
				setSelectedEquipEnhancementLv(p.armorSlot3EnhancementLv)
				setSelectedEquipAbilities(p.armorSlot3AbilityList)
			}break;
			default:{
				setSelectedEquip(p.weapon)
				setSelectedEquipEnhancementLv(p.weaponEnhancementLv)
				setSelectedEquipAbilities(p.weaponAbilityList)
			}
		}
	},[currentPage])
	
	return <Box title="Equipped Weapon">
		<h2><img alt="" src="https://pso2na.arks-visiphone.com/images/b/bc/NGSUIItemAssaultRifleMini.png" />{selectedEquip}+{selectedEquipEnhancementLv}</h2>
		<PageControl pages={4} currentPage={currentPage} setCurrentPage={setCurrentPage} pageNames={["W",1,2,3]}/>
		<div className="de">
			<div>
				<h3>Abilitiy Details</h3>
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
			currentPage==1&&
			<table className="ba">
			<ListRow title="Critical Hit Rate">{p.criticalHitRate*100}%</ListRow>
			<ListRow title="Critical Multiplier">{p.criticalMultiplier*100}%</ListRow>
			<ListRow title="Midrange">{p.midRange}</ListRow>
			<ListRow title="Critical">{p.critical}</ListRow>
			<ListRow title="Effective"><span className="ye">{p.effective}</span></ListRow>
			</table>
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
	
  return (
  <>
  <div id="main">
   <Col>
		<MainBox author={author} setAuthor={setAuthor} buildName={buildName} setBuildName={setBuildName} className={className} setClassName={setClassName} secondaryClassName={secondaryClassName} setSecondaryClassName={setSecondaryClassName}/>
		<StatsBox bp={bp} setBP={setBP} hp={hp} setHP={setHP} pp={pp} setPP={setPP} def={def} setDef={setDef} weaponUp1={weaponUp1} setWeaponUp1={setWeaponUp1} weaponUp2={weaponUp2} setWeaponUp2={setWeaponUp2} weaponUp3={weaponUp3} setWeaponUp3={setWeaponUp3} damageResist={damageResist}/>
		<EffectsBox effectList={effectList} setEffectList={setEffectList}/>
	</Col>
	<Col>
		<EquipBox weapon={weapon} setWeapon={setWeapon} armorSlot1={armorSlot1} setArmorSlot1={setArmorSlot1} armorSlot2={armorSlot2} setArmorSlot2={setArmorSlot2} armorSlot3={armorSlot3} setArmorSlot3={setArmorSlot3} weaponEnhancementLv={weaponEnhancementLv} setWeaponEnhancementLv={setWeaponEnhancementLv} armorSlot1EnhancementLv={armorSlot1EnhancementLv} setArmorSlot1EnhancementLv={setArmorSlot1EnhancementLv} armorSlot2EnhancementLv={armorSlot2EnhancementLv} setArmorSlot2EnhancementLv={setArmorSlot2EnhancementLv} armorSlot3EnhancementLv={armorSlot3EnhancementLv} setArmorSlot3EnhancementLv={setArmorSlot3EnhancementLv}/>
		<EquippedWeaponBox weapon={weapon} armorSlot1={armorSlot1} armorSlot2={armorSlot2} armorSlot3={armorSlot3} weaponAbilityList={weaponAbilityList} setWeaponAbilityList={setWeaponAbilityList} armor1AbilityList={armor1AbilityList} setArmor1AbilityList={setArmor1AbilityList} armor2AbilityList={armor2AbilityList} setArmor2AbilityList={setArmor2AbilityList} armor3AbilityList={armor3AbilityList} setArmor3AbilityList={setArmor3AbilityList} weaponEnhancementLv={weaponEnhancementLv}armorSlot1EnhancementLv={armorSlot1EnhancementLv}armorSlot2EnhancementLv={armorSlot2EnhancementLv}armorSlot3EnhancementLv={armorSlot3EnhancementLv}/>
	</Col>
	<Col>
		<DamageBox criticalHitRate={criticalHitRate} setCriticalHitRate={setCriticalHitRate} criticalMultiplier={criticalMultiplier} setCriticalMultiplier={setCriticalMultiplier} midRange={midRange} setMidRange={setMidRange} critical={critical} setCritical={setCritical} effective={effective} setEffective={setEffective}/>
	</Col>
</div></>
  );
}

export default App;
