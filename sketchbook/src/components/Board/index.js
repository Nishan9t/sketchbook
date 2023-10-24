import { MENU_ITEMS } from "@/constants";
import { actionItemClick } from "@/slice/menuSlice";
import { useEffect, useLayoutEffect, useRef } from "react";

import { useSelector,useDispatch } from "react-redux";


const Board =()=>{

    const dispatch=useDispatch();


    const canvasRef = useRef(null)
    //to draw
    const shouldDraw = useRef(false)

    //to store previous slides/canvas
    const drawHistory = useRef([])
    const historyPointer = useRef(0)

    const {activeMenuItem,actionMenuItem} = useSelector(state => state.menu)

    const {color,size} = useSelector(state => state.toolbox[activeMenuItem])


    useEffect(()=>{
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if(actionMenuItem === MENU_ITEMS.DOWNLOAD)
        {
            //create image url
            const URL = canvas.toDataURL();
            //now we have to give this URL to anchor tag and download from it
            const anchor = document.createElement("a");
            anchor.href=URL
            anchor.download ='sketch.png'
            anchor.click();
        } 
        else if(actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO)
        {
          if(historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO)
          {
            historyPointer.current -= 1;
          }
          if(historyPointer.current < drawHistory.current.length-1 && actionMenuItem === MENU_ITEMS.REDO)
          {
            historyPointer.current += 1;
          }
          const imageData = drawHistory.current[historyPointer.current];
          context.putImageData(imageData,0,0);
          

        }
        //so that we can download the canvas each time we click on same canvas
        dispatch(actionItemClick(null))

    },[actionMenuItem])

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

          //add event listener to draw

          const beginPath =(x,y)=>{
             //saying canvas to get ready and it needed moveTo to tell from where start moving
             context.beginPath()
              //we are going start from X , Y
            context.moveTo(x,y)

          }

          const drawLine=(x,y)=>{
            context.lineTo(x,y)
            context.stroke();
          }

          const handleMouseDown = (e) =>{

            shouldDraw.current = true;
            beginPath(e.clientX,e.clientY)
            
          }
  
          const handleMouseMove = (e) =>{
            //if mouse is not pressed
            if(!shouldDraw.current)
            {
                return
            }
            //to draw
            drawLine(e.clientX, e.clientY);
            
          }
  
          const handleMouseUp = (e) =>{
            shouldDraw.current=false;
            //push the current state of canvas in array for undo
            const imageData = context.getImageData(0,0,canvas.width,canvas.height)
            drawHistory.current.push(imageData)
            //history pointer contains the latest change
            historyPointer.current = drawHistory.current.length-1;
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