import { SkillTree } from "./skillTree";

function SkillTreeEditor(p) {
    return <SkillTree strokeStyle="rgba(0,0,128,1)" lineWidth={3} lineDash={[]}
                    gridDimensionsX={6} gridDimensionsY={6} gridSizeX={80} gridSizeY={60} gridPaddingX={10} gridPaddingY={10}
                    skillLines={["□  □  ", //─   □
                                "└□─┘□□", //│ ├┤┼
                                " │  ││", //    
                                " │  □│", //┌ ┐ ┬
                                " □─□┼□", //└ ┘ ┴
                                "    □ "]}
                    />
}

export {SkillTreeEditor}