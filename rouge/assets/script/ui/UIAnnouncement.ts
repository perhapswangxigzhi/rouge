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
        this.announcementLabel.string = 
        `
            版本V1.1.1
                  更新内容：
                1. 新增功能：
                  - 新增bgm
                  - 新增背包装备丢弃查看穿戴功能
                  - 新增装备栏查看取下功能
                  - 实装装备栏属性效果
                 
               2. 优化功能：
                  
               3. 修复BUG:
                  - `;
        // 监听关闭按钮点击事件
        this.closeButton1.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
        this.closeButton2.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
    }

    onCloseButtonClicked() {
        // 关闭公告
        this.node.active=false;
         // 恢复游戏
      director.resume();
    }


}
