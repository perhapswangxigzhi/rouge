import { _decorator, Component, Label, Node, ProgressBar, RichText } from 'cc';
import { PlayerController } from '../actor/PlayControl';
import { ActorStage } from '../actor/ActorStage';
const { ccclass, property } = _decorator;

@ccclass('UIHPBar')
export class UIHPBar extends Component {

    progressBar: ProgressBar | null = null;
    richTextLabel:RichText | null = null;
    start() {
        this.progressBar = this.node.getComponent(ProgressBar);
        this.richTextLabel = this.node.getChildByName('RichText').getComponent(RichText);
    }

    update(deltaTime: number) {
        // if (!PlayerController.instance || !PlayerController.instance.actor) {
        //     return;
        // }
        if(!ActorStage.instance){
            return;
        }
        // const hp = PlayerController.instance.actor.playerProperty.hp;
        // const maxHp = PlayerController.instance.actor.playerProperty.maxHp;
        const hp = ActorStage.instance.playerProperty.hp;
        const maxHp = ActorStage.instance.playerProperty.maxHp;
        
        this.progressBar!.progress = hp / maxHp;
        this.richTextLabel!.string = `${hp}/${maxHp}`;
    }
}


