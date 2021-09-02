import React, { useEffect,useState } from 'react';
import Modal from 'react-modal'
import { DisplayIcon } from './DEFAULTS';
import { ExpandTooltip } from './components/ExpandTooltip';
import { SkillTree } from './skilltree/skillTree';
import axios from 'axios';
import Helmet from 'react-helmet'

import { useLocation,useHistory,useParams,matchPath } from 'react-router';

//Helper variables for Weapon selector with structure: [weapon_type,weapon,potential,potential_tooltip,weapon_existence_data]
const WEAPON_WEAPONTYPE=0;const WEAPON_WEAPON=1;const WEAPON_POTENTIAL=2;const WEAPON_POTENTIAL_TOOLTIP=3;const WEAPON_EXISTENCE_DATA=4;

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
	return <li onClick={()=>{if (p.onPageChange) {p.onPageChange(p.pageName)} p.setCurrentPage(p.page)}} className={(p.currentPage===p.page)?"selected":"unselected"}>{p.pageDisplay?p.pageDisplay[p.page-1]:p.pageName?p.pageName:p.page}</li>
}

function PageControl(p) {
	var pages = []
	for (var i=0;i<p.pages;i++) {
		pages.push(<PageControlButton onPageChange={p.onPageChange} pageDisplay={p.pageDisplay} pageName={p.pageNames?p.pageNames[i]:undefined} currentPage={p.currentPage} setCurrentPage={p.setCurrentPage} page={i+1}/>)
	}
  if (p.children!==undefined) {
      pages.push(<li className="pageControlDetails">{p.children}</li>)
  }
  //console.log(JSON.stringify(p.children))
	return pages.length>0&&<ul className="boxmenu">
			{pages.map((page,i)=>{return <React.Fragment key={i}>{page}</React.Fragment>})}
		</ul>
}

function Class(p) {
  const CLASSES = p.GetData("class")
	const class_obj = CLASSES[p.name]
	return CLASSES!=="no data"?class_obj?<><img alt="" src={process.env.PUBLIC_URL+class_obj.icon}/>{class_obj.name}</>:<></>:<>-</>
}

function EditableClass(p){
	return <><div className="editClass" onClick={()=>{p.setClassNameSetter(p.editClass);p.setClassSelectWindowOpen(true)}}><Class GetData={p.GetData} name={p.name}/>
	</div>
	</>
}

function PopupWindow(p) {

	return <Modal ariaHideApp={false} isOpen={p.modalOpen} onRequestClose={()=>{p.setModalOpen(false)}} shouldFocusAfterRender={true} shouldCloseOnOverlayClick={true} shouldCloseOnEsc={true} className="modal" overlayClassName="modalOverlay">
    <div className="box boxModal">
    <div className="boxTitleBar">
    <h1>{p.title}</h1>
    {p.showCloseButton&&<div className="boxExit" onClick={()=>{p.setModalOpen(false)}}></div>}
    </div>
    <PageControl onPageChange={p.onPageChange} pages={p.pageNames?p.pageNames.length:0} pageNames={p.pageNames}  currentPage={p.page} setCurrentPage={p.setPage}/>
    
    {p.children}
  </div>
	</Modal>
}

function SelectorWindow(p) {

  const { onModalOpen } = p

  const [itemList,setItemList] = useState([])

  const [tabPage,setTabPage] = useState(1)
  const [sortSelector,setSortSelector] = useState(p.sortItems?p.sortItems[0]:"")
  const [filter,setFilter] = useState("")
  
  useEffect(()=>{
    if (p.dataFunction) {
      setItemList(p.dataFunction())
    }
  },[p])

  useEffect(()=>{
    if (onModalOpen) {
      onModalOpen(setTabPage)
    }
  },[onModalOpen])
  
  return <PopupWindow page={tabPage} setPage={setTabPage} modalOpen={p.modalOpen} setModalOpen={p.setModalOpen} showCloseButton={true} title={p.title}
      pageNames={p.pageNames}
      filter={true}
      onPageChange={p.onPageChange}
    >
    {(p.sortItems||p.filter)&&<div className="itemBar">
        <div className="itemBarSort">
          {p.sortItems&&<select className="itemBarForm" value={sortSelector} onChange={(f)=>{setSortSelector(f.currentTarget.value)}}>
            {p.sortItems.map((item)=><option key={item} value={item}>{item}</option>)}
          </select>}
        </div>
        <div className="itemBarFilter">
          {p.filter?<input className="itemBarForm" type="text" placeholder="Filter" value={filter} onChange={(f)=>{setFilter(f.currentTarget.value)}} />:<></>}
        </div>
      </div>
    }
    <div className="modalItemListContainer customScrollbar">
    {p.filter?itemList.filter((item)=>p.filterFunction(tabPage,item)).filter((item)=>p.searchFieldFunction(filter,item)).sort((a,b)=>p.sortOrderFunction(sortSelector,a,b)).map((item,i)=><React.Fragment key={i}>{p.displayFunction(item)}</React.Fragment>):itemList.map((item,i)=><React.Fragment key={i}>{p.displayFunction(item)}</React.Fragment>)}
    {p.children}
    </div>
  </PopupWindow>
}

function LeftButton(p){
	return <span {...p} className="skillLeftButton">
  </span>
}

