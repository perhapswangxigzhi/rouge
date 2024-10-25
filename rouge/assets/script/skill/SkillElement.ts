import { _decorator, assetManager, Color, Component, find, instantiate, Label, Node, Prefab, ProgressBar, Sprite, UI } from 'cc';
import { Skill } from './Skill';
import { UIGold } from '../ui/UIGold';
import { UIExBar } from '../ui/UIExBar';
import { DropItemManager } from '../item/DropItemManager';
import { ActorStage } from '../actor/ActorStage';
import { UIFrameLayout } from '../ui/UIFrameLayout';
import { UIHPBar } from '../ui/UIHPBar';
import { SimpleEmitter } from '../actor/projectile/SimpleEmitter';
import { Actor } from '../actor/Actor';
import { BuffManager } from '../buffManager/buffManager';
import { SkillEmitter } from './SkillEmitter';
import { timeUtil } from '../util/TimeUtil';
const { ccclass, property } = _decorator;
enum SkillProperty {
    NONE=0,
    GoldSkill=1,    //金属性
    WoodSkill=2,  // 木属性
    WaterSkill=3,    // 水属性
    FireSkill=4,    // 火属性
    thunderSkill=5,   //雷属性
}

@ccclass('SkillElement')
export class SkillElement extends Component {
    static elementCount:number[]=[0,0,0,0,0];
    static hasSkillFetter: boolean[][] = [[false, false, false], [false, false, false], [false, false, false], [false, false, false], [false, false, false]];
    start() {
        SkillElement.getElementCount();
        this.initElementCount();
    }

