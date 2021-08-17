import { useRef,useEffect,useState } from 'react';

function SkillTree(p) {
    const canvasRef = useRef(null)
    const [width,setWidth] = useState(0)
    const [height,setHeight] = useState(0)
  
    useEffect(() => {
      setWidth(p.gridSizeX*p.gridDimensionsX+p.gridPaddingX*(p.gridDimensionsX-1))
      setHeight(p.gridSizeY*Math.ceil(p.gridDimensionsY)+p.halflineheight*Math.floor(p.gridDimensionsY)+p.gridPaddingY*(p.gridDimensionsY-1))
    }, [p.halflineheight,p.skillLines,p.gridSizeX,p.gridSizeY,p.gridPaddingX,p.gridPaddingY,p.gridDimensionsX,p.gridDimensionsY])

    useEffect(()=>{
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      context.clearRect(0,0,width,height)
      context.fillStyle = '#AA6666'
      context.strokeStyle=p.strokeStyle
      context.lineWidth=p.lineWidth //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth
      context.setLineDash(p.lineDash) //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
      var y=0
      for (var line of p.skillLines) {
        var x=0
        for (var char of line.split('')) {
            var padX = x!==0?p.gridPaddingX*x:0
            var padY = y!==0?p.gridPaddingY*y:0
            switch (char) {
                case "─":context.beginPath();context.moveTo(x*p.gridSizeX+(padX)-p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX+p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.stroke();break;
                case "│":context.beginPath();context.moveTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)-p.gridPaddingY);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+p.gridSizeY+p.gridPaddingY);context.stroke();break;
                case "└":context.beginPath();context.moveTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)-p.gridPaddingY);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX+p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.stroke();break;
                case "┌":context.beginPath();context.moveTo(x*p.gridSizeX+(padX)+p.gridSizeX+p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+p.gridSizeY+p.gridPaddingY);context.stroke();break;
                case "┘":context.beginPath();context.moveTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)-p.gridPaddingY);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)-p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.stroke();break;
                case "┐":context.beginPath();context.moveTo(x*p.gridSizeX+(padX)-p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+p.gridSizeY+p.gridPaddingY);context.stroke();break;
                case "├":context.beginPath();context.moveTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)-p.gridPaddingY);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX+p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.stroke();context.beginPath();context.moveTo(x*p.gridSizeX+(padX)+p.gridSizeX+p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+p.gridSizeY+p.gridPaddingY);context.stroke();break;
                case "┤":context.beginPath();context.moveTo(x*p.gridSizeX+(padX)-p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+p.gridSizeY+p.gridPaddingY);context.stroke();context.beginPath();context.moveTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)-p.gridPaddingY);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)-p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.stroke();break;
                case "┬":context.beginPath();context.moveTo(x*p.gridSizeX+(padX)-p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+p.gridSizeY+p.gridPaddingY);context.stroke();context.beginPath();context.moveTo(x*p.gridSizeX+(padX)+p.gridSizeX+p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+p.gridSizeY+p.gridPaddingY);context.stroke();break;
                case "┴":context.beginPath();context.moveTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)-p.gridPaddingY);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX+p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.stroke();context.beginPath();context.moveTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)-p.gridPaddingY);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)-p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.stroke();break;
                case "┼":context.beginPath();context.moveTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)-p.gridPaddingY);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX/2,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+p.gridSizeY+p.gridPaddingY);context.moveTo(x*p.gridSizeX+(padX)-p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.lineTo(x*p.gridSizeX+(padX)+p.gridSizeX+p.gridPaddingX,Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY)+(y%2===1?p.halflineheight:p.gridSizeY)/2);context.stroke();break;
                case "□":context.fillRect(x*p.gridSizeX+(padX), Math.ceil(y/2)*p.gridSizeY+Math.ceil((y-1)/2)*p.halflineheight+(padY), p.gridSizeX, y%2===1?p.halflineheight:p.gridSizeY);break;
                default:
            }
            x++
        }
        y++
      }
    },[width,height,p.gridSizeX,p.gridSizeY,p.gridPaddingX,p.gridPaddingY,p.lineDash,p.lineWidth,p.skillLines,p.strokeStyle,p.halflineheight])
    
    return <canvas
    width={width}
    height={height} ref={canvasRef} {...p}>{p.children}</canvas>
}

export {SkillTree}