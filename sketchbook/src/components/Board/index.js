import { useEffect, useLayoutEffect, useRef } from "react";

import { useSelector,useDispatch } from "react-redux";


const Board =()=>{


    const canvasRef = useRef(null)
    //to draw
    const shouldDraw = useRef(false)

    const activeMenuItem = useSelector(state => state.menu.activeMenuItem)

    const {color,size} = useSelector(state => state.toolbox[activeMenuItem])

    useEffect(()=>{
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        // to change brush and color change
        const changeConfig=()=>{
            context.strokeStyle = color;
            context.lineWidth = size;
        }

      
       
        changeConfig();

    },[color,size])

    //called only once for mounting
    //change this useEffect to useLayoutEffect so that is renders before useEffect
    useLayoutEffect(()=>{
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        //when mounting
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

          //add event listner to draw

          const handleMouseDown = (e) =>{

            shouldDraw.current = true;
            //saying canvas to get ready and it needed moveTo to tell from where start moving
            context.beginPath()
            //we are going start from X , Y
            context.moveTo(e.clientX,e.clientY)
            
          }
  
          const handleMouseMove = (e) =>{
            //if mouse is not pressed
            if(!shouldDraw.current)
            {
                return
            }
            //to draw
            context.lineTo(e.clientX,e.clientY)
            context.stroke();
            
  
          }
  
          const handleMouseUp = (e) =>{
            shouldDraw.current=false;
          }
  
          canvas.addEventListener('mousedown',handleMouseDown)
          canvas.addEventListener('mousemove',handleMouseMove)
          canvas.addEventListener('mouseup',handleMouseUp)

          return ()=>{
            canvas.removeEventListener('mousedown',handleMouseDown)
            canvas.removeEventListener('mousemove',handleMouseMove)
            canvas.removeEventListener('mouseup',handleMouseUp)
          }
  
  
    },[])

    console.log(color,size)


    return(
        <canvas ref={canvasRef}></canvas>
    )
}

export default Board;