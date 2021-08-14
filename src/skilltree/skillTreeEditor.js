import { SkillTree } from "./skillTree";
import { useEffect, useState } from "react";
import { SkillTreeSelector } from "./skillTreeSelector";
import axios from "axios";

function SkillTreeEditor(p) {

    const ADJUSTMENT = [-32,-32]

    const [classList,setClassList] = useState({})
    const [skillTreeData,setSkillTreeData] = useState({})
    const [cl,setCl] = useState(0)
    const [lineColor,setLineColor] = useState("#000000")
    const [lineWidth,setLineWidth] = useState(3)
    const [dimensionX,setDimensionX] = useState(6)
    const [dimensionY,setDimensionY] = useState(6)
    const [gridSizeX,setGridSizeX] = useState(80)
    const [gridSizeY,setGridSizeY] = useState(60)
    const [gridPaddingX,setGridPaddingX] = useState(10)
    const [gridPaddingY,setGridPaddingY] = useState(10)
    const [renderedInputs,setRenderedInputs] = useState([])
    const [skillLines,setSkillLines] = useState([])

    useEffect(()=>{
        setClassList(p.GetData("class",undefined,undefined,true))
        setSkillTreeData(p.GetData("skill_tree_data",undefined,undefined,true))
    },[p.GetData])

    useEffect(()=>{
        var keys = Object.keys(skillTreeData)
        for (var id of keys) {
            //console.log(cl+"/"+skillTreeData[id].class_id)
            if (skillTreeData[id].class_id==cl) {
                var data = skillTreeData[id].data.split(',')
                setSkillLines(data)
                setDimensionX(data[0].length)
                setDimensionY(data.length)
                setLineColor(skillTreeData[id].line_color)
            }
        }
    },[skillTreeData,cl])

    useEffect(()=>{
        setCl(Object.keys(classList)[0])
    },[classList])

    useEffect(()=>{
        var skillTreeString = [...skillLines]

        while (skillTreeString.length<dimensionY) {
            skillTreeString.push(" ".repeat(dimensionX))
        }

        for (var line=0;line<skillTreeString.length;line++) {
            if (skillTreeString[line].length<dimensionX) {
                skillTreeString[line]+=" ".repeat(dimensionX-skillTreeString[line].length)
            }
        }
        setSkillLines(skillTreeString)
    },[dimensionX,dimensionY])

    useEffect(()=>{
        var controls = []
        for (var y=0;y<skillLines.length;y++) {
            for (var x=0;x<skillLines[y].length;x++) {
                var padX = x!==0?gridPaddingX*x:0
                var padY = y!==0?gridPaddingY*y:0
                if (y<dimensionY&&x<dimensionX) {
                    controls.push(<SkillTreeSelector GetData={p.GetData} cl={Number(cl)} defaultValue={skillLines[y][x]} callback={(char,x,y)=>{
                            var string = [...skillLines]
                            var stringLine = string[y].split('')
                            stringLine[x] = char
                            string[y] = stringLine.join('')
                            setSkillLines(string)
                        }
                    } ADJUSTMENT={ADJUSTMENT} x={x} y={y} gridSizeX={gridSizeX} gridSizeY={gridSizeY} padX={padX} padY={padY}/>)
                }
            }
        }
        setRenderedInputs(controls)
    },[skillLines,gridSizeX,gridSizeY,gridPaddingX,gridPaddingY,cl,dimensionY,dimensionX])

    return <>
            <label for="classSelect">Class Select:</label><select id="classSelect" value={cl} onChange={(f)=>{setCl(f.currentTarget.value)}}>
                {Object.keys(classList).map((c)=><option value={c}>{c+" - "+classList[c].name}</option>)}
            </select>
            <div style={{width:"800px",position:"relative",left:"300px"}}>
            <SkillTree strokeStyle={lineColor} lineWidth={lineWidth} lineDash={[]}
                gridDimensionsX={dimensionX} gridDimensionsY={dimensionY} gridSizeX={gridSizeX} gridSizeY={gridSizeY} gridPaddingX={gridPaddingX} gridPaddingY={gridPaddingY}
                skillLines={skillLines}
                />
            {renderedInputs.map((control)=>control)}
            <input type="color" value={lineColor} onChange={(f)=>{setLineColor(f.currentTarget.value)}}/>
            <input type="number" value={lineWidth} onChange={(f)=>{setLineWidth(f.currentTarget.value)}}/>
            <input type="number" value={dimensionX} onChange={(f)=>{setDimensionX(f.currentTarget.value)}}/>
            <input type="number" value={dimensionY} onChange={(f)=>{setDimensionY(f.currentTarget.value)}}/>
            <input type="number" value={gridSizeX} onChange={(f)=>{setGridSizeX(f.currentTarget.value)}}/>
            <input type="number" value={gridSizeY} onChange={(f)=>{setGridSizeY(f.currentTarget.value)}}/>
            <input type="number" value={gridPaddingX} onChange={(f)=>{setGridPaddingX(f.currentTarget.value)}}/>
            <input type="number" value={gridPaddingY} onChange={(f)=>{setGridPaddingY(f.currentTarget.value)}}/>

            </div>
            </>
}

export {SkillTreeEditor}