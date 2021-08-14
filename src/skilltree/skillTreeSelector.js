import { useEffect, useState } from 'react'

function SkillTreeSelector(p) {

    const [char,setChar] = useState(p.defaultValue)

    useEffect(()=>{
        p.callback(char,Number(p.x),Number(p.y))
    },[char])

    return <select onChange={(f)=>{setChar(f.currentTarget.value)}} style={{position:"absolute",left:p.ADJUSTMENT[0]+(p.x*p.gridSizeX+p.padX+p.gridSizeX/2),top:p.ADJUSTMENT[1]+(p.y*p.gridSizeY+p.padY+p.gridSizeY/2)}} value={char}>
        {[' ','─','│','□','┌','└','┐','┘','┬','┴','├','┤','┼'].map((ch)=>
            <option value={ch}>{ch}</option>)
        }
    </select>

}   

export {SkillTreeSelector}