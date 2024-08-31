import { _decorator, Button, Component, director, find, Label, Node, Sprite, SpriteFrame } from 'cc';
import { Reflash } from '../ani/Reflash';
import { SkillManager } from '../skill/SkillManager';
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
    @property(Node)
    UIFrame_001: Node | null = null;
    @property(Sprite)
    skillIcon1: Sprite | null = null;
    @property(Label)
    skillName1: Label | null = null;
    @property(Sprite)
    skillIcon2: Sprite | null = null;
    @property(Label)
    skillName2: Label | null = null;
    @property(Sprite)
    skillIcon3: Sprite | null = null;
    @property(Label)
    skillName3: Label | null = null;
    @property(Node)
    UIFrame_002: Node | null = null;
    @property(Node)
    UIFrame_003: Node | null = null;
    start() {
         // 监听关闭按钮点击事件
         this.closeButton.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
         this.choseTalentButton1.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
         this.choseTalentButton2.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
         this.choseTalentButton3.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
         this.reflashButton.node.on(Button.EventType.CLICK, this.onReflashFrmae, this);
        SkillManager.instance.randomSkill(this.skillIcon1, this.skillName1)
        SkillManager.instance.randomSkill(this.skillIcon2, this.skillName2)
        SkillManager.instance.randomSkill(this.skillIcon3, this.skillName3)
    }
    onCloseButtonClicked() {
        // 关闭界面
        this.node.active=false;
    }
    onReflashFrmae(){
        // 刷新界面
        Reflash.instance.filpCard(this.UIFrame_001);
        Reflash.instance.filpCard(this.UIFrame_002);   
        Reflash.instance.filpCard(this.UIFrame_003); 
    }
  
}