function RightButton(p){
	return <span {...p} className="skillRightButton">
  </span>
}
function ClassSelectorWindow(p) {
  const [title,setTitle] = useState("Select Main Class")
  useEffect(()=>{
    setTitle((p.editClass)?"Select Sub Class":"Select Main Class")
  },[p.editClass])
  return <SelectorWindow title={title} modalOpen={p.modalOpen} setModalOpen={p.setModalOpen} GetData={p.GetData}
  pageNames={["Main Class","Sub-Class"]}
  onPageChange={(page)=>{
    if (page==="Main Class") {
      p.setEditClass(0)
    } else {
      p.setEditClass(1)
    }
  }}
  onModalOpen={(pageSetter)=>{
    pageSetter((p.editClass)?2:1)
  }}
  dataFunction={() => {
    var dat1 = p.GetData("class")
    return Object.keys(dat1)
  }
  }
  displayFunction={(key) => {
    return <li className={p.class===key?"treeListMain":p.subClass===key?"treeListSub":""} onClick={() => {if (p.editClass===0){p.setClassName(key);p.setSubClassName(p.subClass===key?p.class:p.subClass)}else{p.setSubClassName(key);p.setClassName(p.class===key?p.subClass:p.class)}; p.setModalOpen(false) }}><img alt="" src={DisplayIcon(p.GetData("class", key, "icon"))} /> {p.GetData("class", key, "name")}</li>
  }}
/>
}

function GetSpecialWeaponName(item) {
  return item[WEAPON_EXISTENCE_DATA]!==undefined?(item[WEAPON_EXISTENCE_DATA].special_name?.length>0)?item[WEAPON_EXISTENCE_DATA].special_name:(item[WEAPON_WEAPON].name+" "+item[WEAPON_WEAPONTYPE].name):""
}

function ConvertCoordinate(x,y) {
    return (String.fromCharCode(Number(x)+'a'.charCodeAt(0)))+(y/2+1);
}

function SkillBox(p) {
    return <div className={p.className} style={{ gridArea: ConvertCoordinate(Number(p.skill[0]),Number(p.skill[1])) }}><img className="skillIcon" alt="" src={DisplayIcon(p.GetData("class_skill",p.skill[2],"icon",true))} /><span className="skillAllocated">{(p.skillPointData[p.page-1][p.boxId]?p.skillPointData[p.page-1][p.boxId]:0)+"/"+p.maxPoints}</span><em className="skillName">{typeof p.GetData("class_skill",p.skill[2],"name",true)==="string"&&p.GetData("class_skill",p.skill[2],"name",true)}</em><div className="skillButtons">
      <LeftButton onClick={()=>{
        var temp=[...p.points]
        var tempData=[...p.skillPointData]
        if (!tempData[p.page-1][p.boxId]) {
          tempData[p.page-1][p.boxId]=0
        }
        if (tempData[p.page-1][p.boxId]>0) {
          temp[p.page-1]-=1
          tempData[p.page-1][p.boxId]-=1
          p.setPoints(temp)
          p.setSkillPointData(tempData)
        }}}/>
      <RightButton  onClick={()=>{
        var temp=[...p.points]
        var tempData=[...p.skillPointData]
        if (!tempData[p.page-1][p.boxId]) {
          tempData[p.page-1][p.boxId]=0
        }
        if (tempData[p.page-1][p.boxId]<p.maxPoints) {
          temp[p.page-1]+=1
          tempData[p.page-1][p.boxId]+=1
          p.setPoints(temp)
          p.setSkillPointData(tempData)
        }}}/></div></div>
}

function SkillTreeBoxes(p) {

  function GetHighestLevel(skill) {
    var skillInfo = Object.keys(p.GetData("class_skill_data"))
    var highestLevel = 0
    for (var i=0;i<skillInfo.length;i++) {
      var skillData = p.GetData("class_skill_data",skillInfo[i])
      if (skillData&&Number(skillData.class_skill_id)===Number(skill)&&skillData.level>highestLevel) {
        highestLevel=skillData.level
      }
    }
    return highestLevel
  }

  function isLocked(skill) {
    return false
  }

  return <>
    {p.skillTreeSkillData&&p.skillTreeSkillData.map((skill,i)=>{
      var splitter = skill.split(",")
      return splitter[0]!==""&&splitter[1]!==""&&splitter[2]!==""&&<SkillBox key={i} className={isLocked(splitter[2])?"skillLocked":p.skillPointData[p.page-1][splitter[0]+"_"+splitter[1]]===GetHighestLevel(splitter[2])?"skillMaxed":p.skillPointData[p.page-1][splitter[0]+"_"+splitter[1]]>0?"skillActive":""} boxId={splitter[0]+"_"+splitter[1]} skillPointData={p.skillPointData} setSkillPointData={p.setSkillPointData} page={p.page} cl={p.cl} maxPoints={GetHighestLevel(splitter[2])} points={p.points} setPoints={p.setPoints} GetData={p.GetData} skill={splitter.map((numb)=>Number(numb))}/>
    })}
  </>
}

