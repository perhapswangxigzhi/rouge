import { _decorator, assetManager, Button, CCClass, Component, director, find, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { AssentManager } from "./AssentManager";

const { ccclass} = _decorator;

@ccclass('BagStorage')
export  class BagStorage extends Component  {
    equip:Equipment[]=[]
    equipCount:number[]=[]
    Count=0;
    static instance: BagStorage | null = null;
    start(){
        BagStorage.instance = this;
        for(let i=0;i< this.node.children.length;i++){
            this.equip[i]=Equipment.inst
        }
        this.init()
    }
    init(){
       
        for(let i=0;i< this.node.children.length;i++){
            this.node.children[i].pauseSystemEvents(true)//关闭该节点及子节点的事件监听状态，子节点依然会继续监听
        }
        //  this.node.pauseSystemEvents(false);   //只关闭该节点的事件监听状态，子节点依然会继续监听
        if(AssentManager.instance!=null){
        this.equipCount=AssentManager.instance.equipCount
        }
       
        for(let i=0;i< this.equipCount.length;i++){
         assetManager.resources.load(`equipment/${this.equip[i].equipmentPerporty[this.equipCount[i]].Index}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
             if (err) {
                 console.error(err);
                 return;
             }
             this.node.children[i].children[0].getComponent(Sprite).spriteFrame=spriteFrame
          
             this.node.children[i].resumeSystemEvents(true);   //恢复节点与所有子节点的事件监听状态
          
         });
        }
         
     }
   hasEquip(index:number){
        if(this.equipCount[index]!=null){
            return true
        }else{
            return false
        }
   }
    
}