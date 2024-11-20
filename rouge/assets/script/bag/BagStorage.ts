import { _decorator, assetManager, Button, CCClass, Component, director, find, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { AssentManager } from "./AssentManager";
import { hasEquip } from "./hasEquip";
import { SignalrClient } from "../signalr/SignalrClient";

const { ccclass} = _decorator;

@ccclass('BagStorage')
export  class BagStorage extends Component  {
    //equip:Equipment[]=[]
    equipCount:number[]=[]
    Count=0;
    static instance: BagStorage | null = null;
    onEnable(){
        BagStorage.instance = this;
        this.init()
    }
   
     init(){
       
        for(let i=0;i< this.node.children.length;i++){
            this.node.children[i].pauseSystemEvents(true)//关闭该节点及子节点的事件监听状态，子节点依然会继续监听
        }
        for(let i=0;i< hasEquip.instance.EquipMentsOnBag.length;i++){
         assetManager.resources.load(`equipment/${hasEquip.instance.EquipMentsOnBag[i].indexIcon}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
             if (err) {
                 console.error(err);
                 return;
             }
             this.node.children[i].children[0].getComponent(Sprite).spriteFrame=spriteFrame
            });
            this.node.children[i].resumeSystemEvents(true);   //恢复节点与所有子节点的事件监听状态
            hasEquip.instance.EquipMentsOnBag[i].indexOnBag=i;
            hasEquip.instance.EquipMentsOnBag[i].indexOnSlot=-1;
            if(SignalrClient.opend==true){
                 SignalrClient.instance.sendEquiptoDb(hasEquip.instance.EquipMentsOnBag[i])
            }
        }
        //背包前移一格后的空白图标
           assetManager.resources.load(`UIicon/Spring_common_bac_54/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            this.node.children[ hasEquip.instance.EquipMentsOnBag.length].children[0].getComponent(Sprite).spriteFrame=spriteFrame
            
        })  
         
     }
    
}