import { _decorator, assetManager, CCClass, Component, director, find, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { PlayControl } from "../actor/PlayControl";

const { ccclass} = _decorator;

@ccclass('AssentManager')
export  class AssentManager extends Component  {
    equip:Equipment[]=[]
    equipCount:number[]=[]
    barEquipCount:number[]=[]
    _nodeStage:any[]=[];
    goldCount:number=0;
    energyCount:number=0;
    diamondCount:number=0;
    equipCell:number=0
    wearingEquipCeil:number=0
    navigator:boolean=true
    nodeStage: any[] = [];
    isPrelood:boolean=false
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
    throwEquip(equipIndex:number){
        const index = this.equipCount.indexOf(equipIndex);
        if (index !== -1) { // 确保元素存在
            this.equipCount.splice(index, 1); // 删除指定下标的元素
            this.Count--; // 更新计数
        } else {
            console.warn("装备不存在！"); // 可选：处理元素不存在的情况
        }

    }
    















}