import { _decorator, assetManager, CCClass, Component, director, find, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { EquipmentManager } from "./EquipmentManager";
const { ccclass} = _decorator;

@ccclass('BagManager')
export  class BagManager extends Component  {
    equip:Equipment[]=[]
    equipCount:number[]=[]
    Count=0;
    static instance: BagManager | null = null;
    start(){
        BagManager.instance = this;
        director.addPersistRootNode(this.node);
    }
    
    getEquip(equipCount:number){
        this.equipCount[this.Count]=equipCount
        this.Count++
    }

   















}