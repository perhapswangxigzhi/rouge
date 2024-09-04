import { _decorator, assetManager, Component, Enum, Label, Prefab, resources, Sprite, SpriteFrame} from 'cc';
import { SkillManager } from './SkillManager';
const { ccclass, property } = _decorator;
enum SkillType {
    NONE=0,
    IndividualSkill=1,    //单体技能
    RangeSkill=2,  // 范围技能
    
    
}
@ccclass('Skill')
export class Skill extends Component {
   
    attack:number=4;
    skillIndex:number=0;
    skillType:SkillType=SkillType.NONE;
    skillName:string="";
    skillIconFileName: string=""
    skillPre:Prefab|null=null;

    
    initSkill(skillIndex:number,skillType:SkillType,attack:number){
        this.skillIndex=skillIndex;
        this.skillType=skillType;
        this.attack=attack;
        this.skillIconFileName=SkillManager.instance.skillIconFileName[skillIndex]
        this.skillName=SkillManager.instance.skillIconName[skillIndex]
        // assetManager.resources.load(`skill/${this.skillIconFileName}/spriteFrame`, Prefab, (err, prefab ) => {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        // this.skillPre=prefab;
        // this.node.addChild(prefab.instantiate());
        // })
    }
    




}