import { _decorator, Color, Component, find, Label, Node, ProgressBar, RichText, Sprite } from 'cc';
import { Actor } from '../Actor';

const { ccclass, property } = _decorator;

@ccclass('EnemyHpBar')
export class EnemyHpBar extends Component {

    progressBar: ProgressBar | null = null;
    label:Label | null = null;
    actor:Actor | null = null;
    start() {
        this.progressBar = this.node.getComponent(ProgressBar);
        this.label = this.node.getChildByName('Label').getComponent(Label);
        this.actor=this.node.parent.getComponent(Actor);
    }

    update(deltaTime: number) {
        this.progressBar!.progress = this.actor.current_ActorProperty.hp / this.actor.current_ActorProperty.maxHp;
         this.label!.string = `${this.actor.current_ActorProperty.hp}/${this.actor.current_ActorProperty.maxHp}`;

    }
}


