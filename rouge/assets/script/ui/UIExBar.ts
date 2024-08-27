import { _decorator, Component, Node, ProgressBar, RichText } from 'cc';
import { PlayerController } from '../actor/PlayControl';
const { ccclass, property } = _decorator;

@ccclass('UIExBar')
export class UIExBar extends Component {
    progressBar: ProgressBar | null = null;
    richTextLabel:RichText | null = null;
    
    start() {
        this.progressBar = this.node.getComponent(ProgressBar);
        this.richTextLabel = this.node.getChildByName('RichText').getComponent(RichText);
    }

    update(deltaTime: number) {
        if (!PlayerController.instance || !PlayerController.instance.actor) {
            return;
        }
        const ex = PlayerController.instance.actor.ex;
        const maxEx = PlayerController.instance.actor.maxEx;
        this.progressBar.progress = ex / maxEx;
        if(ex / maxEx==1){
        this.progressBar!.progress = 0;
        PlayerController.instance.actor.ex = 0;
        PlayerController.instance.actor.level+=1;
        const level = PlayerController.instance.actor.level;
        this.richTextLabel.string = `LV:${level}`;
        }
    }
}


