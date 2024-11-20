import { _decorator, Component, Label, Node, ProgressBar, RichText } from 'cc';
import { PlayControl } from '../actor/PlayControl';
import { UItalendRemind } from './UItalendRemind';
import { ActorStage } from '../actor/ActorStage';
const { ccclass, property } = _decorator;

@ccclass('UIExBar')
export class UIExBar extends Component {
    progressBar: ProgressBar | null = null;
    Label:Label | null = null;
    ExpDrop:number = 0;       //挑战怪物掉落经验
    ExpCount:number = 0;     //总经验
    ExpCoefficient=2  //经验系数
    static instance: UIExBar | null = null;
    
    start() {
        this.progressBar = this.node.getComponent(ProgressBar);
        this.Label = this.node.getChildByName('Label').getComponent(Label);
        UIExBar.instance = this;
    }

    update(deltaTime: number) {
         if (!ActorStage.instance ) {
            return;
        }
        this.ExpCount=ActorStage.instance.playerProperty.ex*this.ExpCoefficient+this.ExpDrop*this.ExpCoefficient;
        const maxEx = ActorStage.instance.playerProperty.maxEx;
         // 计算商和余数
        const quotient = Math.floor(this.ExpCount / maxEx);
        this.progressBar.progress = (this.ExpCount % maxEx) / maxEx;
        UItalendRemind.instance.levelCount=quotient; 
        ActorStage.instance.playerProperty.level=quotient;
        this.Label.string = `LV:${quotient}`;
        
    }
}


