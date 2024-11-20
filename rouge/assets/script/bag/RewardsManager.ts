import { _decorator, assetManager, AssetManager, Component, director, Label, random, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { AssentManager } from "./AssentManager";
import { Client } from "socket.io/dist/client";
import { Assent, SignalrClient } from "../signalr/SignalrClient";
import { EquipmentPerporty } from "./EquipmentPerporty";
import { hasEquip } from "./hasEquip";
import { UIFont } from "../ui/UIFont";

const{ccclass,property}=_decorator
@ccclass('RewardsManager')
export class RewardsManager extends Component{
    @property(Sprite)
    equipmentIcon:Sprite|null=null

    @property(Label)
    equipmentName:Label|null=null

    @property(Label)
    equipmentProperty:Label|null=null
    @property(Label)
    gold:Label|null=null
    @property(Label)
    engry:Label|null=null
    @property(Label)
    diamond:Label|null=null
    rewardsGoldCount:number=0   // 奖励金币数量
    rewardsEngryCount:number=0     // 奖励能量数量
    rewardsDiamondCount:number=0    // 奖励钻石数量

    equipinit:Equipment|null=null
    equipCount:number=0
   
    static instance: RewardsManager | null = null;

    onLoad(){
        RewardsManager.instance = this;
       
    }



    getEquipment(){
        this.equipmentProperty.string=''
        this.equipmentName.string=''

        this.equipinit=Equipment.inst //获取随机初始装备
        this.equipCount=Math.floor(Math.random()*this.equipinit.equipmentPerporty.length);

        this.setHasEquip(this.equipCount)
        let equip=hasEquip.instance.EquipMentsOnBag[hasEquip.instance.EquipMentsOnBag.length-1]
       
        this.equipmentName.string=equip.name
        assetManager.resources.load(`equipment/${equip.indexIcon}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            this.equipmentIcon.spriteFrame=spriteFrame
        });
       if(equip.hp!=0){
           this.equipmentProperty.string=`生命值:+${equip.hp}\n`
       }
       if(equip.attack!=0){
           this.equipmentProperty.string+=`攻击力:+${equip.attack}\n`
       }
       if(equip.defence!=0){
           this.equipmentProperty.string+=`防御力:+${equip.defence}\n`
       }
       if(equip.speed!=0){
        this.equipmentProperty.string += `移速:+${Math.round((equip.speed) * 100)}%\n`

       }
       if(equip.attackSpeed!=0){
        this.equipmentProperty.string += `攻速:+${Math.round((equip.attackSpeed) * 100)}%\n`

       } if(equip.crit!=0){
        this.equipmentProperty.string += `暴击:+${Math.round((equip.crit)* 100)}%\n`

       }
       
    }
    setHasEquip(index:number){
        let equip=new EquipmentPerporty()
        equip.indexIcon=this.equipinit.equipmentPerporty[index].indexIcon
        equip.name=this.equipinit.equipmentPerporty[index].name
        equip.type=this.equipinit.equipmentPerporty[index].type
        equip.hp=this.equipinit.equipmentPerporty[index].hp
        equip.attack=this.equipinit.equipmentPerporty[index].attack
        equip.defence=this.equipinit.equipmentPerporty[index].defence
        equip.speed=this.equipinit.equipmentPerporty[index].speed
        equip.attackSpeed=this.equipinit.equipmentPerporty[index].attackSpeed
        equip.crit=this.equipinit.equipmentPerporty[index].crit
        equip.physicalCritDamage=this.equipinit.equipmentPerporty[index].physicalCritDamage
        equip.equipId=this.randomID()
        hasEquip.instance.setEquipInBag(equip)
    }
    getAssent(){
       this.rewardsGoldCount=Math.floor(Math.random()*100)+100
       this.rewardsEngryCount=Math.floor(Math.random()*10)
       this.rewardsDiamondCount=Math.floor(Math.random()*20)+10
       this.gold.string=`+${this.rewardsGoldCount}`
       this.engry.string=`+${this.rewardsEngryCount}`
       this.diamond.string=`+${this.rewardsDiamondCount}`
       AssentManager.instance.goldCount+=this.rewardsGoldCount
       AssentManager.instance.energyCount+=this.rewardsEngryCount
       AssentManager.instance.diamondCount+=this.rewardsDiamondCount
       UIFont.MiddleIndex++;
       if(SignalrClient.opend==true){
            let assent=new Assent("888",AssentManager.instance.goldCount, AssentManager.instance.energyCount, AssentManager.instance.diamondCount,UIFont.MiddleIndex)
            SignalrClient.instance.sendAssent(assent)
       }
    }
    randomID():number{
        // 使用当前时间戳的一部分与随机数结合
        let id = Math.floor(Date.now() * Math.random()) % 100000;
        return id;
    }
}
