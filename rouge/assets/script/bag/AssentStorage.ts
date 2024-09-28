import { _decorator, assetManager, CCClass, Component, director, find, Label, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { AssentManager } from "./AssentManager";

const { ccclass,property } = _decorator;

@ccclass('AssentStorage')
export  class AssentStorage extends Component  {
   @property(Label)
    goldLabel:Label|null=null
    @property(Label)
    engryLabel:Label|null=null
    @property(Label)
    diamondLabel:Label|null=null    
    update(){
        if(AssentManager.instance){
        this.goldLabel.string=AssentManager.instance.goldCount.toString()
        this.engryLabel.string=AssentManager.instance.energyCount.toString()
        this.diamondLabel.string=AssentManager.instance.diamondCount.toString()
    }
}
}