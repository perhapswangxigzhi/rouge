import { _decorator, Component, Node, RichText } from 'cc';
import { PlayerController } from '../actor/PlayControl';
const { ccclass, property } = _decorator;

@ccclass('UIGold')


export class UIGold extends Component {
    richTextLabel:RichText | null = null;
    killCount:number=0;
    start() {
        this.richTextLabel = this.node.getChildByName('RichText').getComponent(RichText);
    }

    update(deltaTime: number) {
        this.killCount= PlayerController.instance.actor.playerProperty.killCount;
        this.richTextLabel!.string = this.killCount.toString();
    }
}


