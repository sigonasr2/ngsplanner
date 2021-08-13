import { useRef,useEffect,useState } from 'react';
import { contextType } from 'react-modal';

function SkillTree(p) {
    const canvasRef = useRef(null)
    const [width,setWidth] = useState(0)
    const [height,setHeight] = useState(0)
  
    useEffect(() => {
      setWidth(p.gridSize[0]*p.gridDimensionsX+p.gridPadding[0]*(p.gridDimensionsX-1))
      setHeight(p.gridSize[1]*p.gridDimensionsY+p.gridPadding[1]*(p.gridDimensionsY-1))
    }, [p.skillLines,p.gridSize,p.gridPadding,p.gridDimensionsX,p.gridDimensionsY])

    useEffect(()=>{
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      context.clearRect(0,0,width,height)
      context.fillStyle = '#AA6666'
      /*for (var x=0;x<p.gridDimensions[0];x++) {
          for (var y=0;y<p.gridDimensions[1];y++) {
             var padX = x!==0?p.gridPadding[0]*x:0
             var padY = y!==0?p.gridPadding[1]*y:0
             context.fillRect(x*p.gridSize[0]+(padX), y*p.gridSize[1]+(padY), p.gridSize[0], p.gridSize[1])
          }
      }*/
      context.strokeStyle=p.strokeStyle
      context.lineWidth=p.lineWidth //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth
      context.setLineDash(p.lineDash) //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
      var y=0
      for (var line of p.skillLines) {
        var x=0
        for (var char of line.split('')) {
            var padX = x!==0?p.gridPadding[0]*x:0
            var padY = y!==0?p.gridPadding[1]*y:0
            switch (char) {
                case "─":{context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)-p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]+p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.stroke()}break;
                case "│":{context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)-p.gridPadding[1]);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]+p.gridPadding[1]);context.stroke()}break;
                case "└":{context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)-p.gridPadding[1]);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]+p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.stroke()}break;
                case "┌":{context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)+p.gridSize[0]+p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]+p.gridPadding[1]);context.stroke()}break;
                case "┘":{context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)-p.gridPadding[1]);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)-p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.stroke()}break;
                case "┐":{context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)-p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]+p.gridPadding[1]);context.stroke()}break;
                case "├":{context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)-p.gridPadding[1]);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]+p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.stroke();context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)+p.gridSize[0]+p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]+p.gridPadding[1]);context.stroke()}break;
                case "┤":{context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)-p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]+p.gridPadding[1]);context.stroke();context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)-p.gridPadding[1]);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)-p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.stroke()
                }break;
                case "┬":{context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)-p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]+p.gridPadding[1]);context.stroke();context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)+p.gridSize[0]+p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]+p.gridPadding[1]);context.stroke()}break;
                case "┴":{context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)-p.gridPadding[1]);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]+p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.stroke();context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)-p.gridPadding[1]);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)-p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.stroke()}break;
                case "┼":{context.beginPath();context.moveTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)-p.gridPadding[1]);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]/2,y*p.gridSize[1]+(padY)+p.gridSize[1]+p.gridPadding[1]);context.moveTo(x*p.gridSize[0]+(padX)-p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.lineTo(x*p.gridSize[0]+(padX)+p.gridSize[0]+p.gridPadding[0],y*p.gridSize[1]+(padY)+p.gridSize[1]/2);context.stroke()}break;
                case "□":{context.fillRect(x*p.gridSize[0]+(padX), y*p.gridSize[1]+(padY), p.gridSize[0], p.gridSize[1])}break;
            }
            x++
        }
        y++
      }
    },[width,height])
    
    return <canvas
    width={width}
    height={height} ref={canvasRef} {...p}/>
}

export {SkillTree}