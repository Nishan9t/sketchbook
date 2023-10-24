import { useEffect, useRef } from "react";

import { useSelector,useDispatch } from "react-redux";


const Board =()=>{


    const canvasRef = useRef(null)

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
    useEffect(()=>{
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        //when mounting
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

          //add event listner to draw

          const handleMouseDown = (e) =>{

            
          }
  
          const handleMouseMove = (e) =>{

            
  
          }
  
          const handleMouseUp = (e) =>{
  
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