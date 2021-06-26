import logo from './logo.svg';
import './App.css';
import React, {useState,useEffect,useRef} from 'react';

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
	const [name,setName] = useState(p.data)
	const [edit,setEdit] = useState(false)
	return <>
		<div className="hover" onClick={(f)=>{setEdit(true)}}>
			{edit?
			<EditBox maxlength={p.maxlength} setEdit={setEdit} originalName={name} setName={setName} value={name}/>
			:<>{name}</>}
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

function Class(p) {
	const class_obj = CLASSES[p.name]
	return <><img src={class_obj.icon}/>{class_obj.name}</>
}

function ClassSelector(p){
	return <div className="popup">
		Class Selector<br/>
		{Object.keys(CLASSES).map((cl)=>{
		return <button className="rounded" onClick={()=>{p.setClassName(cl);p.setEdit(false)}}><img src={CLASSES[cl].icon}/><br/>{CLASSES[cl].name}</button>
		})}
	</div>
}

function EditableClass(p){
	const [edit,setEdit] = useState(false)
	return <><span className="hover" onClick={()=>{setEdit(true)}}><Class name={p.class}/>
	</span>
	{edit&&<ClassSelector setClassName={p.setClassName} setEdit={setEdit}/>}
	</>
}

function MainBox() {
	const [className,setClassName] = useState("RANGER")
	const [secondaryClassName,setSecondaryClassName] = useState("FORCE")
	return <Box title="NGS Planner">
		<table className="ba">
			<ListRow title="Author"><EditableBox data="Dudley"/></ListRow>
			<ListRow title="Build Name"><EditableBox data="Fatimah"/></ListRow>
			<ListRow title="Class" content={<EditableClass setClassName={setClassName} class={className}></EditableClass>}><span className="ye">Lv.20</span></ListRow>
			<ListRow content={<><EditableClass setClassName={setSecondaryClassName} class={secondaryClassName}></EditableClass></>}>Lv.15</ListRow>
		</table>
	   </Box>
}

function StatsBox() {
	 return <Box title="Stats">
			<table className="st">
				<ListRow title="Battle Power" content={1344}></ListRow>
				<ListRow title="HP" content={289}></ListRow>
				<ListRow title="PP" content={100}></ListRow>
				<ListRow title="Defense" content={402}></ListRow>
				<ListRow title="Weapon Up" content={<><img alt="" src="https://pso2na.arks-visiphone.com/images/3/37/NGSUIStatSATK.png" /> <span className="ye">+34%</span></>}><img alt="" src="https://pso2na.arks-visiphone.com/images/c/c5/NGSUIStatRATK.png" /> <span className="ye">+34%</span></ListRow>
				<ListRow content={<><img alt="" src="https://pso2na.arks-visiphone.com/images/a/ae/NGSUIStatTATK.png" /> <span className="ye">+34%</span></>}></ListRow>
				<ListRow title="Damage Resist." content="18%"></ListRow>
			</table>
		</Box>
}

function EffectsBox() {
	return <Box title="Current Effects">
			<ul className="boxmenu">
				<li>1</li>
				<li>2</li>
			</ul>
			<h3>Effect Name</h3>
			<ul className="bu">
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
		</Box>
}

function EquipBox() {
	return <Box title="Equip">
			<div className="we">
				<div><h3>Weapon</h3><br /><img alt="" src="https://i.imgur.com/uc1iBck.png" /><br />Ophistia Shooter+35</div>
				<div><h3>Slot 1</h3><br /><img alt="" src="https://i.imgur.com/uldt9lR.png" /><br />Klauzdyne+10</div>
				<div><h3>Slot 2</h3><br /><img alt="" src="https://i.imgur.com/F0t58xP.png" /><br />Klauznum+10</div>
				<div><h3>Slot 3</h3><br /><img alt="" src="https://i.imgur.com/20M6Z7t.png" /><br />Klauzment+10</div>
			</div>
		</Box>
}

function EquippedWeaponBox() {
	return <Box title="Equipped Weapon">
		<h2><img alt="" src="https://pso2na.arks-visiphone.com/images/b/bc/NGSUIItemAssaultRifleMini.png" />Ophistia Shooter+35</h2>
		<ul className="boxmenu">
		<li>W</li>
		<li>1</li>
		<li>2</li>
		<li>3</li>
		</ul>
		<div className="de">
			<div>
				<h3>Abilitiy Details</h3>
				<ul className="aug">
					<li><img alt="" src="https://pso2.arks-visiphone.com/images/8/8d/NGSUIItemPotentialAbility.png" /> Wellspring Unit Lv.3</li>
					<li><img alt="" src="https://pso2na.arks-visiphone.com/images/7/7e/UINGSItemPresetAbility.png" /> Fixa Fatale Lv.5</li>
					<li><img alt="" src="https://pso2na.arks-visiphone.com/images/5/56/UINGSItemSpecialAbility.png" /> Legaro S Attack II</li>
					<li><img alt="" src="https://pso2na.arks-visiphone.com/images/5/56/UINGSItemSpecialAbility.png" /> Legaro S Efficet</li>
					<li><img alt="" src="https://pso2na.arks-visiphone.com/images/5/56/UINGSItemSpecialAbility.png" /> Legaro S Efficet</li>
					<li><img alt="" src="https://pso2na.arks-visiphone.com/images/5/56/UINGSItemSpecialAbility.png" /> Legaro Souls 2</li>
					<li><img alt="" src="https://pso2na.arks-visiphone.com/images/5/56/UINGSItemSpecialAbility.png" /> Legaro Reverij</li>
					<li><img alt="" src="https://pso2na.arks-visiphone.com/images/5/56/UINGSItemSpecialAbility.png" /> Legaro Factalz</li>
					<li><img alt="" src="https://pso2na.arks-visiphone.com/images/5/56/UINGSItemSpecialAbility.png" /> Legaro Crakus</li>
					<li><img alt="" src="https://pso2na.arks-visiphone.com/images/5/56/UINGSItemSpecialAbility.png" /> Legaro Attack Vaz III</li>
				</ul>
			</div>
			<div>
				<h3>Properties</h3>
				<ul className="pr">
				<li>Enhancement Lv.&emsp;<span>+35</span></li>
				<li>Multi-Weapon&emsp;<span>-</span></li>
				<li>Element&emsp;<span>-</span></li>
				</ul>
			</div>
		</div>
	</Box>
}

function DamageBox() {
	return <Box title="Damage">
		<ul className="boxmenu">
		<li>1</li>
		<li>2</li>
		<li>3</li>
		</ul>
		<br /><br />
		<table className="ba">
		<ListRow title="Critical Hit Rate">5%</ListRow>
		<ListRow title="Critical Multiplier">120%</ListRow>
		<ListRow title="Midrange">126</ListRow>
		<ListRow title="Critical">152</ListRow>
		<ListRow title="Effective"><span className="ye">127</span></ListRow>
		</table>
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
  return (
  <>
  <div id="main">
   <Col>
		<MainBox/>
		<StatsBox/>
		<EffectsBox/>
	</Col>
	<Col>
		<EquipBox/>
		<EquippedWeaponBox/>
	</Col>
	<Col>
		<DamageBox/>
	</Col>
</div></>
  );
}

export default App;
