import { SignalrClient } from "../signalr/SignalrClient";
import { EquipmentPerporty } from "./EquipmentPerporty";

export class hasEquip extends EquipmentPerporty {

    EquipMentsOnSlot:EquipmentPerporty[] =[] ;
    EquipMentsOnBag:EquipmentPerporty[] = [];   //拥有的装备
    static _instance:hasEquip=null;
    static get instance():hasEquip{
        if(this._instance==null){
            this._instance=new hasEquip();
        }
        return this._instance;
    }
    setEquipInBag(equip:EquipmentPerporty){
        this.EquipMentsOnBag.push(equip);

        if(SignalrClient.opend==true){
            SignalrClient.instance.sendEquiptoDb(equip);
        }
    }
    setEquipInSlot(equip:EquipmentPerporty){
        this.EquipMentsOnSlot.push(equip);
    }
    delEquipInBag(index:number){
        hasEquip.instance.EquipMentsOnBag.splice(index,1)
    }
    delEquipInSlot(index:number){
        hasEquip.instance.EquipMentsOnSlot.splice(index,1)
    }
    
}