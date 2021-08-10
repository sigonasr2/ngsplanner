const NICONICONII = process.env.PUBLIC_URL+"/icons/nicodotpng.png.png"

function DisplayIcon(icon) {
    //console.log(icon)
    return icon?process.env.PUBLIC_URL+icon:NICONICONII
}

export {NICONICONII,DisplayIcon};