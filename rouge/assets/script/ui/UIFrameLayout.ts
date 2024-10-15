import { _decorator, Button, Color, Component, director, find, Label, Node, Sprite, SpriteFrame, tween, UI, Vec3 } from 'cc';
import { Reflash } from '../ani/Reflash';
import { SkillManager } from '../skill/SkillManager';
import { Skill } from '../skill/Skill';
import { UItalendRemind } from './UItalendRemind';
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
    @property(Label)
    skillExplain1: Label | null = null;
    @property(Node)
    UIFrame_002: Node | null = null;
    @property(Sprite)
    skillIcon2: Sprite | null = null;
    @property(Label)
    skillName2: Label | null = null;
    @property(Label)
    skillExplain2: Label | null = null;
    @property(Node)
    UIFrame_003: Node | null = null;
    @property(Sprite)
    skillIcon3: Sprite | null = null;
    @property(Label)
    skillName3: Label | null = null;
    @property(Label)
    skillExplain3: Label | null = null;
    @property(Node)
    dialog: Node | null = null;
    @property(Node)
    dialog1: Node | null = null;
    choseReflash:boolean=true;
    skillIndex1:number=0;
    skillIndex2:number=0;
    skillIndex3:number=0;
    start() {
         // 监听关闭按钮点击事件
        this.closeButton.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
        this.choseTalentButton1.node.on(Button.EventType.CLICK, this.onchoseTalent_1, this);
        this.choseTalentButton2.node.on(Button.EventType.CLICK, this.onchoseTalent_2, this);
        this.choseTalentButton3.node.on(Button.EventType.CLICK, this.onchoseTalent_3, this);
        this.reflashButton.node.on(Button.EventType.CLICK, this.onReflashFrmae, this);
        this.skillIndex1=SkillManager.instance.randomSkill(this.skillIcon1, this.skillName1,this.skillExplain1)
        this.skillIndex2=SkillManager.instance.randomSkill(this.skillIcon2, this.skillName2,this.skillExplain2)
        this.skillIndex3=SkillManager.instance.randomSkill(this.skillIcon3, this.skillName3,this.skillExplain3)
    }
    onCloseButtonClicked() {
        // 关闭界面
        this.dialog.active=false;
        this.dialog1.active=false;
        this.node.active=false;
        
    }
    onReflashFrmae(){
        // 刷新界面
        if( UItalendRemind.instance.Count!=0){
        Reflash.instance.filpCard(this.UIFrame_001);
        Reflash.instance.filpCard(this.UIFrame_002);   
        Reflash.instance.filpCard(this.UIFrame_003);
        this.dialog.active=false;
        UItalendRemind.instance.reflashCount+=1;
        this.scheduleOnce(()=>{
        this.skillIndex1= SkillManager.instance.skillIconName.indexOf(this.skillName1.string)
        this.skillIndex2= SkillManager.instance.skillIconName.indexOf(this.skillName2.string)
        this.skillIndex3= SkillManager.instance.skillIconName.indexOf(this.skillName3.string)
        },0.5)
        }else{
            this.dialog1.active=true;
            const colorTween = tween(this.dialog1.getComponent(Sprite))
            .to(0.75, { color: new Color(255, 255, 255, 255) }) // 恢复颜色
            .delay(0.5)
            .to(0.75, { color: new Color(255, 255, 255, 0) }); // 渐隐
            colorTween.start();
       
    }
}
    onchoseTalent_1(){
        // 选择第一个天赋框
        if( UItalendRemind.instance.Count!=0){
        Skill.instance.initSkill(this.skillIndex1)
        this.scheduleOnce(()=>{
            this.node.active=false;
            if(UItalendRemind.instance.Count>0){
                this.onReflashFrmae();
            }
           },0.1)
        } 
        else {
        this.dialog.active=true;
        const colorTween = tween(this.dialog.getComponent(Sprite))
            .to(0.75, { color: new Color(255, 255, 255, 255) }) // 恢复颜色
            .delay(0.5)
            .to(0.75, { color: new Color(255, 255, 255, 0) }); // 渐隐
        colorTween.start();
        }
       
    }
    onchoseTalent_2(){
        // 选择第二个天赋框
        if(UItalendRemind.instance.Count!=0){
        Skill.instance.initSkill(this.skillIndex2)
        this.scheduleOnce(()=>{
            this.node.active=false;
            if(UItalendRemind.instance.Count>0){
                this.onReflashFrmae();
            }
           },0.1)
        }else{
            this.dialog.active=true;
            const colorTween = tween(this.dialog.getComponent(Sprite))
                .to(0.75, { color: new Color(255, 255, 255, 255) }) // 恢复颜色
                .delay(0.5)
                .to(0.75, { color: new Color(255, 255, 255, 0) }); // 渐隐
            colorTween.start();
        }
       
    }
    onchoseTalent_3(){
        // 选择第三个天赋框
        if(UItalendRemind.instance.Count!=0){
        Skill.instance.initSkill(this.skillIndex3)
        this.scheduleOnce(()=>{
            this.node.active=false;
            if(UItalendRemind.instance.Count>0){
                this.onReflashFrmae();
            }
           },0.1)
     }else{
        this.dialog.active=true;
        const colorTween = tween(this.dialog.getComponent(Sprite))
            .to(0.75, { color: new Color(255, 255, 255, 255) }) // 恢复颜色
            .delay(0.5)
            .to(0.75, { color: new Color(255, 255, 255, 0) }); // 渐隐
        colorTween.start();
    }
       
       
    }
  
}


