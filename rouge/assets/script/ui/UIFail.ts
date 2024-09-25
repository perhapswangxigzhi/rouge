import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIFail')
export class UIFail extends Component {
    onReturn() {
        director.loadScene("MainUI");
    }
    onRevive () {
        director.loadScene("game");
    }
   
}



