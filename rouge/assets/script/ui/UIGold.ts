import { _decorator, Component, Node, RichText } from 'cc';
import { PlayerController } from '../actor/PlayControl';
const { ccclass, property } = _decorator;

@ccclass('UIGold')


export class UIGold extends Component {
    richTextLabel:RichText | null = null;
    killCount:number=0;
    coinCount:number=0
    Count:number=0
    static instance:UIGold | null = null;
    start() {
        UIGold.instance = this;
        this.richTextLabel = this.node.getChildByName('RichText').getComponent(RichText);
    }

    update(deltaTime: number) {
        this.killCount= PlayerController.instance.actor.playerProperty.killCount;
        this.Count=this.coinCount+this.killCount*2;
        this.richTextLabel!.string = this.Count.toString();
    }
}


