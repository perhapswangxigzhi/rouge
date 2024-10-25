import { _decorator, Component, Node, RichText } from 'cc';
import { PlayerController } from '../actor/PlayControl';
import { ActorStage } from '../actor/ActorStage';
const { ccclass, property } = _decorator;

@ccclass('UIGold')


export class UIGold extends Component {
    richTextLabel:RichText | null = null;
    killCount:number=0;         
    coinCount:number=0   //挑战怪所获金币
    buyCount:number=0   //购买所需金币
    Count:number=0          //总金币
    goldCoefficient=2  //金币系数
    canGoldAddition:boolean=false; //是否可以附加金币相关攻击力
    static instance:UIGold | null = null;
    start() {
        UIGold.instance = this;
        this.richTextLabel = this.node.getChildByName('RichText').getComponent(RichText);
    }

    update(deltaTime: number) {
        if(!ActorStage.instance){
            return;
        }
        if(this.canGoldAddition==true){
            ActorStage.instance.playerProperty.goldAddition=Math.floor(UIGold.instance.Count*0.1);
        }
        this.killCount=ActorStage.instance.playerProperty.killCount;
        this.Count=this.coinCount*this.goldCoefficient+this.killCount*this.goldCoefficient+this.buyCount;
        this.richTextLabel!.string = this.Count.toString();
    }
}


