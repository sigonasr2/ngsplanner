import { useEffect, useState } from 'react'

function SkillTreeSelector(p) {

    const [selectedSkill,setSelectedSkill] = useState(undefined)
    const [skillList,setSkillList] = useState([])

    useEffect(()=>{
        setSkillList(p.GetData("class_skill"))
    },[p.cl])

    return <>
        <select onChange={(f)=>{p.callback(f.currentTarget.value,Number(p.x),Number(p.y))}} style={{position:"absolute",left:p.ADJUSTMENT[0]+(p.x*p.gridSizeX+p.padX+p.gridSizeX/2),top:p.ADJUSTMENT[1]+(p.y*p.gridSizeY+p.padY+p.gridSizeY/2)}} value={p.defaultValue}>
            {[' ','─','│','□','┌','└','┐','┘','┬','┴','├','┤','┼'].map((ch)=>
                <option value={ch}>{ch}</option>)
            }
        </select>
        {p.defaultValue==='□'&&<select style={{width:"64px",position:"absolute",left:p.ADJUSTMENT[0]+(p.x*p.gridSizeX+p.padX+p.gridSizeX/2),top:p.ADJUSTMENT[1]+(p.y*p.gridSizeY+p.padY+p.gridSizeY/2)+28}} onChange={(f)=>{setSelectedSkill(f.currentTarget.value)}} value={selectedSkill}>
            {Object.keys((skillList)).filter((skill)=>skillList[skill].class_id===p.cl).map((skill)=><option value={skillList[skill].id}>{skillList[skill].name}</option>)}
        </select>}
    </>

}   

export {SkillTreeSelector}