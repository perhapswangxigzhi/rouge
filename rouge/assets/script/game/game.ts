import { _decorator, Component, resources, Sprite, SpriteAtlas } from "cc";
import { AudioMgr } from "../sound/soundManager";
import { PreStageNode } from "../signalr/PreStageNode";
import { SignalrClient } from "../signalr/SignalrClient";

const{ccclass, property} = _decorator;
@ccclass('game')
export class game extends Component{

    
    onLoad() {
    AudioMgr.inst.play('UIBgm',0.3);
           //场景切换后需要加载与保存场景
     if(PreStageNode.instance&&PreStageNode.instance.isPrelood==true){
        this.node.getChildByName("UIContinue").active=true;
        this.node.getChildByName("UIMask").active=true;
     };    
    }
     start() {
        if(SignalrClient.opend==true){
            var obj=[]
            SignalrClient.instance.sendObjs(obj,false)
        }
        
    }

}

