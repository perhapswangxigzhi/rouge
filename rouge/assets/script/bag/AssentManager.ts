import { _decorator, assetManager, CCClass, Component, director, find, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { PlayerController } from "../actor/PlayControl";

const { ccclass} = _decorator;

@ccclass('AssentManager')
export  class AssentManager extends Component  {
    equip:Equipment[]=[]
    equipCount:number[]=[]
    barEquipCount:number[]=[]
    goldCount:number=0;
    energyCount:number=0;
    diamondCount:number=0;
    equipCell:number=0
    wearingEquipCeil:number=0
    navigator:boolean=true
    checkEmpty:boolean[]=new Array(false,false,false,false,false,false)  
    Count=0;
    static instance: AssentManager | null = null;
    start(){
        AssentManager.instance = this;
        director.addPersistRootNode(this.node);
    }
    
    getEquip(equipCount:number){
        this.equipCount.push(equipCount)
        this.Count++
      
    }
    getAssent(gold:number,engry:number,diamond){
        this.goldCount+=gold
        this.energyCount+=engry
        this.diamondCount+=diamond
    }
    throwEquip(){
        this.equipCount.pop()
        this.Count--

    }
    















}