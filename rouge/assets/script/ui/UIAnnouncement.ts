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

        
            版本V1.0.8
                  更新内容：
                1. 新增功能：
                  - 新增龙骨角色受击反馈
                  - 新增金币挑战怪
                  - 实现挑战怪全部死亡后触发奖励功能
                  
                  

               2. 优化功能：
                  - 优化行为树的al逻辑,使其可以扩充更多的功能
               3. 修复BUG:
                  - 修复人物死亡后的初始化bug
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
