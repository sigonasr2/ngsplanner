import { SkillTree } from "./skillTree";
import { useState } from "react";

function SkillTreeEditor(p) {
    const [lineColor,setLineColor] = useState("#000000")

    return <>
            <input type="color" value={}/><SkillTree strokeStyle="rgba(0,0,128,1)" lineWidth={3} lineDash={[]}
                gridDimensionsX={6} gridDimensionsY={6} gridSizeX={80} gridSizeY={60} gridPaddingX={10} gridPaddingY={10}
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