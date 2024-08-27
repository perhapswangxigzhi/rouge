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
           - 新增敌人物品掉落功能
           - 新增物品时区吸附功能
           - 新增经验条获取功能

        2. 优化功能：
           - 
        3. 修复BUG:
           - 修复物品吸附卡住问题
           - 修复经验条显示问题`;
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