function SkillTreeContainer(p){

  const { GetData } = p

  const [skillTreeData,setSkillTreeData] = useState([])
  const [skillTreeSkillData,setSkillTreeSkillData] = useState([])
  const [skillTreeLineColor,setSkillTreeLineColor] = useState("")
  const [skillTreeLineWidth,setSkillTreeLineWidth] = useState(3)
  const [skillTreeDimensionX,setSkillTreeDimensionX] = useState(6)
  const [skillTreeDimensionY,setSkillTreeDimensionY] = useState(6)
  const [skillTreeGridSizeX,setSkillTreeGridSizeX] = useState(171)
  const [skillTreeGridSizeY,setSkillTreeGridSizeY] = useState(148)
  const [skillTreeGridPaddingX,setSkillTreeGridPaddingX] = useState(10)
  const [skillTreeGridPaddingY,setSkillTreeGridPaddingY] = useState(48)
  const [halflineheight,setHalfLineHeight] = useState(60)

  useEffect(()=>{
    if (Object.keys(GetData("skill_tree_data")).length>1) {
      for (var skillTree of GetData("skill_tree_data")) {
          if (skillTree.class_id===GetData("class",p.cl,'id')) {
            var data = skillTree.data.split(",")
            var skillData = skillTree.skill_data.split(";")
            setSkillTreeData(data)
            setSkillTreeSkillData(skillData)
            setSkillTreeLineColor(skillTree.line_color)
            setSkillTreeLineWidth(skillTree.line_width)
            setSkillTreeDimensionX(data[0].length)
            setSkillTreeDimensionY(data.length)
            setSkillTreeGridSizeX(skillTree.gridsizex)
            setSkillTreeGridSizeY(skillTree.gridsizey)
            setSkillTreeGridPaddingX(skillTree.gridpaddingx)
            setSkillTreeGridPaddingY(skillTree.gridpaddingy)
            setHalfLineHeight(skillTree.halflineheight)
            break;
          }
        }
      }
  },[p.cl,GetData])

  return <div className="skillTreeContainer customScrollbar">
  <div style={{ position: "relative" }}>
    {<SkillTree style={{ position: "absolute" }} strokeStyle={skillTreeLineColor} lineWidth={skillTreeLineWidth} lineDash={[]}
      gridDimensionsX={skillTreeDimensionX} gridDimensionsY={skillTreeDimensionY} gridSizeX={skillTreeGridSizeX} gridSizeY={skillTreeGridSizeY} gridPaddingX={skillTreeGridPaddingX} gridPaddingY={skillTreeGridPaddingY}
      skillLines={skillTreeData} halflineheight={halflineheight}
    />}
    <div className="skillTreeGrid">
      <SkillTreeBoxes skillPointData={p.skillPointData} setSkillPointData={p.setSkillPointData} page={p.page} points={p.points} cl={p.cl} setPoints={p.setPoints} GetData={p.GetData} skillTreeSkillData={skillTreeSkillData}/>
    </div>
  </div>
</div>
}

