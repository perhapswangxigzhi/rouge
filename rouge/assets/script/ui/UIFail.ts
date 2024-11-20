import { _decorator, Component, director, find, Node } from 'cc';
import { Actor } from '../actor/Actor';
import { ActorStage } from '../actor/ActorStage';
import { ActorProperty } from '../actor/ActorProperty';
const { ccclass, property } = _decorator;

@ccclass('UIFail')
export class UIFail extends Component {
    // private sceneLoading: boolean = false; // 添加一个状态标志
    onReturn() {
            director.loadScene("MainUI");
    }
    onRevive () {
        //继续游戏
        ActorStage.instance.playerProperty.hp= ActorStage.instance.playerProperty.maxHp;
        this.node.active=false;
        find('LevelCanvas/Player').getComponent(Actor).dead=false;
        find('LevelCanvas/Player').getComponent(Actor).onListenable();
       
        director.resume();    
    }
   
}



