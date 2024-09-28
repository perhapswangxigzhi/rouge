import { _decorator, assetManager, AssetManager, Component, director, Label, random, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { AssentManager } from "./AssentManager";

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

    equip:Equipment|null=null
    equipCount:number=0
   
    static instance: RewardsManager | null = null;

    onLoad(){
        RewardsManager.instance = this;
       
    }



    getEquipment(){
        this.equipmentProperty.string=''
        this.equipmentName.string=''
        this.equip=Equipment.inst
        this.equipCount=Math.floor(Math.random()*this.equip.equipmentPerporty.length);
        if( AssentManager.instance!=null){
            AssentManager.instance.getEquip(this.equipCount)
        }
        this.equipmentName.string=this.equip.equipmentPerporty[this.equipCount].name
        assetManager.resources.load(`equipment/${this.equip.equipmentPerporty[this.equipCount].Index}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            this.equipmentIcon.spriteFrame=spriteFrame
        });
       if(this.equip.equipmentPerporty[this.equipCount].hp!=0){
           this.equipmentProperty.string=`生命值:+${this.equip.equipmentPerporty[this.equipCount].hp}\n`
       }
       if(this.equip.equipmentPerporty[this.equipCount].attack!=0){
           this.equipmentProperty.string+=`攻击力:+${this.equip.equipmentPerporty[this.equipCount].attack}\n`
       }
       if(this.equip.equipmentPerporty[this.equipCount].defence!=0){
           this.equipmentProperty.string+=`防御力:+${this.equip.equipmentPerporty[this.equipCount].defence}\n`
       }
       if(this.equip.equipmentPerporty[this.equipCount].speed!=0){
        this.equipmentProperty.string += `移速:+${Math.floor((this.equip.equipmentPerporty[this.equipCount].speed) * 100)}%\n`

       }
       if(this.equip.equipmentPerporty[this.equipCount].attackSpeed!=0){
        this.equipmentProperty.string += `移速:+${Math.floor((this.equip.equipmentPerporty[this.equipCount].attackSpeed) * 100)}%\n`

       } if(this.equip.equipmentPerporty[this.equipCount].crit!=0){
        this.equipmentProperty.string += `移速:+${Math.floor((this.equip.equipmentPerporty[this.equipCount].crit)* 100)}%\n`

       }
       
    }
    getAssent(){
       this.rewardsGoldCount=Math.floor(Math.random()*100)+100
       this.rewardsEngryCount=Math.floor(Math.random()*10)
       this.rewardsDiamondCount=Math.floor(Math.random()*20)+10
       this.gold.string=`+${this.rewardsGoldCount}`
       this.engry.string=`+${this.rewardsEngryCount}`
       this.diamond.string=`+${this.rewardsDiamondCount}`
       AssentManager.instance.getAssent(this.rewardsGoldCount,this.rewardsEngryCount,this.rewardsDiamondCount)
    }

}
