import { _decorator, assetManager, Component, Label, Prefab, resources, Sprite, SpriteFrame} from 'cc';
import { SkillManager } from './SkillManager';
import { SkillEmitter } from './SkillEmitter';
const { ccclass, property } = _decorator;
enum SkillType {
    NONE=0,
    StrightSkill=1,    //直线技能
    FixedSkill=2,  // 定点释放技能
    PointSkill=3,    // 指向技能
    
}
@ccclass('Skill')
export class Skill extends Component  {

    skillIndex:number=0;
    skillType:SkillType=SkillType.NONE;
    skillName:string="";
    skillIconFileName: string=""
    skillPre:Prefab|null=null;
    static instance:Skill|null=null;
    
    onLoad() {
        Skill.instance=this;
    }
    initSkill(skillIndex:number){
        //this.skillIndex=skillIndex;
      // this.skillType=skillType;
    //    this.skillIconFileName=SkillManager.instance.skillIconFileName[skillIndex]
    //    console.log("initSkill:获取的序号"+skillIndex);
       SkillEmitter.instance.getSkill(SkillManager.instance.skillIconFileName[skillIndex]);
    }
    




}