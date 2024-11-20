import { _decorator, assetManager, CCClass, Component, director, find, Label, macro, Sprite, SpriteFrame } from "cc";
import { Equipment } from "./Equipment";
import { AssentManager } from "./AssentManager";
import { SignalrClient } from "../signalr/SignalrClient";

const { ccclass,property } = _decorator;

@ccclass('AssentStorage')
export  class AssentStorage extends Component  {
   @property(Label)
    goldLabel:Label|null=null
    @property(Label)
    engryLabel:Label|null=null
    @property(Label)
    diamondLabel:Label|null=null  
    start() {
        // this.schedule(()=>{
        //     this.initAssent()
        // },0.1,macro.REPEAT_FOREVER,0)
    }
    protected update(dt: number): void {
        this.initAssent()
    }
    initAssent(){
        if(AssentManager.instance){
            if (AssentManager.instance.goldCount!=0) {
                this.goldLabel.string = AssentManager.instance.goldCount.toString();
            }
            if (AssentManager.instance.energyCount!=0) {
                this.engryLabel.string = AssentManager.instance.energyCount.toString();
            }
            if (AssentManager.instance.diamondCount!=0) {
                this.diamondLabel.string = AssentManager.instance.diamondCount.toString();
            }
    }
}

}