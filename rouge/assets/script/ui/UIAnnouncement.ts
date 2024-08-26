import { _decorator, Button, Component, director, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIAnnouncement')
export class UIAnnouncement extends Component {
    @property(Label)
    announcementLabel: Label = null;

    @property(Button)
    closeButton1: Button = null;
    @property(Button)
    closeButton2: Button = null;
    start() {
        // 设置公告内容
        this.announcementLabel.string = `更新内容：
        1. 新增功能：
           - 增加近战敌人攻击
        2. 优化功能：
           - 优化近战敌人行为树逻辑
        3. 修复BUG:
           - 修复近战攻击失效问题`;
        // 监听关闭按钮点击事件
        this.closeButton1.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
        this.closeButton2.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
    }

    onCloseButtonClicked() {
        // 关闭公告
        this.node.active=false;
        console.log(this.node.active);
         // 恢复游戏
      director.resume();
    }


}
