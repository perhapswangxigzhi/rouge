import { _decorator, Component, Node, ProgressBar, RichText } from 'cc';
import { PlayerController } from '../actor/PlayControl';
const { ccclass, property } = _decorator;

@ccclass('UIExBar')
export class UIExBar extends Component {
    progressBar: ProgressBar | null = null;
    richTextLabel:RichText | null = null;
    ExpDrop:number = 0;
    ExpCount:number = 0;
    static instacnce: UIExBar | null = null;
    
    start() {
        this.progressBar = this.node.getComponent(ProgressBar);
        this.richTextLabel = this.node.getChildByName('RichText').getComponent(RichText);
        UIExBar.instacnce = this;
    }

    update(deltaTime: number) {
        if (!PlayerController.instance || !PlayerController.instance.actor) {
            return;
        }
        this.ExpCount=this.ExpDrop+PlayerController.instance.actor.playerProperty.ex;;
        const maxEx = PlayerController.instance.actor.playerProperty.maxEx;
         // 计算商和余数
        const quotient = Math.floor(this.ExpCount / maxEx);
        this.progressBar.progress = (this.ExpCount % maxEx) / maxEx;
        PlayerController.instance.actor.playerProperty.level=quotient;
        this.richTextLabel.string = `LV:${quotient}`;
        
    }
}


