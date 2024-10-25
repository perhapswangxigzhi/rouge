import { _decorator, assetManager, Component, Label, Prefab, resources, Sprite, SpriteFrame} from 'cc';
import { SkillManager } from './SkillManager';
import { SkillEmitter } from './SkillEmitter';
import { SkillBar } from './SkillBar';
import { SkillElement } from './SkillElement';
//import { SkillBarList } from './SkillBar';
const { ccclass, property } = _decorator;
enum SkillType {
    NONE=0,
    StrightSkill=1,    //直线技能
    FixedSkill=2,  // 定点释放技能
    PointSkill=3,    // 指向技能
}
enum SkillProperty {
    NONE=0,
    GoldSkill=1,    //金属性
    WoodSkill=2,  // 木属性
    WaterSkill=3,    // 水属性
    FireSkill=4,    // 火属性
    thunderSkill=5,   //雷属性
}
@ccclass('Skill')
export class Skill   {

    skillIndex:number=0;
    skillType:SkillType=SkillType.NONE;
    skillName:string="";
    skillIconFileName: string=""
    skillPre:Prefab|null=null;
    skillIndexStage:number[]=[];
    skillProperty:SkillProperty[]=[]
    // 静态属性，保存单例实例
    private static _instance: Skill | null = null;
    // 私有构造函数
    private constructor() {}
    // 静态方法，访问单例实例
    static get instance(): Skill {
        if (!Skill._instance) {
            Skill._instance = new Skill();
        }
        return Skill._instance;
    }

    initSkill(skillIndex:number){
       this.skillIndexStage.push(skillIndex);
       this.skillProperty.push(SkillManager.instance().skillProperty[skillIndex]);
       SkillEmitter.instance.getSkill(SkillManager.instance().skillIconFileName[skillIndex]);
       this.setskillProperty();
    }
    initAllSkill(){
        if(this.skillIndexStage==null){
            return;
        }
        for(let i=0;i<this.skillIndexStage.length;i++){
            this.skillProperty.push(SkillManager.instance().skillProperty[this.skillIndexStage[i]]);
            SkillEmitter.instance.getSkill(SkillManager.instance().skillIconFileName[this.skillIndexStage[i]]);
            this.setskillProperty();
        }
    }
    setskillProperty(){
        SkillElement.getElementCount();
        SkillElement.goldSkillFetter(SkillElement.elementCount[0]);
        SkillElement.woodSkillFetter(SkillElement.elementCount[1]);
        SkillElement.waterSkillFetter(SkillElement.elementCount[2])
        SkillElement.fireSkillFetter(SkillElement.elementCount[3])
        SkillElement.thunderSkillFetter(SkillElement.elementCount[4])
    }


}