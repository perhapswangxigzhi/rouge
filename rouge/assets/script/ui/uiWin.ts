import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('uiWin')
export class uiWin extends Component {
    onBtnRetryClicked(){
        director.loadScene('MainUI');
    }
    onExitButtonClicked () {
        // 退出游戏
        // director.end();
        // if (typeof window !== 'undefined') {
        //     window.close();
        // }
    }
}


