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

        
            版本V1.0.10
                  更新内容：
                1. 新增功能：
                  - 新增boss类
                  - 完成boss类AL的制作
                  - 新增boss突进攻击方式
                  - 新增boss技能

                  
                  

               2. 优化功能：
                  
               3. 修复BUG:
                  - 
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