function TestPanel(p) {


let { BUILDID } = useParams()
let history = useHistory();
let location = useLocation();

const { GetData,LOGGEDINUSER,LOGGEDINHASH,BACKENDURL,APP_TITLE } = p

const [bpGraphMax,setbpGraphMax] = useState(1000)
const [hpGraphMax,sethpGraphMax] = useState(1000)
const [ppGraphMax,setppGraphMax] = useState(1000)
const [atkGraphMax,setatkGraphMax] = useState(1000)
const [defGraphMax,setdefGraphMax] = useState(1000)

const [author,setAuthor] = useState("Player")
const [buildName,setbuildName] = useState("Character")
const [className,setClassName] = useState("Ranger")
const [subclassName,setSubClassName] = useState("Force")
const [level,setLevel] = useState(20)
const [secondaryLevel,setsecondaryLevel] = useState(20)

const [effectPage,setEffectPage] = useState(1)
const [weaponPage,setWeaponPage] = useState(1)
const [statPage,setStatPage] = useState(1)

const [foodMenuWindowOpen,setFoodMenuWindowOpen] = useState(false)
const [classSelectWindowOpen,setClassSelectWindowOpen] = useState(false)
const [classSkillTreeWindowOpen,setClassSkillTreeWindowOpen] = useState(false)
const [treePage,setTreePage] = useState(1)
const [weaponSelectWindowOpen,setWeaponSelectWindowOpen] = useState(false)
const [armorSelectWindowOpen,setArmorSelectWindowOpen] = useState(false)

const [selectedWeapon,setSelectedWeapon] = useState([])
const [selectedArmor1,setSelectedArmor1] = useState([])
const [selectedArmor2,setSelectedArmor2] = useState([])
const [selectedArmor3,setSelectedArmor3] = useState([])
const [armorSlotSelection,setArmorSlotSelection] = useState(1)

const [classNameSetter,setClassNameSetter] = useState(0)

const [points,setPoints] = useState([])
const [skillPointData,setSkillPointData] = useState([])

function SaveData() {
  var saveObj = {
    level:level,
    secondaryLevel:secondaryLevel,
    weaponBaseName:selectedWeapon[WEAPON_WEAPON]?.name,
    weaponType:selectedWeapon[WEAPON_WEAPONTYPE]?.name,
    armor1Name:selectedArmor1?.name,
    armor2Name:selectedArmor2?.name,
    armor3Name:selectedArmor3?.name,
    points:points,
    skillPointData:skillPointData,
  }
  axios.post(BACKENDURL+"/submitBuild",{
    id:BUILDID,
    username:LOGGEDINUSER,
    pass:LOGGEDINHASH,
    creator:author,
    build_name:buildName,
    class1:className,
    class2:subclassName,
    data:JSON.stringify(saveObj),})
  .then((data)=>{
    const match=matchPath(location.pathname,{
      path:p.path,
      exact:true,
      strict:false
    })
    history.push(match.path.replace("/:BUILDID","")+"/"+data.data.id)
  })
}

function rarityCheck(v) {
  return v!==undefined?v.rarity!==undefined?" r"+v.rarity:"":""
}

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

useEffect(()=>{
  var keys = Object.keys(GetData("class"))
  var pointsArr = []
  var pointsDataArr = []
  for (var i=0;i<keys.length;i++) {
    pointsArr.push(0)
    pointsDataArr.push({})
    if (keys[i]===className) {
      setTreePage(i+1)
    }
  }
  setPoints(pointsArr)
  setSkillPointData(pointsDataArr)
},[className,GetData])

useEffect(()=>{
  axios.get(BACKENDURL+"/getBuild?id="+BUILDID)
    .then((data)=>{
      setAuthor(data.data.creator)
      setbuildName(data.data.build_name)
      setClassName(GetData("class",data.data.class1,"name",true))
      setSubClassName(GetData("class",data.data.class2,"name",true))
      var dat = JSON.parse(data.data.data)
      setLevel(dat.level)
      setsecondaryLevel(dat.secondaryLevel)
      setPoints(dat.points)
      setSkillPointData(dat.skillPointData)
      var dat1=p.GetData("weapon_existence_data")
      var weapon_type=GetData("weapon_type",dat.weaponType)
      var weapon=GetData("weapon",dat.weaponBaseName)
      var potential=GetData("potential",weapon.potential_id,undefined,true)
      var potential_all=GetData("potential_data")
      var potential_tooltip=[]
      for (var pot in potential_all) {
        if (pot.includes(potential.name)) {
          potential_tooltip.push(p.GetData("potential_data",pot))
        }
      }
      var existence_data = Array.isArray(dat1)?dat1.filter((weapon_existence_data)=>weapon_existence_data.weapon_type_id===weapon_type.id&&weapon_existence_data.weapon_id===weapon.id)[0]:undefined
      //console.log(JSON.stringify([weapon_type,weapon,potential,potential_tooltip,existence_data]))
      setSelectedWeapon([weapon_type,weapon,potential,potential_tooltip,existence_data])
      setSelectedArmor1(GetData("armor",dat.armor1Name))
      setSelectedArmor2(GetData("armor",dat.armor2Name))
      setSelectedArmor3(GetData("armor",dat.armor3Name))
    })
    .catch((err)=>{
      console.log(err.message)
    })
},[BUILDID,GetData,BACKENDURL,p])

//console.log(p.GetData("class",p.className,"icon"))

    return (<>
    
    <Helmet>
      <title>{"Test - "+APP_TITLE+(BUILDID?" Build #"+BUILDID:"")}</title>
    </Helmet>
<div className="main">
  <div className="containerA">



    <div className="box basicInfoBox">
      <div className="boxTitleBar">
      <h1>Basic Information</h1></div>
      <div className="basicInfo">
<div style={{gridArea:"author"}}>Author</div>
<div style={{gridArea:"build"}}>Build Name</div>
<div style={{gridArea:"class"}} onClick={()=>{setClassSelectWindowOpen(true)}}>Class</div>
<div style={{gridArea:"subclass"}} onClick={()=>{setClassSkillTreeWindowOpen(true)}}>Sub-Class</div>

<div style={{gridArea:"class2"}}><EditableClass editClass={0} setClassNameSetter={setClassNameSetter} GetData={p.GetData} setClassName={setClassName} name={className} setClassSelectWindowOpen={setClassSelectWindowOpen}></EditableClass></div>
<div style={{gridArea:"subclass2"}}><EditableClass editClass={1} setClassNameSetter={setClassNameSetter}  GetData={p.GetData} setClassName={setSubClassName} name={subclassName} setClassSelectWindowOpen={setClassSelectWindowOpen}></EditableClass></div>

<div style={{gridArea:"player",textAlign:"right"}}><EditBoxInput setData={setAuthor} data={author}/></div>
<div style={{gridArea:"character",textAlign:"right"}}><EditBoxInput setData={setbuildName} data={buildName}/></div>
<div style={{gridArea:"classlv",textAlign:"right"}}><EditBoxInput prefix="Lv." setData={setLevel} data={level} type="number"/></div>  
<div style={{gridArea:"subclasslv",textAlign:"right"}}><EditBoxInput prefix="Lv." setData={setsecondaryLevel} data={secondaryLevel} type="number"/></div>
      </div>
      <div className="statsInfo">
<div style={{gridArea:"bp"}}>Battle Power</div>
<div style={{gridArea:"hp"}}>HP</div>
<div style={{gridArea:"pp"}}>PP</div>
<div style={{gridArea:"atk"}}>Attack</div>
<div style={{gridArea:"def"}}>Defense</div>
<div style={{gridArea:"wepUp"}}>Weapon Up</div>
<div style={{gridArea:"res"}}>Ailment Resist.</div>
<div style={{gridArea:"dmgRes",border:"0"}}>Damage Resist.</div>

<div style={{gridArea:"bp2"}}>{p.bp}</div>
<div style={{gridArea:"hp2"}}>{p.hp}</div>
<div style={{gridArea:"pp2"}}>{p.pp}</div>
<div style={{gridArea:"atk2"}}>{p.statDisplayAtk}</div>
<div style={{gridArea:"def2"}}>{p.def}</div>
<div style={{gridArea:"wepUp2",color:"#ffb74c"}}><img alt="" src={process.env.PUBLIC_URL+"/icons/mel.png"} /> +{(p.weaponUp1*100).toFixed(1)}%<br /><img alt="" src={process.env.PUBLIC_URL+"/icons/tec.png"} /> +{(p.weaponUp3*100).toFixed(1)}%</div>
<div style={{gridArea:"res2"}}><img alt="" src={process.env.PUBLIC_URL+"/icons/status/burn.png"} /> {(p.burnResist*100).toFixed(1)}%<br /><img alt="" src={process.env.PUBLIC_URL+"/icons/status/shock.png"} /> {(p.shockResist*100).toFixed(1)}%<br /><img alt="" src={process.env.PUBLIC_URL+"/icons/status/panic.png"} /> {(p.panicResist*100).toFixed(1)}%<br /><img alt="" src={process.env.PUBLIC_URL+"/icons/status/stun.png"} /> {(p.stunResist*100).toFixed(1)}%<br /></div>
<div style={{gridArea:"dmgRes2",border:"0"}}>{(p.damageResist*100).toFixed(1)}%</div>

<div style={{gridArea:"bpGraph"}}><div className="barGraph"><span className="barOverlay" style={{background:"linear-gradient(90deg,transparent 0% "+((p.bp/bpGraphMax)*100)+"%,black "+((p.bp/bpGraphMax)*100)+"%)"}}>&nbsp;</span></div></div>
<div style={{gridArea:"hpGraph"}}><div className="barGraph"><span className="barOverlay" style={{background:"linear-gradient(90deg,transparent 0% "+((p.hp/hpGraphMax)*100)+"%,black "+((p.hp/hpGraphMax)*100)+"%)"}}>&nbsp;</span></div></div>
<div style={{gridArea:"ppGraph"}}><div className="barGraph"><span className="barOverlay" style={{background:"linear-gradient(90deg,transparent 0% "+((p.pp/ppGraphMax)*100)+"%,black "+((p.pp/ppGraphMax)*100)+"%)"}}>&nbsp;</span></div></div>
<div style={{gridArea:"atkGraph"}}><div className="barGraph"><span className="barOverlay" style={{background:"linear-gradient(90deg,transparent 0% "+((p.statDisplayAtk/atkGraphMax)*100)+"%,black "+((p.statDisplayAtk/atkGraphMax)*100)+"%)"}}>&nbsp;</span></div></div>
<div style={{gridArea:"defGraph"}}><div className="barGraph"><span className="barOverlay" style={{background:"linear-gradient(90deg,transparent 0% "+((p.def/defGraphMax)*100)+"%,black "+((p.def/defGraphMax)*100)+"%)"}}>&nbsp;</span></div></div>
<div style={{gridArea:"wepUp3",color:"#ffb74c"}} ><div><img alt="" src={process.env.PUBLIC_URL+"/icons/rng.png"} /> +{(p.weaponUp2*100).toFixed(1)}%</div></div>
<div style={{gridArea:"res3"}}><div><img alt="" src={process.env.PUBLIC_URL+"/icons/status/freeze.png"} /> {(p.freezeResist*100).toFixed(1)}%<br /><img alt="" src={process.env.PUBLIC_URL+"/icons/status/blind.png"} /> {(p.blindResist*100).toFixed(1)}%<br /><img alt="" src={process.env.PUBLIC_URL+"/icons/status/poison.png"} /> {(p.poisonResist*100).toFixed(1)}%<br /></div></div>

      </div><section className="saveControls">
      <button onClick={()=>{SaveData()}}>Save Build</button>
      </section></div>


      <div className="box">
          <div className="boxTitleBar">
          <h1>Equip</h1></div>
          <div className="equipPalette">
<div onClick={()=>{setWeaponSelectWindowOpen(true)}} className="equipPaletteSlot"><h3>Weapons</h3><div className={"equipPaletteSlotWrapper"+rarityCheck(selectedWeapon[WEAPON_WEAPON])}><span>1</span><img alt="" className="r4" src={DisplayIcon(selectedWeapon[WEAPON_EXISTENCE_DATA]?.icon)} /></div></div>
                <div onClick={()=>{setArmorSlotSelection(1);setArmorSelectWindowOpen(true)}} className={"equipPaletteSlot"+rarityCheck(selectedArmor1)}><h3>Armor 1</h3><div className="equipPaletteSlotWrapper"><img alt="" className="r3" src={DisplayIcon(selectedArmor1.icon)} /></div></div>
                  <div onClick={()=>{setArmorSlotSelection(2);setArmorSelectWindowOpen(true)}} className={"equipPaletteSlot"+rarityCheck(selectedArmor2)}><h3>Armor 2</h3><div className="equipPaletteSlotWrapper"><img alt="" className="r3" src={DisplayIcon(selectedArmor2.icon)} /></div></div>
                  <div onClick={()=>{setArmorSlotSelection(3);setArmorSelectWindowOpen(true)}} className={"equipPaletteSlot"+rarityCheck(selectedArmor3)}><h3>Armor 3</h3><div className="equipPaletteSlotWrapper"><img alt="" className="r3" src={DisplayIcon(selectedArmor3.icon)} /></div></div>
                </div>
              </div>




      </div>
      <div className="containerB">
          <div className="box equipWindow">
            <div className="boxTitleBar">
              <h1>Equipped Weapon</h1></div>
            <h2 className="viewedEquipName rifle">{GetSpecialWeaponName(selectedWeapon)}+40</h2>
            <PageControl pages={3} currentPage={weaponPage} setCurrentPage={setWeaponPage}>Edit Details</PageControl>
            {weaponPage === 1 ?

<>
<div className="itemDetailsGrid">
<div className={"itemDetailsIcon"+rarityCheck(selectedWeapon[WEAPON_WEAPON])}><img alt="" src={DisplayIcon(selectedWeapon[WEAPON_EXISTENCE_DATA]?.icon)} /></div>
<div className="itemDetailsProperties">
<div className="itemDetailsPropertiesWrapper">

<div style={{gridArea:"rarity"}}>Rarity</div>
<div style={{gridArea:"stars"}}className={rarityCheck(selectedWeapon[WEAPON_WEAPON])}><div className="itemRarityWrapper">-</div></div>

<div style={{gridArea:"attack"}}>Attack</div>
<div style={{gridArea:"attackDisplay"}}>282</div>

<div style={{gridArea:"element"}}>Element</div>
<div style={{gridArea:"elementDisplay"}}>-</div>

<div style={{gridArea:"conditions"}}>Equip Conditons</div>
<div style={{gridArea:"conditionsDisplay"}}>Lv.15 (Current Lv.20)</div>

</div></div>
<div className="itemAbility"><div className="itemPotential"><span className="pot">Soulspring Unit Lv.3</span></div><div className="itemFixa"><span className="fixa">Fixa Attack Lv.3</span></div></div>
<div className="itemDetailsAugment">
<span className="aug">Augment</span>
<div className="itemDetailsAugmentWrapper">

<div><span>Precision III</span></div>
<div></div>
<div></div>
<div></div>

</div>
</div>
</div>



</>

            :weaponPage === 3 ?
              <div className="equipDetails">
                <div className="equipAugs">
                  <h3>Ability Details</h3>
                  <ul>
                    <li><div className="equipAugsExpand tooltip"><img alt="" src="./icons/aug_plus.png" /><span>Potency +20%/<br />Critical Hit Rage +15% for 30 seconds after a successful sidestep</span></div><span className="pot">Dynamo Unit Lv.3</span></li>
                    <li><div className="equipAugsExpand tooltip"><img alt="" src="./icons/aug_plus.png" /><span>Potency +4%</span></div><span className="fixa">Fixa Attack Lv.3</span></li>
                    <li><div className="equipAugsExpand tooltip"><img alt="" src="./icons/aug_plus.png" /><span>PP +5<br />Ranged Weapon Potency +2.0%</span></div><span className="aug">Pettas Soul II</span></li>
                    <li><div className="equipAugsExpand tooltip"><img alt="" src="./icons/aug_plus.png" /><span>HP -10, Potency +1.5%,<br />Potency Floor Increase +1.5%<br />Damage Resistance -1.5%</span></div><span className="aug">Alts Secreta II</span></li>
                    <li><div className="equipAugsExpand tooltip"><img alt="" src="./icons/aug_plus.png" /><span>HP +10<br />Ranged Weapon Potency +2.0%</span></div><span className="aug">Gigas Precision II</span></li>
                    <li><div className="equipAugsExpand tooltip"><img alt="" src="./icons/aug_plus.png" /><span>Ranged Weapon Potency +2.0%</span></div><span className="aug">Precision III</span></li>
                    <li><img alt="" src="./icons/aug_plus.png" /></li>
                  </ul>
                </div>
                <div className="pr">
                  <h3>Stat Adjustment</h3>
                  <ul>
                    <li>Enhancement Lv.&emsp;<span>+35</span></li>
                    <li>Multi-Weapon&emsp;<span>-</span></li>
                    <li>Element&emsp;<span>-</span></li>
                  </ul>
                </div>
              </div>
              :
              <>hi2</>
            }


          </div>




          <div className="box">
            <div className="boxTitleBar">
              <h1>To Do List</h1></div>
            <dl className="toDoList">
              <dt>UI</dt>
                <dd className="half">Grids. Grids everywhere.</dd>
                <dd>Finish "Item Details" for Weapons/Armor</dd>
                <dd className="half">Class Skill Window Mobile View</dd>
                <dd>Enemy Stats Box</dd>
                <dd className="check">Food/Buffs Menu</dd>
                <dd className="check">Get all the fckn icons</dd>
              <dt>Functionality</dt>
                <dd>Food/Buffs Menu</dd>
                <dd>Augments</dd>
                <dd className="check">Save/Load Build</dd>
                <dd>fOrMuLaS</dd>
              <dt>Data</dt>
                <dd className="half">Skill Trees</dd>
                <dd>Everything tbh</dd>
            </dl>
          </div>








      </div>
      <div className="containerC">


      <div className="box">
      <div className="boxTitleBar">
      <h1>Current Effects</h1></div>
      <PageControl pages={2} currentPage={effectPage} setCurrentPage={setEffectPage}/>
      {effectPage===1?<><h3>Effect Name</h3><ul className="infoBuffs"><li onClick={()=>{setFoodMenuWindowOpen(true)}}>Food Boost Effect
      
        
          
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
          </li></ul></>:<></>
      }
      </div>
      <div className="box">
      <div className="boxTitleBar">
      <h1>Damage Stats</h1></div>
      <PageControl pages={3} currentPage={statPage} setCurrentPage={setStatPage}/>
      <table>
        <tbody>
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
              <td>Critical</td>
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
              <td>Critical</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Effective</td>
              <td><span className="ye">-</span></td>
            </tr>
            </>
          }
        </tbody>
      </table>
    </div>
  </div>
</div>

<ClassSelectorWindow class={className} subClass={subclassName} setClassName={setClassName} setEditClass={setClassNameSetter} editClass={classNameSetter} setSubClassName={setSubClassName} modalOpen={classSelectWindowOpen} setModalOpen={setClassSelectWindowOpen} GetData={p.GetData}/>
      <Modal ariaHideApp={false} isOpen={classSkillTreeWindowOpen} onRequestClose={() => { setClassSkillTreeWindowOpen(false) }} shouldFocusAfterRender={true} shouldCloseOnOverlayClick={true} shouldCloseOnEsc={true} className="modal" overlayClassName="modalOverlay">
        <div className="box skillTreeBox">
          <div className="boxTitleBar">
            <h1>Class Skill Tree</h1>
            <div className="boxExit" onClick={() => { setClassSkillTreeWindowOpen(false) }}></div>
          </div>
          <PageControl pages={Object.keys(p.GetData("class")).length} pageNames={Object.keys(p.GetData("class")).map((cl)=>cl)} pageDisplay={Object.keys(p.GetData("class")).map((cl)=><><img className="boxMenuClassIcon" alt="" src={p.GetData("class",cl,"icon")}/> {cl}</>)} currentPage={treePage} setCurrentPage={setTreePage} />
          <SkillTreeContainer skillPointData={skillPointData} setSkillPointData={setSkillPointData} page={treePage} points={points} setPoints={setPoints} GetData={p.GetData} cl={Object.keys(p.GetData("class"))[treePage-1]}/>
          <div className="skillPoints"> 
            <div>Your Skill Points<span>{20-points[treePage-1]}</span></div>
            <div>SP<span></span>{points[treePage-1]}</div>
          </div>
          <div className="skillConfirm"><span>Confirm</span><span>Cancel</span></div>
        </div>
      </Modal>

<SelectorWindow title="Weapon Selection" modalOpen={weaponSelectWindowOpen} setModalOpen={setWeaponSelectWindowOpen} GetData={p.GetData}
  pageNames={["All","Rifle","Launcher","Rod","Talis"]}
  sortItems={["Standard Sort","Rarity","Attack","Potency"]}
  filter={true}
  dataFunction={()=>{
    var dat1=p.GetData("weapon_existence_data")
      return Array.isArray(dat1)?dat1.map((weapon_existence_data)=>{
        var weapon_type=p.GetData("weapon_type",weapon_existence_data.weapon_type_id,undefined,true)
        var weapon=p.GetData("weapon",weapon_existence_data.weapon_id,undefined,true)
        var potential=p.GetData("potential",weapon.potential_id,undefined,true)
        var potential_all=p.GetData("potential_data")
        var potential_tooltip=[]
        for (var pot in potential_all) {
          if (pot.includes(potential.name)) {
            potential_tooltip.push(p.GetData("potential_data",pot))
          }
        }
        return [weapon_type,weapon,potential,potential_tooltip,weapon_existence_data]
      }):[]
  }}
  filterFunction={(page,item)=>{
    switch (page) {
      case 2:return item[WEAPON_WEAPONTYPE].name==="Assault Rifle"
      case 3:return item[WEAPON_WEAPONTYPE].name==="Launcher"
      case 4:return item[WEAPON_WEAPONTYPE].name==="Rod"
      case 5:return item[WEAPON_WEAPONTYPE].name==="Talis"
      default:return true
    }
  }}
  searchFieldFunction={(searchText,item)=>searchText.length>0?(item[WEAPON_WEAPON].name.toLowerCase()+" "+item[WEAPON_WEAPONTYPE].name.toLowerCase()).includes(searchText.toLowerCase()):true}
  sortOrderFunction={(sort,itemA,itemB)=>{
    switch (sort) {
      case "Rarity":return itemB[1].rarity-itemA[1].rarity
      case "Attack":return itemB[1].atk-itemA[1].atk
      default:return 0
    }  
  }}
  displayFunction={(item)=>{
  return<div className={"itemWrapper r"+item[WEAPON_WEAPON].rarity}><div className="itemImgWrapper"><img alt="" src={DisplayIcon(item[WEAPON_EXISTENCE_DATA]?.icon)} /></div><div className="itemNameWrapper rifle">{GetSpecialWeaponName(item)}</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">{item[WEAPON_WEAPON].atk}</span>
    
    <ExpandTooltip id={"mouseover-tooltip"+item[WEAPON_WEAPONTYPE].id+"_"+item[WEAPON_WEAPON].id+"_"+item[WEAPON_POTENTIAL].id+"_"+item[WEAPON_POTENTIAL_TOOLTIP].id} tooltip={<>{item[WEAPON_POTENTIAL_TOOLTIP].map((pot,i)=><React.Fragment key={i}>{(i!==0)&&<br/>}{pot.name}: {pot.description?pot.description.split("\\n").map((it,ii)=><React.Fragment key={ii}>{it}<br/> </React.Fragment>):<React.Fragment key={i}/>}</React.Fragment>)}</>}>

    <span className="pot">{item[WEAPON_POTENTIAL].name}</span>
    </ExpandTooltip></div></div>}}
  />
  
<SelectorWindow title={"Armor Selection - Slot "+armorSlotSelection} modalOpen={armorSelectWindowOpen} setModalOpen={setArmorSelectWindowOpen} GetData={p.GetData}
  pageNames={[]}
  sortItems={["Standard Sort","Rarity","HP","PP","Melee Potency","Range Potency","Tech Potency"]}
  filter={true}
  dataFunction={()=>{
    var dat1=p.GetData("armor")
      return typeof dat1==="object"&&dat1!==null?Object.keys(dat1).map((armor)=>{
        return dat1[armor]
      }):[]
  }}
  filterFunction={(page,item)=>item.slot===armorSlotSelection}
  searchFieldFunction={(searchText,item)=>searchText.length>0?item.name.toLowerCase().includes(searchText.toLowerCase()):true}
  sortOrderFunction={(sort,itemA,itemB)=>{
    switch (sort) {
      case "Rarity":return itemB.rarity-itemA.rarity
      case "HP":return itemB.hp-itemA.hp
      case "PP":return itemB.pp-itemA.pp
      case "Melee Potency":return itemB.mel_dmg-itemA.mel_dmg
      case "Range Potency":return itemB.rng_dmg-itemA.rng_dmg
      case "Tech Potency":return itemB.tec_dmg-itemA.tec_dmg
      default:return 0
    }  
  }}
  displayFunction={(item)=>{
  return <div className={"itemWrapper r"+item.rarity} onClick={()=>{
    switch(armorSlotSelection) {
      case 1:setSelectedArmor1(item);break;
      case 2:setSelectedArmor2(item);break;
      case 3:setSelectedArmor3(item);break;
      default:setSelectedArmor1(item)
    }
    setArmorSelectWindowOpen(false)}}>
          <div className="itemImgWrapper"><img alt="" src={DisplayIcon(item?.icon)} /></div>
          <div className="itemNameWrapper rifle">{item.name}</div>
          <div className="itemRarityWrapper" style={{gridArea:"rarity"}}>&nbsp;</div>
          <div className="itemPropertiesWrapper"><span className="atk">{item.def}</span></div>
        </div>
      }}
  />

<SelectorWindow title={"Food Menu"} modalOpen={foodMenuWindowOpen} setModalOpen={setFoodMenuWindowOpen} GetData={p.GetData}>

<div className="itemWrapperActive r1"><div className="itemImgWrapper"><img alt="" src={DisplayIcon("icons/food/aelio_meat.png")} /></div><div className="itemNameWrapper meat">XXXL Super Duper Extra Crispy Delicious Sweet Mouth-Watering Meat</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">9999</span><span className="pot">Indomitable Unit</span></div><div className="itemControlsWrapper"><span>-</span><span>0</span><span>+</span></div></div>
<div className="itemWrapper r2"><div className="itemImgWrapper"><img alt="" src={DisplayIcon("icons/food/light_aelio_mushroom.png")} /></div><div className="itemNameWrapper meat">Potato 2</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">9999</span><span className="pot">Indomitable Unit</span></div><div className="itemControlsWrapper"><span>-</span><span>0</span><span>+</span></div></div>
<div className="itemWrapperActive r3"><div className="itemImgWrapper"><img alt="" src={DisplayIcon("icons/food/robust_aelio_lobster.png")} /></div><div className="itemNameWrapper meat">Dog with Claws</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">9999</span><span className="pot">Indomitable Unit</span></div><div className="itemControlsWrapper"><span>-</span><span>0</span><span>+</span></div></div>
<div className="itemWrapperActive r4"><div className="itemImgWrapper"><img alt="" src={DisplayIcon("icons/food/light_aelio_turban_shell.png")} /></div><div className="itemNameWrapper meat">If you put your ear to it you can hear the PSO2 lobby music</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">9999</span><span className="pot">Indomitable Unit</span></div><div className="itemControlsWrapper"><span>-</span><span>0</span><span>+</span></div></div>
<div className="itemWrapper r1"><div className="itemImgWrapper"><img alt="" src={DisplayIcon("icons/food/aelio_meat.png")} /></div><div className="itemNameWrapper meat">XXXL Super Duper Extra Crispy Delicious Sweet Mouth-Watering Meat</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">9999</span><span className="pot">Indomitable Unit</span></div><div className="itemControlsWrapper"><span>-</span><span>0</span><span>+</span></div></div>
<div className="itemWrapper r2"><div className="itemImgWrapper"><img alt="" src={DisplayIcon("icons/food/light_aelio_mushroom.png")} /></div><div className="itemNameWrapper meat">Potato 2</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">9999</span><span className="pot">Indomitable Unit</span></div><div className="itemControlsWrapper"><span>-</span><span>0</span><span>+</span></div></div>
<div className="itemWrapper r3"><div className="itemImgWrapper"><img alt="" src={DisplayIcon("icons/food/robust_aelio_lobster.png")} /></div><div className="itemNameWrapper meat">Dog with Claws</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">9999</span><span className="pot">Indomitable Unit</span></div><div className="itemControlsWrapper"><span>-</span><span>0</span><span>+</span></div></div>
<div className="itemWrapper r4"><div className="itemImgWrapper"><img alt="" src={DisplayIcon("icons/food/light_aelio_turban_shell.png")} /></div><div className="itemNameWrapper meat">If you put your ear to it you can hear the PSO2 lobby music</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">9999</span><span className="pot">Indomitable Unit</span></div><div className="itemControlsWrapper"><span>-</span><span>0</span><span>+</span></div></div>
<div className="itemWrapper r1"><div className="itemImgWrapper"><img alt="" src={DisplayIcon("icons/food/aelio_meat.png")} /></div><div className="itemNameWrapper meat">XXXL Super Duper Extra Crispy Delicious Sweet Mouth-Watering Meat</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">9999</span><span className="pot">Indomitable Unit</span></div><div className="itemControlsWrapper"><span>-</span><span>0</span><span>+</span></div></div>
<div className="itemWrapper r2"><div className="itemImgWrapper"><img alt="" src={DisplayIcon("icons/food/light_aelio_mushroom.png")} /></div><div className="itemNameWrapper meat">Potato 2</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">9999</span><span className="pot">Indomitable Unit</span></div><div className="itemControlsWrapper"><span>-</span><span>0</span><span>+</span></div></div>
<div className="itemWrapper r3"><div className="itemImgWrapper"><img alt="" src={DisplayIcon("icons/food/robust_aelio_lobster.png")} /></div><div className="itemNameWrapper meat">Dog with Claws</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">9999</span><span className="pot">Indomitable Unit</span></div><div className="itemControlsWrapper"><span>-</span><span>0</span><span>+</span></div></div>
<div className="itemWrapper r4"><div className="itemImgWrapper"><img alt="" src={DisplayIcon("icons/food/light_aelio_turban_shell.png")} /></div><div className="itemNameWrapper meat">If you put your ear to it you can hear the PSO2 lobby music</div><div className="itemRarityWrapper">&nbsp;</div><div className="itemPropertiesWrapper"><span className="atk">9999</span><span className="pot">Indomitable Unit</span></div><div className="itemControlsWrapper"><span>-</span><span>0</span><span>+</span></div></div>

</SelectorWindow>

</>
)
}

export default TestPanel;