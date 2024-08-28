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
        const ex = PlayerController.instance.actor.playerProperty.ex;
        const maxEx = PlayerController.instance.actor.playerProperty.maxEx;
        this.progressBar.progress = ex / maxEx;
        if(ex / maxEx==1){
        this.progressBar!.progress = 0;
        PlayerController.instance.actor.playerProperty.ex = 0;
        PlayerController.instance.actor.playerProperty.level+=1;
        const level = PlayerController.instance.actor.playerProperty.level;
        this.richTextLabel.string = `LV:${level}`;
        }
    }
}


