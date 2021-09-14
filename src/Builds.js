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
    const [filter_type,setFilterType] = useState("")
    const [page,setPage] = useState(0)
    const [finished,setFinished] = useState(false)


    useEffect(()=>{
        axios.get(`${BACKENDURL}/getBuilds?sort_type=${sort}${filter_type!==""?`&filter_type=${filter_type}`:""}${filter_type!==""?`&filter=${encodeURI(filter)}`:""}${page!==0?`&offset=${page}`:""}`)
        .then((data)=>{
          setBuilds(data.data)
          setFinished(true)
        })
    },[BACKENDURL,sort,filter_type,filter,page])

    return <>
    <div className="box skillTreeBox">
          <div className="boxTitleBar">
            <h1>Builds List</h1>
          </div>
          <ReactPlaceholder showLoadingAnimation ready={finished} type="media" rows={32}>
            {builds.map((build)=><Build PANELPATHWBUILD={PANELPATHWBUILD} GetData={GetData} build={build}/>)}
          </ReactPlaceholder>
    </div></>
}

export default Builds;