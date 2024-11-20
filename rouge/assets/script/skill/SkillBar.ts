import { _decorator, assetManager, Color, Component, Label, macro, Prefab, ProgressBar, resources, Sprite, SpriteFrame} from 'cc';
import { SkillManager } from './SkillManager';
import { SkillEmitter } from './SkillEmitter';
const { ccclass, property } = _decorator;
enum SkillType {
    NONE=0,
    StrightSkill=1,    //直线技能
    FixedSkill=2,  // 定点释放技能
    PointSkill=3,    // 指向技能
}
@ccclass('SkillBar')
export class SkillBar extends Component  {
    progressBar: ProgressBar | null = null;
    SkillIcon: Sprite | null = null;
    static isPause: boolean = false;
    start() {
        this.progressBar = this.node.getComponent(ProgressBar);
        this.SkillIcon = this.node.getChildByName('Sklil_back').getChildByName('SkillIcon').getComponent(Sprite);
    }
    getIcon(skillIndex:string){
        assetManager.resources.load(`skill/${skillIndex}/spriteFrame`, SpriteFrame, (err, spriteFrame ) => {
            if (err) {
                console.error(err);
            }
            this.scheduleOnce(() => {
                this.SkillIcon.spriteFrame = spriteFrame;
            });
    })
    
    }
    skillProgress(skillCooling:number){
       // this.progressBar.progress = 1; // 重置进度条
        let currentCooldown = 0; // 当前冷却进度
        this.schedule(() => {
            if(SkillBar.isPause==true){
                return;
            }
            if (currentCooldown < skillCooling) {
                currentCooldown += 0.05; // 每次增加0.05秒
                this.progressBar.progress = currentCooldown / skillCooling; // 更新进度条宽度
            } 
            else {
                this.progressBar.progress = 0; 
                this.unscheduleAllCallbacks();
            }
        }, 0.05,skillCooling*17, 0); // 更新频率为0.05秒
     
    }
}