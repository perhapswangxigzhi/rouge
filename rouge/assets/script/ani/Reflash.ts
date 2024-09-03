import { _decorator, assetManager, AudioClip, AudioSource, CCFloat, CCInteger, Component, instantiate, Label, Node, randomRange, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { SkillManager } from '../skill/SkillManager';

const { ccclass, property } = _decorator;

@ccclass('Reflash')
export class Reflash extends Component {
    static instance: Reflash | null = null;
    start() {
        Reflash.instance = this;
    }
    filpCard(UIFrame:Node){
        let changeSprite= UIFrame.getChildByName('SkillBg').getChildByName('SkillIcon').getComponent(Sprite);
        let chanegSkillName= UIFrame.getChildByName('SkillBg').getChildByName('SkillName').getComponent(Label);
        let changeSkillExplain= UIFrame.getChildByName('SkillBg').getChildByName('SkillExplain').getComponent(Label);
        const filpDuration = 0.2;// 翻牌动画持续时间
        tween(UIFrame)
        .to(filpDuration/2, {eulerAngles:new Vec3(0,-90,0)})
        
        .call(() => {
            // 在半翻时更换精灵帧
           SkillManager.instance.randomSkill(changeSprite, chanegSkillName,changeSkillExplain);
           UIFrame.getChildByName('SkillBg').getChildByName('SkillIcon').getComponent(Sprite).spriteFrame = changeSprite.spriteFrame;  
        })
        .to(filpDuration/ 2, { eulerAngles: new Vec3(0,  -180, 0) })
        .call(() => {
            UIFrame.getChildByName('SkillBg').getChildByName('SkillName').getComponent(Label).string = chanegSkillName.string;
            UIFrame.eulerAngles = new Vec3(0, 0, 0);
        })
        .start();
    
    }
}