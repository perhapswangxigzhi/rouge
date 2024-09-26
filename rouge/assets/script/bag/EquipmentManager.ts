import { _decorator, assetManager, AssetManager, Component, director, Label, random, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { BagManager } from "./BagManager";

const{ccclass,property}=_decorator
@ccclass('EquipmentManager')
export class EquipmentManager extends Component{
    @property(Sprite)
    equipmentIcon:Sprite|null=null

    @property(Label)
    equipmentName:Label|null=null

    @property(Label)
    equipmentProperty:Label|null=null

    equip:Equipment|null=null
    equipCount:number=0
   
    static instance: EquipmentManager | null = null;

    onLoad(){
        EquipmentManager.instance = this;
       
    }



    getEquipment(){
        this.equipmentProperty.string=''
        this.equipmentName.string=''
        this.equip=Equipment.inst
        this.equipCount=Math.floor(Math.random()*this.equip.equipmentPerporty.length);
        if( BagManager.instance!=null){
            BagManager.instance.getEquip(this.equipCount)
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
           this.equipmentProperty.string+=`移速:+${this.equip.equipmentPerporty[this.equipCount].speed*100}%\n`
       }
       if(this.equip.equipmentPerporty[this.equipCount].attackSpeed!=0){
           this.equipmentProperty.string+=`攻速:+${this.equip.equipmentPerporty[this.equipCount].attackSpeed*100}%\n`
       } if(this.equip.equipmentPerporty[this.equipCount].crit!=0){
           this.equipmentProperty.string+=`暴击率:+${this.equip.equipmentPerporty[this.equipCount].attackSpeed*100}%\n`
       }
       

    }

}
