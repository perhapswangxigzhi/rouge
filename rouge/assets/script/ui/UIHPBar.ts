import { _decorator, Color, Component, find, Label, Node, ProgressBar, RichText, Sprite } from 'cc';
import { ActorStage } from '../actor/ActorStage';
const { ccclass, property } = _decorator;

@ccclass('UIHPBar')
export class UIHPBar extends Component {

    progressBar: ProgressBar | null = null;
    label:Label | null = null;
    openShield:boolean=false;   //开启护盾
    static instance: UIHPBar | null = null;
    start() {
        this.progressBar = this.node.getComponent(ProgressBar);
        this.label = this.node.getChildByName('Label').getComponent(Label);
        UIHPBar.instance = this;
    }

    update(deltaTime: number) {
        if(!ActorStage.instance){
            return;
        }
        const hp = ActorStage.instance.playerProperty.hp;
        const maxHp = ActorStage.instance.playerProperty.maxHp;
        const shield=ActorStage.instance.playerProperty.shield
        if(this.openShield==false){
            this.progressBar!.progress = hp / maxHp;
            this.label!.string = `${hp}/${maxHp}`;
        }else{
            this.progressBar!.progress = shield / maxHp;
            this.label!.string = `${shield}`;
            if(shield<=0){
                this.openShield=false
                const hp_bar=this.node.getChildByName('Bar');
                this.progressBar.barSprite=hp_bar.getComponent(Sprite)
                this.node.getChildByName("Shield_Bar").active=false;
                find("LevelCanvas/Player/Shield").active=false;
                this.label.color=Color.WHITE;
            }
        }

    }
}


