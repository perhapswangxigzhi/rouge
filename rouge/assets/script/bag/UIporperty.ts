import { _decorator, assetManager, CCClass, Component, director, find, Label, Node, Sprite, SpriteFrame } from "cc";
import { AssentManager } from "./AssentManager";
import { ActorStage } from "../actor/ActorStage";
import { Equipment } from "./Equipment";
import { hasEquip } from "./hasEquip";


const { ccclass,property } = _decorator;

@ccclass('UIporperty')
export  class UIporperty extends Component  {
    roleProNode:Node = null;
    static rolePre: number[] = [];
     onEnable(): void {
        this.roleProNode = find("LevelCanvas/UIEquipment/UIBackGround/UIProperty/property/roleText/propertyList");
        UIporperty.getEquipProperty()
        this.init()
    }
     //初始化界面
    init(){
            this.roleProNode.children[0].children[1].getComponent(Label).string=(UIporperty.rolePre[0]).toString()
            this.roleProNode.children[1].children[1].getComponent(Label).string=(UIporperty.rolePre[1]).toString()
            this.roleProNode.children[2].children[1].getComponent(Label).string=(UIporperty.rolePre[2]).toString()
            this.roleProNode.children[3].children[1].getComponent(Label).string=Math.round(UIporperty.rolePre[3]*100).toString()+'%'
            this.roleProNode.children[4].children[1].getComponent(Label).string=Math.round(UIporperty.rolePre[4]*100).toString()+'%'
            this.roleProNode.children[5].children[1].getComponent(Label).string=(UIporperty.rolePre[5]).toFixed(2)
            this.roleProNode.children[6].children[1].getComponent(Label).string=(UIporperty.rolePre[6]).toFixed(2)
       
    }
   static initPerperty(){
            UIporperty.rolePre[0]=ActorStage.initPlayerProperty.maxHp
            UIporperty.rolePre[1]=ActorStage.initPlayerProperty.attack
            UIporperty.rolePre[2]=ActorStage.initPlayerProperty.defence
            UIporperty.rolePre[3]=ActorStage.initPlayerProperty.crit
            UIporperty.rolePre[4]=ActorStage.initPlayerProperty.physicalCritDamage
            UIporperty.rolePre[5]=ActorStage.initPlayerProperty.attackSpeed
            UIporperty.rolePre[6]=ActorStage.initPlayerProperty.speed
   }
   //获取装备属性
    static getEquipProperty(){
        UIporperty.initPerperty()
        if(hasEquip.instance){
            for(let i=0;i<hasEquip.instance.EquipMentsOnSlot.length;i++){
                UIporperty.rolePre[0]+=hasEquip.instance.EquipMentsOnSlot[i].hp
                UIporperty.rolePre[1]+=hasEquip.instance.EquipMentsOnSlot[i].attack
                UIporperty.rolePre[2]+=hasEquip.instance.EquipMentsOnSlot[i].defence
                UIporperty.rolePre[3]+=hasEquip.instance.EquipMentsOnSlot[i].crit
                UIporperty.rolePre[4]+=hasEquip.instance.EquipMentsOnSlot[i].physicalCritDamage
                UIporperty.rolePre[5]+=parseFloat((ActorStage.initPlayerProperty.attackSpeed * hasEquip.instance.EquipMentsOnSlot[i].attackSpeed).toFixed(2))
                UIporperty.rolePre[6]+=parseFloat((ActorStage.initPlayerProperty.speed * hasEquip.instance.EquipMentsOnSlot[i].speed).toFixed(2))
            }
        }
    }
}