   static getElementCount(){
    SkillElement.elementCount=[0,0,0,0,0];
    for(let i=0;i<Skill.instance.skillProperty.length;i++){
        if(Skill.instance.skillProperty[i]==SkillProperty.GoldSkill){
            SkillElement.elementCount[0]+=1;
            continue;
        }
        if(Skill.instance.skillProperty[i]==SkillProperty.WoodSkill){
            SkillElement.elementCount[1]+=1;
            continue;
        }
        if(Skill.instance.skillProperty[i]==SkillProperty.WaterSkill){
            SkillElement.elementCount[2]+=1;
            continue;
        }
        if(Skill.instance.skillProperty[i]==SkillProperty.FireSkill){
            SkillElement.elementCount[3]+=1;
            continue;
        }
        if(Skill.instance.skillProperty[i]==SkillProperty.thunderSkill){
            SkillElement.elementCount[4]+=1;
            continue;
        }
    }
   }
   initElementCount(){
    for(let i=0;i<5;i++){
        if(SkillElement.elementCount[i]!=0){
        this.node.children[i].getChildByName("elementCount").getComponent(Label).string=SkillElement.elementCount[i].toString();
        }
        const _color=this.node.children[i].children[2].children[0].getComponent(Sprite).color
        const _Icolor=new Color(_color.r, _color.g, _color.b, 255)    
        if(SkillElement.elementCount[i]>2){
            this.node.children[i].children[2].children[0].getComponent(Sprite).color=_Icolor;
        }
        if(SkillElement.elementCount[i]>5){
            this.node.children[i].children[2].children[1].getComponent(Sprite).color=_Icolor;
        }
        if(SkillElement.elementCount[i]>9){
            this.node.children[i].children[2].children[2].getComponent(Sprite).color=_Icolor;
        }
       
        
    } 
   }
   //金属性羁绊
   static goldSkillFetter(starCount:number){
        if(starCount<=2){
            return;
        }
        if(starCount>2&&SkillElement.hasSkillFetter[0][1]==false){
            //增加金币经验获取效率
            UIGold.instance.goldCoefficient*=1.5;  
            UIExBar.instance.ExpCoefficient*=1.5;
            SkillElement.hasSkillFetter[0][1]=true;  //标记已获得金属性羁绊
        }
        if(starCount>5&&SkillElement.hasSkillFetter[0][1]==false){
            //造成伤害附加自身金币10%的伤害
            UIGold.instance.canGoldAddition=true;
            SkillElement.hasSkillFetter[0][1]=true; //标记已获得金属性羁绊
        }
        if(starCount>9&&SkillElement.hasSkillFetter[0][2]==false){
            //可选择天赋上限加2
            UIFrameLayout.skillChoseLimited+=2;
            SkillElement.hasSkillFetter[0][2]=true; //标记已获得金属性羁绊
        }
   }
   // 木属性羁绊
   static woodSkillFetter(starCount:number){
    const playerNode=find("LevelCanvas/Player");
        if(starCount<=2){
            return;
        }
        if(starCount>2&&SkillElement.hasSkillFetter[1][0]==false){
            //每秒恢复1%最大生命值
            ActorStage.instance.playerProperty.LifeRecovery=0.01;
            const resumeLife=Math.floor(ActorStage.instance.playerProperty.maxHp* ActorStage.instance.playerProperty.LifeRecovery);
            setInterval(() => {
                ActorStage.instance.playerProperty.hp+=resumeLife
                if(ActorStage.instance.playerProperty.hp>ActorStage.instance.playerProperty.maxHp){
                    ActorStage.instance.playerProperty.hp=ActorStage.instance.playerProperty.maxHp;
                }
            }, 1000);
            SkillElement.hasSkillFetter[1][0]=true; 
          
        }
        if(starCount>5&&SkillElement.hasSkillFetter[1][1]==false){
             // 每10秒可生成一个自己生命值20%的护盾
             const hp_bar=find("UIRoot/Hpbar")
             const shield_bar=hp_bar.getChildByName("Shield_Bar")

             playerNode.getChildByName("Shield").active=true;
             shield_bar.active=true
             ActorStage.instance.playerProperty.shield=Math.floor((ActorStage.instance.playerProperty.maxHp)*0.2)
             hp_bar.getComponent(ProgressBar).barSprite=shield_bar.getComponent(Sprite)
             hp_bar.getComponent(ProgressBar).totalLength=200;
             hp_bar.getChildByName("Label").getComponent(Label).color=Color.YELLOW
             UIHPBar.instance.openShield=true;

            setInterval(() => {
            if(UIHPBar.instance.openShield==true){
                ActorStage.instance.playerProperty.shield=Math.floor((ActorStage.instance.playerProperty.maxHp)*0.2)
            }else{
                playerNode.getChildByName("Shield").active=true;
                shield_bar.active=true
                ActorStage.instance.playerProperty.shield=Math.floor((ActorStage.instance.playerProperty.maxHp)*0.2)
                hp_bar.getComponent(ProgressBar).barSprite=shield_bar.getComponent(Sprite)
                hp_bar.getComponent(ProgressBar).totalLength=200;
                hp_bar.getChildByName("Label").getComponent(Label).color=Color.YELLOW
                UIHPBar.instance.openShield=true;
            }
            }, 10000);
            SkillElement.hasSkillFetter[1][1]=true; 
        }
        if(starCount>9&&SkillElement.hasSkillFetter[1][2]==false){
            //普通攻击时附加两个追踪箭矢
            find("LevelCanvas/Player/Gun/Emitter_Player").getComponent(SimpleEmitter).openTrace=true;
            SkillElement.hasSkillFetter[1][2]=true; 
        }
    }
    // 水属性羁绊
    static waterSkillFetter(starCount:number){
    
        if(starCount<=2){
            return;
        }
        if(starCount>2&&SkillElement.hasSkillFetter[2][0]==false){
            //水属性技能造成伤害时减少敌人50%移动速度与50%攻击速度
            Actor.openDirection=true;
           SkillElement.hasSkillFetter[2][0]=true; 
        }
        if(starCount>5&&SkillElement.hasSkillFetter[2][1]==false){
            //水属性技能造成伤害冻结敌人3s（boss为0.5秒）
            BuffManager.canUseFreezeBuff=true;
            SkillElement.hasSkillFetter[2][1]=true; 
        }
        if(starCount>9&&SkillElement.hasSkillFetter[2][2]==false){
            //对受到减速和冰冻敌人，敌人受到伤害增加100%
            Actor.increaseDeAndFrez=true;
            SkillElement.hasSkillFetter[2][2]=true; 
        }
        
    
    }
    //火属性羁绊
    static fireSkillFetter(starCount:number){
        if(starCount<=2){
            return;
        }
        if(starCount>2&&SkillElement.hasSkillFetter[3][0]==false){
            //提高自身50%攻击力
            ActorStage.instance.playerProperty.attack*=1.5;
            SkillElement.hasSkillFetter[3][0]=true; 
        }
        if(starCount>5&&SkillElement.hasSkillFetter[3][1]==false){
           //技能攻击时给敌人附加灼烧buff，每秒受到50%攻击伤害 
            BuffManager.canUseBurnBuff=true;
           SkillElement.hasSkillFetter[3][1]=true; 
        }
        if(starCount>9&&SkillElement.hasSkillFetter[3][2]==false){
            //提高自身100%攻击速度与100%移动速度
            ActorStage.instance.playerProperty.attackSpeed*=2;
            ActorStage.instance.playerProperty.speed*=2;
            find("LevelCanvas/Player").getComponent(Actor).linearSpeed= ActorStage.instance.playerProperty.speed;
            SkillElement.hasSkillFetter[3][2]=true; 
        }
    }
     //雷属性羁绊
     static thunderSkillFetter(starCount:number){
        if(starCount<=2){
            return;
        }
        if(starCount>2&&SkillElement.hasSkillFetter[4][0]==false){
            //附加雷蛰buff
            BuffManager.canUseThunderBuff=true;
            SkillElement.hasSkillFetter[4][0]=true; 
        }
        if(starCount>5&&SkillElement.hasSkillFetter[4][1]==false){
           //技能冷却时间减少20%
           ActorStage.instance.playerProperty.cd=0.2;
           SkillElement.hasSkillFetter[4][1]=true; 
        }
        if(starCount>9&&SkillElement.hasSkillFetter[4][2]==false){
            //释放技能时有30%几率重置冷却时间
           SkillEmitter.replaceSkill=true
            SkillElement.hasSkillFetter[4][2]=true; 
        }
     }
}
