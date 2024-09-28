import { _decorator, assetManager, Button, CCClass, Component, director, find, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { AssentManager } from "./AssentManager";

const { ccclass} = _decorator;

@ccclass('equipBarManager')
export  class equipBarManager extends Component  {
    equip:Equipment[]=[]
    barEquipCount:number[]=[]
    Count=0;
    static instance: equipBarManager | null = null;
    start(){
        equipBarManager.instance = this;
        this.init()
    }
    init(){
     
        for(let i=0;i< this.node.children.length;i++){
           this.node.children[i].pauseSystemEvents(true);
        }
        if(AssentManager.instance){
        this.barEquipCount=AssentManager.instance.barEquipCount;
        }
        for(let i=0;i<this.barEquipCount.length;i++){
            assetManager.resources.load(`equipment/${Equipment.inst.equipmentPerporty[this.barEquipCount[i]].Index}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                                if(Equipment.inst.equipType[this.barEquipCount[i]]==0){
                                            this.node.children[0].children[0].getComponent(Sprite).spriteFrame=spriteFrame
                                            this.node.children[0].resumeSystemEvents(true);  
                                            AssentManager.instance.checkEmpty[0]=true;
                                }
                                if(Equipment.inst.equipType[this.barEquipCount[i]]==1){
                                            this.node.children[1].children[0].getComponent(Sprite).spriteFrame=spriteFrame
                                            this.node.children[1].resumeSystemEvents(true);  
                                            AssentManager.instance.checkEmpty[1]=true;
                                            }
                                if(Equipment.inst.equipType[this.barEquipCount[i]]==2){
                                            this.node.children[2].children[0].getComponent(Sprite).spriteFrame=spriteFrame
                                            this.node.children[2].resumeSystemEvents(true);
                                            AssentManager.instance.checkEmpty[2]=true  
                                            }
                                if(Equipment.inst.equipType[this.barEquipCount[i]]==3){
                                            this.node.children[3].children[0].getComponent(Sprite).spriteFrame=spriteFrame
                                            this.node.children[3].resumeSystemEvents(true);  
                                            AssentManager.instance.checkEmpty[3]=true  
                                                }
                                if(Equipment.inst.equipType[this.barEquipCount[i]]==4){
                                            this.node.children[4].children[0].getComponent(Sprite).spriteFrame=spriteFrame
                                            this.node.children[4].resumeSystemEvents(true);
                                             AssentManager.instance.checkEmpty[4]=true  
                                                    }
                                if(Equipment.inst.equipType[this.barEquipCount[i]]==5){
                                            this.node.children[5].children[0].getComponent(Sprite).spriteFrame=spriteFrame
                                            this.node.children[5].resumeSystemEvents(true);
                                             AssentManager.instance.checkEmpty[5]=true  
                                            }         
                                    
                            })
         
            }
        }
        //根据装备栏序号穿戴装备
    waerEquip(indexCeil:number){
        this.barEquipCount=AssentManager.instance.barEquipCount;
        if(  AssentManager.instance.checkEmpty[indexCeil]==false){
            console.log("barConnt",this.barEquipCount[this.barEquipCount.length-1])
        assetManager.resources.load(`equipment/${Equipment.inst.equipmentPerporty[this.barEquipCount[this.barEquipCount.length-1]].Index}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            this.node.children[indexCeil].children[0].getComponent(Sprite).spriteFrame=spriteFrame
            this.node.children[indexCeil].resumeSystemEvents(true);  
            AssentManager.instance.checkEmpty[indexCeil]=true;
        })
    }else if(AssentManager.instance.checkEmpty[indexCeil]==true){
        
        assetManager.resources.load(`equipment/${Equipment.inst.equipmentPerporty[this.barEquipCount[this.barEquipCount.length-1]].Index}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("装备冲突1")
            let equipIndex=this.node.children[indexCeil].children[0].getComponent(Sprite).spriteFrame.name
            let indexOfEquip=Equipment.inst.equipIndex.indexOf(equipIndex)
            console.log("正在穿戴装备的序号",indexOfEquip)
            
            AssentManager.instance.getEquip(indexOfEquip);
            for(let i=0;i<AssentManager.instance.barEquipCount.length;i++){
             if(AssentManager.instance.barEquipCount[i]==indexOfEquip){
                AssentManager.instance.barEquipCount.splice(i,1);
                break;
                     }
                }
                console.log("删除后的装备栏",AssentManager.instance.barEquipCount)
              
                this.node.children[indexCeil].children[0].getComponent(Sprite).spriteFrame=spriteFrame
                this.node.children[indexCeil].resumeSystemEvents(true);     
            })
        }
    }
    
        
}
