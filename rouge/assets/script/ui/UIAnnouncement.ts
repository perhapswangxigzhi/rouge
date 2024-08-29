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

        
            版本V1.0.2 
                  更新内容：
                1. 新增功能：
                  - 新增点击金币经验怪挑战后奖励散落且可收回功能
                  - 天赋选择模板初步完成

               2. 优化功能：
                  - 
               3. 修复BUG:
                  - 修复挑战后的金币经验奖励回收计数问题
                  - 修复吃经验时经验一直不消失问题`;
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
