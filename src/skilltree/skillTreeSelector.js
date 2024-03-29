import { useEffect, useState } from 'react'

function SkillTreeSelector(p) {

    const { GetData } = p

    const [skillList,setSkillList] = useState([])

    useEffect(()=>{
        setSkillList(GetData("class_skill"))
    },[p.cl,GetData])

    return <>
        <select onChange={(f)=>{p.callback(f.currentTarget.value,Number(p.x),Number(p.y))}} style={{position:"absolute",left:p.ADJUSTMENT[0]+(p.x*p.gridSizeX+p.padX+p.gridSizeX/2),top:p.ADJUSTMENT[1]+((p.y/2)*p.gridSizeY+(p.y/2-1)*p.halflineheight+p.padY+(p.y===0?p.halflineheight:p.gridSizeY)/2)}} value={p.defaultValue}>
            {[' ','─','│','□','┌','└','┐','┘','┬','┴','├','┤','┼'].map((ch)=>
                <option value={ch} key={ch}>{ch}</option>)
            }
        </select>
        {p.defaultValue==='□'&&<select style={{width:"64px",position:"absolute",left:p.ADJUSTMENT[0]+(p.x*p.gridSizeX+p.padX+p.gridSizeX/2),top:p.ADJUSTMENT[1]+((p.y/2)*p.gridSizeY+(p.y/2-1)*p.halflineheight+p.padY+(p.y===0?p.halflineheight:p.gridSizeY)/2)+28}} onChange={(f)=>{p.skillCallback(p.x,p.y,f.currentTarget.value)}} value={p.skill.split(",")[2]}>
            {["",...Object.keys((skillList)).filter((skill)=>skillList[skill].class_id===p.cl)].map((skill)=><option key={skill} value={(skillList[skill])?skillList[skill].id:""}>{(skillList[skill])?skillList[skill].name:""}</option>)}
        </select>}
    </>

}   

export {SkillTreeSelector}