import { _decorator, Button, Component, director, EventHandler, Label, Node, Sprite, tween } from 'cc';
import { PlayerController } from '../actor/PlayControl';
import { GameEvent } from '../event/GameEvent';
import { CoinDrop } from '../ani/CoinDrop';
const { ccclass, property } = _decorator;
@ccclass('SkillCooling')
export class SkillCooling extends Component {
    button: Button;
    icon: Sprite;
    mask: Sprite;
    label: Label;
    coin:Node;
    start() {
        this.button = this.getComponent(Button) || this.addComponent(Button);
        this.icon = this.node.children[0].getComponent(Sprite);
        this.mask = this.node.children[1].getComponent(Sprite);
        this.label = this.node.children[2].getComponent(Label);
        this.coin=this.node.getChildByName('UIcoin');
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
        
    }
    onClick() {
        
        this.button.enabled = false;
        this.icon.grayscale = true;
        this.mask.fillRange = 1;
        this.coin.active=true;
        this.coin.getComponent(CoinDrop).drop();
       // const random = Math.floor(Math.random() * 9) + 2;
        const tweenTime =  10;
         const playerNode=PlayerController.instance.node;
        director.emit(GameEvent.OnCreate, playerNode); 
        tween(this.mask)
            .to(tweenTime - 1, { fillRange: 1 / tweenTime }, {
                onUpdate: (target: object, ratio: number) => {
                    this.label.string = Math.ceil(tweenTime - (tweenTime - 1) * (ratio)).toString();
                }
            })
            .delay(0.1)
            .to(0.9, { fillRange: 0 }, {
                onUpdate: (target: object, ratio: number) => {
                    this.label.string = (1 - ratio).toFixed(1);
                }
            })
            .call(() => {
                this.label.string = "";
                this.button.enabled = true;
                this.icon.grayscale = false;
            })
            .start();
    }
    onDestroy() {
        // 移除事件监听器
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
    }
}
