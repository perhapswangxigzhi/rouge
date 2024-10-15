import { _decorator, Component, director, find, Node } from 'cc';
import { Actor } from '../actor/Actor';
import { ActorStage } from '../actor/ActorStage';
import { ActorProperty } from '../actor/ActorProperty';
const { ccclass, property } = _decorator;

@ccclass('UIFail')
export class UIFail extends Component {
 
    onReturn() {
        //返回游戏
        director.loadScene("MainUI");
        ActorStage.instance.playerProperty=new ActorProperty("Player",100,10);
    }
    onRevive () {
        //继续游戏
        ActorStage.instance.playerProperty.hp= ActorStage.instance.playerProperty.maxHp;
        this.node.active=false;
        find('LevelCanvas/Player').getComponent(Actor).dead=false;
        find('LevelCanvas/Player').getComponent(Actor).onListenable();
        director.resume();    
       // director.loadScene("game");
    }
   
}



