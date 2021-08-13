import { SkillTree } from "./skillTree";
import { useEffect, useState } from "react";

function SkillTreeEditor(p) {
    const [lineColor,setLineColor] = useState("#000000")
    const [lineWidth,setLineWidth] = useState(3)
    const [dimensionX,setDimensionX] = useState(6)
    const [dimensionY,setDimensionY] = useState(6)
    const [gridSizeX,setGridSizeX] = useState(80)
    const [gridSizeY,setGridSizeY] = useState(60)
    const [gridPaddingX,setGridPaddingX] = useState(10)
    const [gridPaddingY,setGridPaddingY] = useState(10)
    const [renderedInputs,setRenderedInputs] = useState([])

    useEffect(()=>{
        var controls = []
        for (var x=0;x<dimensionX;x++) {
            for (var y=0;y<dimensionY;y++) {
                //controls.push(<input style={{}}>)
            }
        }
    },[dimensionX,dimensionY,gridSizeX,gridSizeY,gridPaddingX,gridPaddingY])

    return <>
            <input style={{position:"absolute"}} type="color" value={lineColor} onChange={(f)=>{setLineColor(f.currentTarget.value)}}/>
            <input type="number" value={lineWidth} onChange={(f)=>{setLineWidth(f.currentTarget.value)}}/>
            <input type="number" value={dimensionX} onChange={(f)=>{setDimensionX(f.currentTarget.value)}}/>
            <input type="number" value={dimensionY} onChange={(f)=>{setDimensionY(f.currentTarget.value)}}/>
            <input type="number" value={gridSizeX} onChange={(f)=>{setGridSizeX(f.currentTarget.value)}}/>
            <input type="number" value={gridSizeY} onChange={(f)=>{setGridSizeY(f.currentTarget.value)}}/>
            <input type="number" value={gridPaddingX} onChange={(f)=>{setGridPaddingX(f.currentTarget.value)}}/>
            <input type="number" value={gridPaddingY} onChange={(f)=>{setGridPaddingY(f.currentTarget.value)}}/>
            <SkillTree strokeStyle={lineColor} lineWidth={lineWidth} lineDash={[]}
                gridDimensionsX={dimensionX} gridDimensionsY={dimensionY} gridSizeX={gridSizeX} gridSizeY={gridSizeY} gridPaddingX={gridPaddingX} gridPaddingY={gridPaddingY}
                skillLines={["□  □  ", //─   □
                            "└□─┘□□", //│ ├┤┼
                            " │  ││", //    
                            " │  □│", //┌ ┐ ┬
                            " □─□┼□", //└ ┘ ┴
                            "    □ "]}
                />
            </>
}

export {SkillTreeEditor}