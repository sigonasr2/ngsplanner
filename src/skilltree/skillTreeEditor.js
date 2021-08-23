import { SkillTree } from "./skillTree";
import React, { useEffect,useState,useMemo,useCallback } from "react";
import { SkillTreeSelector } from "./skillTreeSelector";
import axios from "axios";

function SkillTreeEditor(p) {
    const { GetData } = p

    const ADJUSTMENT = useMemo(()=>[-32,32],[])

    const [firstLoad,setFirstLoad] = useState(true)

    const [classList,setClassList] = useState({})
    const [skillTreeData,setSkillTreeData] = useState({})
    const [cl,setCl] = useState(-1)
    const [lineColor,setLineColor] = useState("#000000")
    const [lineWidth,setLineWidth] = useState(3)
    const [dimensionX,setDimensionX] = useState(6)
    const [dimensionY,setDimensionY] = useState(6)
    const [gridSizeX,setGridSizeX] = useState(80)
    const [gridSizeY,setGridSizeY] = useState(60)
    const [gridPaddingX,setGridPaddingX] = useState(10)
    const [gridPaddingY,setGridPaddingY] = useState(10)
    const [renderedInputs,setRenderedInputs] = useState([])
    const [skillLinesTemp,setSkillLinesTemp] = useState([])
    const [skillLines,setSkillLines] = useState([])
    const [skillData,setSkillData] = useState([])
    const [message,setMessage] = useState("")
    const [loading,setLoading] = useState(false)
    const [halflineheight,setHalfLineHeight] = useState(60)

    const GetSkills = useCallback((x,y)=>{
        var filtered = skillData.filter((skill)=>Number(skill.split(",")[0])===Number(x)&&Number(skill.split(",")[1])===Number(y))
        if  (filtered.length>0) {
            return filtered[0]
        } else {
            return ""
        }
    },[skillData])

    function SaveSkillTrees() {
        axios.post(p.BACKENDURL+"/saveskilltree",{
            pass:p.password,
            data:skillLines.slice(0,dimensionY).map((str)=>str.slice(0,dimensionX)).join(','),
            skill_data:skillData.join(';'),
            line_color:lineColor,
            line_width:lineWidth,
            gridsizex:gridSizeX,
            gridsizey:gridSizeY,
            gridpaddingx:gridPaddingX,
            gridpaddingy:gridPaddingY,
            halflineheight:halflineheight,
            class_id:cl
        })
        .then((data)=>{
            if (data.data==="OK!") {
                setMessage(<span style={{color:"green"}}>{"Successfully saved skill tree for "+p.GetData("class",undefined,undefined,true)[cl].name+"!"}</span>)
                p.setUpdate(true)
            }
        })
        .catch((err)=>{
            setMessage(<span style={{color:"red"}}>{err.message}</span>)
        })
        .then(()=>{
            setLoading(false)
        })
    }

    useEffect(()=>{
        setClassList(GetData("class",undefined,undefined,true))
        setSkillTreeData(GetData("skill_tree_data",undefined,undefined,true))
    },[GetData])

    useEffect(()=>{
        var keys = Object.keys(skillTreeData)
        var found = false
        for (var id of keys) {
            //console.log(cl+"/"+skillTreeData[id].class_id)
            if (Number(skillTreeData[id].class_id)===Number(cl)) {
                var data = skillTreeData[id].data?.split(',')
                var skill = skillTreeData[id].skill_data?.split(';')
                setSkillLinesTemp(data)
                setSkillData(skill)
                setDimensionX(data[0].length)
                setDimensionY(data.length)
                setLineColor(skillTreeData[id].line_color)
                setLineWidth(skillTreeData[id].line_width)
                setGridSizeX(skillTreeData[id].gridsizex)
                setGridSizeY(skillTreeData[id].gridsizey)
                setGridPaddingX(skillTreeData[id].gridpaddingx)
                setGridPaddingY(skillTreeData[id].gridpaddingy)
                setHalfLineHeight(skillTreeData[id].halflineheight)
                found=true
            }
        }
        if (!found) {
            setSkillLinesTemp([])
            setSkillData([])
            setDimensionX(6)
            setDimensionY(6)
        }
    },[skillTreeData,cl])

    useEffect(()=>{
        if (firstLoad) {
            setCl(Number(Object.keys(classList)[0]))
            setFirstLoad(false)
        }
    },[classList,firstLoad])

    useEffect(()=>{
        var skillTreeString = [...skillLinesTemp]

        while (skillTreeString.length<dimensionY) {
            skillTreeString.push(" ".repeat(dimensionX))
        }

        for (var line=0;line<skillTreeString.length;line++) {
            if (skillTreeString[line].length<dimensionX) {
                skillTreeString[line]+=" ".repeat(dimensionX-skillTreeString[line].length)
            }
        }
        setSkillLines(skillTreeString)
    },[dimensionX,dimensionY,skillLinesTemp])

    useEffect(()=>{
        var controls = []
        for (var y=0;y<skillLines.length;y++) {
            for (var x=0;x<skillLines[y].length;x++) {
                var padX = x!==0?gridPaddingX*x:0
                var padY = y!==0?gridPaddingY*y:0
                if (y<dimensionY&&x<dimensionX) {
                    controls.push(<SkillTreeSelector GetData={GetData} cl={Number(cl)} defaultValue={skillLines[y][x]} callback={(char,x,y)=>{
                            var string = [...skillLines]
                            var stringLine = string[y].split('')
                            var newSkillData = [...skillData]
                            stringLine[x] = char
                            if (char!=="□") {
                                for (var s in newSkillData) {
                                    var split = newSkillData[s].split(',')
                                    if (Number(split[0])===Number(x)&&Number(split[1])===Number(y)) {
                                        newSkillData[s]=""
                                        setSkillData(newSkillData)
                                        break;
                                    }
                                }
                            }
                            string[y] = stringLine.join('')
                            setSkillLinesTemp(string)
                        }
                    } skill={GetSkills(x,y)} skillCallback={(x,y,skill)=>{
                        var newSkillData = [...skillData]
                        var found=false
                        var newSkill = x+","+y+","+skill
                        for (var s in newSkillData) {
                            var split = newSkillData[s].split(',')
                            if (Number(split[0])===Number(x)&&Number(split[1])===Number(y)) {
                                newSkillData[s]=newSkill
                                found=true
                                break;
                            }
                        }
                        if (!found) {
                            newSkillData.push(newSkill)
                        }
                        setSkillData(newSkillData)
                    }} ADJUSTMENT={ADJUSTMENT} x={x} y={y} gridSizeX={gridSizeX} gridSizeY={gridSizeY} padX={padX} padY={padY} halflineheight={halflineheight}/>)
                }
            }
        }
        setRenderedInputs(controls)
    },[skillLines,gridSizeX,gridSizeY,gridPaddingX,gridPaddingY,cl,dimensionY,dimensionX,skillData,halflineheight,GetData,ADJUSTMENT,GetSkills])

    return <>
            {loading?<img src={process.env.PUBLIC_URL+"/spinner.gif"} alt=""/>:<>
            <h2>{message}</h2>
            <label htmlFor="classSelect">Class Select:</label><select id="classSelect" value={Number.isNaN(Number(cl))?"?":cl} onChange={(f)=>{setCl(Number(f.currentTarget.value))}}>
                <option value=""></option>
                {Object.keys(classList).map((c)=><option key={classList[c].name} value={c}>{c+" - "+classList[c].name}</option>)}
            </select>
            <br/>
            <br/>
            {p.GetData("class",undefined,undefined,true)[cl]?.name&&<button onClick={()=>{
                setLoading(true)
                SaveSkillTrees()
            }}>{"Save "+p.GetData("class",undefined,undefined,true)[cl]?.name+" Skill Tree"}</button>}
            <div style={{width:"800px",position:"relative",left:"300px"}}>
            <SkillTree strokeStyle={lineColor} lineWidth={lineWidth} lineDash={[]}
                gridDimensionsX={dimensionX} gridDimensionsY={dimensionY} gridSizeX={gridSizeX} gridSizeY={gridSizeY} gridPaddingX={gridPaddingX} gridPaddingY={gridPaddingY}
                skillLines={skillLines} halflineheight={halflineheight}
                />
            {renderedInputs.map((control,i)=><React.Fragment key={i}>{control}</React.Fragment>)}
            <br/>
            <hr/>
            <br/>
            <label htmlFor="lineColor">Line Color:</label><input type="color" id="lineColor" value={lineColor} onChange={(f)=>{setLineColor(f.currentTarget.value)}}/><br/>
            <label htmlFor="lineWidth">Line Width:</label><input type="number" id="lineWidth" value={lineWidth} onChange={(f)=>{setLineWidth(f.currentTarget.value)}}/><br/>
            <label htmlFor="gridSizeX">Grid Size X:</label><input type="number" id="gridSizeX" value={dimensionX} onChange={(f)=>{setDimensionX(f.currentTarget.value)}}/><br/>
            <label htmlFor="gridSizeY">Grid Size Y:</label><input type="number" id="gridSizeY" value={dimensionY} onChange={(f)=>{setDimensionY(f.currentTarget.value)}}/><br/>
            <label htmlFor="subrowHeight">Sub-row Height:</label><input type="number" id="subrowHeight" value={halflineheight} onChange={(f)=>{setHalfLineHeight(f.currentTarget.value)}}/><br/>
            <label htmlFor="boxSizeX">Box Size X:</label><input type="number" id="boxSizeX" value={gridSizeX} onChange={(f)=>{setGridSizeX(f.currentTarget.value)}}/><br/>
            <label htmlFor="boxSizeY">Box Size Y:</label><input type="number" id="boxSizeY" value={gridSizeY} onChange={(f)=>{setGridSizeY(f.currentTarget.value)}}/><br/>
            <label htmlFor="gridPaddingX">Grid Padding X:</label><input type="number" id="gridPaddingX" value={gridPaddingX} onChange={(f)=>{setGridPaddingX(f.currentTarget.value)}}/><br/>
            <label htmlFor="gridPaddingY">Grid Padding Y:</label><input type="number" id="gridPaddingY" value={gridPaddingY} onChange={(f)=>{setGridPaddingY(f.currentTarget.value)}}/><br/>

            </div></>}
        </>
}

export {SkillTreeEditor}