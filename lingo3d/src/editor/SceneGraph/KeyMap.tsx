import {, h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import { useEffect, useState } from "preact/hooks"
import createElement from "../../utils/createElement"

preventTreeShake(h)

const style = createElement(`
    <style>
        .lingo-keyblock-win{
            padding: 15px 15px;
            margin: 5px;
            font-weight: bold;
            color:#ffffff;
            border-radius: 10px;
            background: linear-gradient(145deg, #242529, #2b2c31);
            box-shadow:  5px 5px 10px #222327,
                        -5px -5px 10px #2e2f35;
        }
        .lingo-tabpanel{
            text-align: center;
            flex: 1;
            padding: 15px;
            cursor: pointer;
        }
    </style>
`)
document.head.appendChild(style)

const KeyMapRender = () => {
    useEffect(() => {
        return () => {
         
        }
    }, [])
    const flexStyle = {
        "display":"flex",
        alignItems:"center",
        "scrollbar-width": "none",
        "-ms-overflow-style": "none"

    }
    const padding = (num:number) =>  {
        return {
            "padding":`${num}px`
        }
    }
    const macKetList = [
       {
        Des:"放大/缩小",
        Key:["Commend"],
        Combination:['+','-']
       }
      ]
      const winKeyList =[
        {
            Des:"放大/缩小",
            Key:["Ctrl"],
            Combination:['+','-']
           }
      ]
  const checkLastPanel = (type:boolean = true) => {
        return type || <span style={padding(5)}>or</span>
  }
  const RenderKey = (list:Array<any> = macKetList) => {
        const listLnegth = list?.length 
        return list.map((Item,Index) => {
            const { Des,Key,Combination } = Item
            return (
                <div style={{...flexStyle,"margin":"15px"}}>
                     <div >{Des}  :</div>
                     <div style={flexStyle}>{Key.map((KeyItem:any,KetIndex:number) =>
                        <div  style={flexStyle}>
                              <div className="lingo-keyblock-win"> { KeyItem }</div> 
                              <div style={padding(5)}>+</div> 
                        </div>
                    )}
                     </div>
                     <div style={flexStyle}>{Combination.map((CombinationItem:any,KeyIndex:number) =>
                        <div  style={flexStyle}>
                            <div>{ checkLastPanel(KeyIndex === Key?.length - 1)}</div> 
                              <div className="lingo-keyblock-win"> { CombinationItem }</div> 
                        </div>
                    )}
                     </div>
                </div>
            )
        })
  }

  const [tabState,setTabState] = useState(0)
    return (
        <div
         className="lingo3d-ui"
         style={{
            width:350,
             height: "100%",
             background: "rgb(40, 41, 46)",
             padding: 10
         }}
        >
            <div  style={flexStyle}>
                {["Windows","Mac"].map((i,index )=> (<div
                className={"lingo-tabpanel"}
                 style={{background: tabState === index ? 'rgba(255, 255, 255, 0.1)':''}}         
                 onClick={()=>{ setTabState(index)}}
                 >{i}</div>))}                
            </div>
            <div >
            {  tabState ? RenderKey() : RenderKey(winKeyList)}
            </div>
        </div>
    )
}

register(KeyMapRender, "lingo3d-keymap")