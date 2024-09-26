import { _decorator, assetManager, CCClass, Component, director, find, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { BagManager } from "./BagManager";

const { ccclass} = _decorator;

@ccclass('BagStorage')
export  class BagStorage extends Component  {
    equip:Equipment[]=[]
    equipCount:number[]=[]
    Count=0;
    start(){
        this.init()
    }
    init(){
        this.equipCount=BagManager.instance.equipCount
   
        for(let i=0;i< this.node.children.length;i++){
         this.equip[i]=Equipment.inst
        }
        for(let i=0;i< this.equipCount.length;i++){
         assetManager.resources.load(`equipment/${this.equip[i].equipmentPerporty[this.equipCount[i]].Index}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
             if (err) {
                 console.error(err);
                 return;
             }
             this.node.children[i].children[0].getComponent(Sprite).spriteFrame=spriteFrame
         });
        }
         
     }
 
}