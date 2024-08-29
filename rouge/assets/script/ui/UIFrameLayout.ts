import { _decorator, Button, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIFrameLayout')
export class UIFrameLayout extends Component {
    @property(Button)
    closeButton: Button = null;
    @property(Button)
    choseTalentButton1: Button = null;
    @property(Button)
    choseTalentButton2: Button = null;
    @property(Button)
    choseTalentButton3: Button = null;
    @property(Button)
    reflashButton: Button = null;
    start() {
         // 监听关闭按钮点击事件
         this.closeButton.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
         this.choseTalentButton1.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
         this.choseTalentButton2.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
         this.choseTalentButton3.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
    }
    onCloseButtonClicked() {
        // 关闭界面
        this.node.active=false;
        console.log(this.node.active);
         // 恢复游戏
      director.resume();
    }
  
}


