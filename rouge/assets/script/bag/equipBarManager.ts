
import { _decorator, assetManager, Button, CCClass, Component, director, find, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { AssentManager } from "./AssentManager";
import { ActorStage } from "../actor/ActorStage";
import { hasEquip } from "./hasEquip";
import { BagStorage } from "./BagStorage";
import { UIporperty } from "./UIporperty";
import { SignalrClient } from "../signalr/SignalrClient";
const { ccclass} = _decorator;

@ccclass('equipBarManager')
export  class equipBarManager extends Component  {
    equip:Equipment[]=[]
    barEquipCount:number[]=[]
    checkEmpty:boolean[]=[false,false,false,false,false,false]
    Count=0;
    static instance: equipBarManager | null = null;
    start(){
        equipBarManager.instance = this;
        this.init()
    }
     init(){
        this.checkEmpty=[false,false,false,false,false,false]
        for(let i=0;i< this.node.children.length;i++){
           this.node.children[i].pauseSystemEvents(true);
        }
        for(let i=0;i< hasEquip.instance.EquipMentsOnSlot.length;i++){
            let  equipType=hasEquip.instance.EquipMentsOnSlot[i].type
            assetManager.resources.load(`equipment/${hasEquip.instance.EquipMentsOnSlot[i].indexIcon}/spriteFrame`, SpriteFrame,  (err, spriteFrame) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.node.children[equipType].children[0].getComponent(Sprite).spriteFrame=spriteFrame
            })
            //判断装备冲突
                this.conflictEquip(equipType)
                this.node.children[equipType].resumeSystemEvents(true);  
                this.checkEmpty[equipType]=true
        }
        for(let i=0;i< hasEquip.instance.EquipMentsOnSlot.length;i++){
          //  console.log("第",i,"个装备的装备栏位置为",hasEquip.instance.EquipMentsOnSlot[i].indexOnSlot)
            if(SignalrClient.opend==true){
                SignalrClient.instance.sendEquiptoDb(hasEquip.instance.EquipMentsOnSlot[i])
           }
        }
    
        UIporperty.getEquipProperty();
    }
    //穿戴装备冲突
    conflictEquip(equipType):boolean{
        if(this.checkEmpty[equipType]==true){
            console.log("装备冲突")
            for(let i=0;i<hasEquip.instance.EquipMentsOnSlot.length;i++){
                if(hasEquip.instance.EquipMentsOnSlot[i].type==equipType){
                    hasEquip.instance.EquipMentsOnBag.push(hasEquip.instance.EquipMentsOnSlot[i])
                    hasEquip.instance.EquipMentsOnSlot.splice(i,1)   //删除冲突的装备
                    return true;
                }
            }      
    }else{
        return false;
    }
}
   
}
