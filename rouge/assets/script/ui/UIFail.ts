import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIFail')
export class UIFail extends Component {
    onBtnRetryClicked() {
        director.loadScene("game");
        console.log("retry clicked");
    }
    onExitButtonClicked () {
        // 退出游戏
        // director.end();
        // if (typeof window !== 'undefined') {
        //     window.close();
        // }
    }
    onrepeatButtonClicked () {
        console.log("repeat clicked");
    }
}



