import { _decorator, Component } from "cc";
import { AudioMgr } from "../sound/soundManager";

const{ccclass, property} = _decorator;
@ccclass('game')
export class game extends Component{


    onLoad() {
        
        AudioMgr.inst.play('UIBgm',0.3);
        
    }

}

