import { useEffect,useState } from 'react'
import Class from './components/Class';
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import {HandThumbsUp} from 'react-bootstrap-icons'
import { DisplayIcon } from './DEFAULTS';
import { HashLink as Link } from 'react-router-hash-link';
const axios = require('axios');

function Build(p) {
  const {PANELPATHWBUILD} = p
  const {build} = p
  const {GetData} = p
  const buildData = build.data?build.data[0]==='{'?JSON.parse(build.data):{}:{}
  return <div>
        <br/>
        <Link to={PANELPATHWBUILD?.replace(":BUILDID",build.id)}>
          <div className="build">
            <div className="buildID">#{build.id}</div><h2 className="buildTitle">&nbsp;{build.build_name}</h2> <div className="buildAuthor">(Created by <img className="buildAvatar"/>{build.creator})</div>
            <div className="buildLikes"><HandThumbsUp/>{build.likes}</div>
            <br/>
            <div className="buildClass"><Class GetData={GetData} name={build.class1} useIDs hideName/><sub>{buildData?.level}</sub></div>
            <div className="buildClass"><Class GetData={GetData} name={build.class2} useIDs hideName/><sub>{buildData?.secondaryLevel}</sub></div>
            <div className="buildData">{build.created_on}</div>
            <br/>
            <div className="equipPalette buildPalette">
              <div className="equipPaletteSlot"><div className={"equipPaletteSlotWrapper r"+GetData("weapon",buildData.weaponBaseName,"rarity")}>
                <img className="buildImage" src={DisplayIcon(GetData("weapon_existence_data",buildData.weaponExistenceID,"icon",true))}/>
              </div></div>
              <div className="equipPaletteSlot"><div className={"equipPaletteSlotWrapper r"+GetData("armor",buildData.armor1Name,"rarity")}>
                <img className="buildImage" src={DisplayIcon(GetData("armor",buildData.armor1Name,"icon"))}/>
              </div></div>
              <div className="equipPaletteSlot"><div className={"equipPaletteSlotWrapper r"+GetData("armor",buildData.armor2Name,"rarity")}>
                <img className="buildImage" src={DisplayIcon(GetData("armor",buildData.armor2Name,"icon"))}/>
              </div></div>
              <div className="equipPaletteSlot"><div className={"equipPaletteSlotWrapper r"+GetData("armor",buildData.armor3Name,"rarity")}>
                <img className="buildImage" src={DisplayIcon(GetData("armor",buildData.armor3Name,"icon"))}/>
              </div></div>
            </div>
            {/*JSON.stringify(build)*/}
           </div>
          </Link>
        <br/>
      <br/>
    <hr/>
  </div>
}

function Builds(p) {

    const {GetData,BACKENDURL,PANELPATHWBUILD} = p
    const [builds,setBuilds] = useState([])
    const [sort,setSort] = useState("date_updated")
    const [filter,setFilter] = useState("")
    const [filter_type,setFilterType] = useState("author")
    const [page,setPage] = useState(0)
    const [finished,setFinished] = useState(false)
    const [totalPages,setTotalPages] = useState(0)


    useEffect(()=>{
        setFinished(false)
        setPage(0)
        axios.get(`${BACKENDURL}/getBuilds?sort_type=${sort}${filter_type!==""?`&filter_type=${filter_type}`:""}${filter_type!==""?`&filter=${encodeURI(filter)}`:""}${page!==0?`&offset=${page}`:""}`)
        .then((data)=>{
          setBuilds(data.data)
        })
        .catch((err)=>{

        })
        .finally(()=>{
          setFinished(true)
        })
    },[BACKENDURL,sort,filter_type,filter])

    useEffect(()=>{
        setFinished(false)
        axios.get(`${BACKENDURL}/getBuilds?sort_type=${sort}${filter_type!==""?`&filter_type=${filter_type}`:""}${filter_type!==""?`&filter=${encodeURI(filter)}`:""}${page!==0?`&offset=${page}`:""}`)
        .then((data)=>{
          setBuilds(data.data)
        })
        .catch((err)=>{

        })
        .finally(()=>{
          setFinished(true)
        })
    },[page])

    return <>
    <div className="box skillTreeBox">
          <div className="boxTitleBar">
            <h1>Builds List</h1>
          </div>
          <div className="itemBar">
            <div className="itemBarSort">
              Sort By:
              <select className="itemBarForm" value={sort} onChange={(f)=>{setSort(f.currentTarget.value)}}>
                {[
                  {name:"Last Updated",value:"date_updated"},
                  {name:"Alphabetical",value:"alphabetical"},
                  {name:"Creation Time",value:"date_created"},
                  {name:"Popularity",value:"popularity"},
                  {name:"Editor's Choice",value:"editors_choice"},
                  {name:"Author",value:"author"}].map((item)=><option key={item} value={item.value}>{item.name}</option>)}
              </select>
            </div>
            <div className="itemBarSort">
              <label for="filterForm">Filter By: </label>
              <select className="itemBarForm" id="filterForm" value={filter_type} onChange={(f)=>{setFilterType(f.currentTarget.value)}}>
                {[
                  {name:"Author",value:"author"},
                  {name:"Build Name",value:"build"},
                  {name:"Editor's Choice",value:"editors_choice"},
                  {name:"Class",value:"class1"},
                  {name:"Sub-Class",value:"class2"}].map((item)=><option key={item} value={item.value}>{item.name}</option>)}
              </select>
            </div>
            <div className="itemBarFilter">
              {<input className="itemBarForm" type="text" placeholder="Filter" value={filter} onChange={(f)=>{setFilter(f.currentTarget.value)}} />}
            </div>
          </div>
          <ReactPlaceholder showLoadingAnimation ready={finished} type="media" rows={32}>
            {builds.map((build)=><Build PANELPATHWBUILD={PANELPATHWBUILD} GetData={GetData} build={build}/>)}
          </ReactPlaceholder>
    </div></>
}

export default Builds;