import { _decorator, Animation, assetManager, CCFloat, Component, find, instantiate, macro, Node, Prefab, RigidBody2D, tween, v2, v3, Vec2, Vec3 } from "cc";
import { Skill } from "./Skill";
import { StrightSkill } from "./StrightSkill";
import { Actor } from "../actor/Actor";
import { SkillManager } from "./SkillManager";
import { SkillBar } from "./SkillBar";
import { ActorStage } from "../actor/ActorStage";
//import { SkillBarList } from "./SkillBar";
const { ccclass, property } = _decorator;
enum SkillType {
    NONE=0,
    StrightSkill=1,    //直线技能
    FixedSkill=2,  // 定点释放技能
    PointSkill=3,    // 指向技能
    
}
@ccclass('SkillEmitter')
export class SkillEmitter extends Component {
    attack:number;
    static isPause:boolean=false;
    //skillType:SkillType
    skill:Skill|null=null;
     @property(CCFloat)
     startLinearSpeed: number = 0;
     canvasNode:Node=null;
     @property(Prefab)
     strightSkillPrefab:Prefab=null;
     @property(Prefab)
     strightSkillPrefab1:Prefab=null;
     @property(Prefab)
     strightSkillPrefab2:Prefab=null;
     @property(Prefab)
     fixedSkillPrefab:Prefab=null;
     @property(Prefab)
     fixedSkillPrefab1:Prefab=null;
     @property(Prefab)
     fixedSkillPrefab2:Prefab=null;
     @property(Prefab)
     fixedSkillPrefab3:Prefab=null;
     @property(Prefab)
     fixedSkillPrefab4:Prefab=null;
     @property(Prefab)
     fixedSkillPrefab5:Prefab=null;
     @property(Prefab)
     pointSkillPrefab:Prefab=null;
     @property(Prefab)
     HealingSkillPrefab:Prefab=null;
     @property(Prefab)
     skillBarPrefab:Prefab=null;
     @property(Prefab)
     chostSkillPrefab:Prefab=null;
     skillBarList:Node=null;
     static replaceSkill:boolean=false;
     static instance:SkillEmitter|null=null;
     actor:Actor|null=null;

    start(){
        const playerNode=find('LevelCanvas/Player')
        this.skillBarList=find(`UIRoot/SkillBarList`)
        this.actor=playerNode.getComponent(Actor)
        SkillEmitter.instance=this;
        }
        getSkill(skillIconFileName:string){
            assetManager.resources.load(`skillPre/${skillIconFileName}`, Prefab, (err, prefab ) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.skillRealse(prefab.name);
            })
        }
        skillRealse(skillName:string){
          if(skillName){
            console.log("选择天赋的姓名",skillName)
            let skillbar=instantiate(this.skillBarPrefab)
            this.skillBarList.addChild(skillbar)
            skillbar.getComponent(SkillBar).getIcon(skillName)
            switch(skillName){
                case "HolySpring_skillicon_30203":
                    skillbar.getComponent(SkillBar).skillProgress(this.setTime(3));
                    this.schedule(() => {
                        if(SkillEmitter.isPause==true){
                            return;
                        }
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(3));
                        let node=instantiate(this.strightSkillPrefab) 
                        node.position = this.node.parent.position;
                        node.rotation = this.node.parent.rotation;
                        this.node.parent.parent.addChild(node);
                            if(SkillEmitter.replaceSkill==true){
                                if (Math.random() < 0.3) { // 30% 的几率
                                    this.scheduleOnce(() => {
                                        skillbar.getComponent(SkillBar).skillProgress(0.1);
                                        let nodeAgain = instantiate(this.strightSkillPrefab);
                                        nodeAgain.position = this.node.parent.position;
                                        nodeAgain.rotation = this.node.parent.rotation;
                                        this.node.parent.parent.addChild(nodeAgain);
                                    }, 0.1); // 立即执行
                                }
                            }
                        }
                        , this.setTime(3), macro.REPEAT_FOREVER,0);
                    break;
                case "HolySpring_skillicon_30217":
                    skillbar.getComponent(SkillBar).skillProgress(this.setTime(4));
                     this.schedule(() => {
                            if(SkillEmitter.isPause==true){
                                return;
                            }
                            skillbar.getComponent(SkillBar).skillProgress(this.setTime(4));
                            let node=instantiate(this.strightSkillPrefab1) 
                            node.position = this.node.parent.position;
                            node.rotation = this.node.parent.rotation;
                            this.node.parent.parent.addChild(node);
                            if(SkillEmitter.replaceSkill==true){
                                if (Math.random() < 0.3) { // 30% 的几率
                                    this.scheduleOnce(() => {
                                        skillbar.getComponent(SkillBar).skillProgress(0.1);
                                        let node=instantiate(this.strightSkillPrefab1) 
                                        node.position = this.node.parent.position;
                                        node.rotation = this.node.parent.rotation;
                                        this.node.parent.parent.addChild(node);
                                    }, 0.1); // 立即执行
                                }
                            }
                            
                            }
                            , this.setTime(4), macro.REPEAT_FOREVER, 0);
                    break;
                case "HolySpring_skillicon_30021":
                    skillbar.getComponent(SkillBar).skillProgress(this.setTime(8));
                    this.schedule(() => {
                        if(SkillEmitter.isPause==true){
                            return;
                        }
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(8));
                        let node1=instantiate(this.fixedSkillPrefab) 
                        node1.position = new Vec3(this.node.parent.position.x+100,this.node.parent.position.y,this.node.parent.position.z);
                        this.node.parent.parent.addChild(node1);
                        let node2=instantiate(this.fixedSkillPrefab) 
                        node2.position = new Vec3(this.node.parent.position.x,this.node.parent.position.y+100,this.node.parent.position.z);
                        this.node.parent.parent.addChild(node2);
                        let node3=instantiate(this.fixedSkillPrefab) 
                        node3.position = new Vec3(this.node.parent.position.x-100,this.node.parent.position.y,this.node.parent.position.z);
                        this.node.parent.parent.addChild(node3);
                        let node4=instantiate(this.fixedSkillPrefab) 
                        node4.position = new Vec3(this.node.parent.position.x,this.node.parent.position.y-100,this.node.parent.position.z);
                        this.node.parent.parent.addChild(node4);
                        if(SkillEmitter.replaceSkill==true){
                            if (Math.random() < 0.3) { // 30% 的几率
                                this.scheduleOnce(() => {
                                    skillbar.getComponent(SkillBar).skillProgress(0.1);
                                    let node1=instantiate(this.fixedSkillPrefab) 
                                    node1.position = new Vec3(this.node.parent.position.x+100,this.node.parent.position.y,this.node.parent.position.z);
                                    this.node.parent.parent.addChild(node1);
                                    let node2=instantiate(this.fixedSkillPrefab) 
                                    node2.position = new Vec3(this.node.parent.position.x,this.node.parent.position.y+100,this.node.parent.position.z);
                                    this.node.parent.parent.addChild(node2);
                                    let node3=instantiate(this.fixedSkillPrefab) 
                                    node3.position = new Vec3(this.node.parent.position.x-100,this.node.parent.position.y,this.node.parent.position.z);
                                    this.node.parent.parent.addChild(node3);
                                    let node4=instantiate(this.fixedSkillPrefab) 
                                    node4.position = new Vec3(this.node.parent.position.x,this.node.parent.position.y-100,this.node.parent.position.z);
                                    this.node.parent.parent.addChild(node4);
                                }, 0.1); // 立即执行
                            }
                        }
                         }
                        , this.setTime(8), macro.REPEAT_FOREVER, 0);
                    break;
                case "HolySpring_skillicon_30102":
                    skillbar.getComponent(SkillBar).skillProgress(this.setTime(8));
                    this.schedule(() => {
                        if(SkillEmitter.isPause==true){
                            return;
                        }
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(8));
                        let node=instantiate(this.fixedSkillPrefab1) 
                        node.position = this.node.position;
                        this.node.parent.parent.addChild(node);
                        if(SkillEmitter.replaceSkill==true){
                            if (Math.random() < 0.3) { // 30% 的几率
                                this.scheduleOnce(() => {
                                    skillbar.getComponent(SkillBar).skillProgress(0.1);
                                    let node=instantiate(this.fixedSkillPrefab1) 
                                    node.position = this.node.position;
                                    this.node.parent.parent.addChild(node);
                                }, 0.1); // 立即执行
                            }
                        }
                         }
                        , this.setTime(8), macro.REPEAT_FOREVER, 0);
                    break;
                case "HolySpring_skillicon_30130":
                    skillbar.getComponent(SkillBar).skillProgress(this.setTime(6));
                    this.schedule(() => {
                        if(SkillEmitter.isPause==true){
                            return;
                        }
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(8));
                            let node=instantiate(this.fixedSkillPrefab2) 
                            node.position = this.node.parent.position;
                            this.node.parent.parent.addChild(node);
                            if(SkillEmitter.replaceSkill==true){
                                if (Math.random() < 0.3) { // 30% 的几率
                                    this.scheduleOnce(() => {
                                        skillbar.getComponent(SkillBar).skillProgress(0.1);
                                        let node=instantiate(this.fixedSkillPrefab2) 
                                        node.position = this.node.parent.position;
                                        this.node.parent.parent.addChild(node);
                                    }, 0.1); // 立即执行
                                }
                            }
                            }
                    , this.setTime(8), macro.REPEAT_FOREVER, 0);
                    break;
                case "HolySpring_skillicon_50106":
                    skillbar.getComponent(SkillBar).skillProgress(this.setTime(8));
                    this.schedule(() => {
                        if(SkillEmitter.isPause==true){
                            return;
                        }
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(8));
                        let node=instantiate(this.fixedSkillPrefab3) 
                        this.node.parent.parent.addChild(node);
                        try {
                            node.worldPosition =this.getEnemy().worldPosition
                        } catch (error) {
                            console.log(error)
                            node.worldPosition=this.node.parent.position
                        }
                        if(SkillEmitter.replaceSkill==true){
                            if (Math.random() < 0.3) { // 30% 的几率
                                this.scheduleOnce(() => {
                                        skillbar.getComponent(SkillBar).skillProgress(0.1);
                                        let node=instantiate(this.fixedSkillPrefab3) 
                                        this.node.parent.parent.addChild(node);
                                    try {
                                        node.worldPosition =this.getEnemy().worldPosition
                                    } catch (error) {
                                        console.log(error)
                                        node.worldPosition=this.node.parent.position
                                    }
                                }, 0.1); // 立即执行
                            }
                        }
                        }
                        , this.setTime(8), macro.REPEAT_FOREVER, 0);
                    break;
                case "HolySpring_skillicon_30204":
                    skillbar.getComponent(SkillBar).skillProgress(this.setTime(8));
                    this.schedule(() => {
                        if(SkillEmitter.isPause==true){
                            return;
                        }
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(8));
                        let node=instantiate(this.pointSkillPrefab) 
                        node.position = this.node.parent.parent.position;
                        this.node.parent.parent.parent.addChild(node);
                        if(SkillEmitter.replaceSkill==true){
                            if (Math.random() < 0.3) { // 30% 的几率
                                this.scheduleOnce(() => {
                                    skillbar.getComponent(SkillBar).skillProgress(0.1);
                                    let node=instantiate(this.pointSkillPrefab) 
                                    node.position = this.node.parent.parent.position;
                                    this.node.parent.parent.parent.addChild(node);
                                }, 0.1); // 立即执行
                            }
                        }
                        
                         }
                    , this.setTime(8), macro.REPEAT_FOREVER, 0);
                    break;
                    case "HolySpring_skillicon_30135":
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(8));
                        this.schedule(() => {
                            if(SkillEmitter.isPause==true){
                                return;
                            }
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(8));
                        let node=instantiate(this.fixedSkillPrefab4) 
                        node.position = this.node.position;
                        this.node.parent.parent.addChild(node);
                        if(SkillEmitter.replaceSkill==true){
                            if (Math.random() < 0.3) { // 30% 的几率
                                this.scheduleOnce(() => {
                                    skillbar.getComponent(SkillBar).skillProgress(0.1);
                                    let node=instantiate(this.fixedSkillPrefab4) 
                                    node.position = this.node.position;
                                    this.node.parent.parent.addChild(node);
                                }, 0.1); // 立即执行
                            }
                        }
                        }
                        , this.setTime(8), macro.REPEAT_FOREVER, 0);
                        break;
                    case "HolySpring_skillicon_30224":
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(4));
                    this.schedule(() => {
                        if(SkillEmitter.isPause==true){
                            return;
                        }
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(4));
                        let node=instantiate(this.fixedSkillPrefab5) 
                        node.position = this.node.parent.position;
                        this.node.parent.parent.addChild(node);
                        if(SkillEmitter.replaceSkill==true){
                            if (Math.random() < 0.3) { // 30% 的几率
                                this.scheduleOnce(() => {
                                    skillbar.getComponent(SkillBar).skillProgress(0.1);
                                    let node=instantiate(this.fixedSkillPrefab5) 
                                    node.position = this.node.parent.position;
                                    this.node.parent.parent.addChild(node);
                                }, 0.1); // 立即执行
                            }
                        }
                        }
                        , this.setTime(4), macro.REPEAT_FOREVER, 0);
                        break;  
                    case "HolySpring_skillicon_30229":
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(4));
                        this.schedule(() => {
                            if(SkillEmitter.isPause==true){
                                return;
                            }
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(4));
                        let node=instantiate(this.strightSkillPrefab2) 
                        node.position = this.node.parent.position;
                        node.rotation = this.node.parent.rotation;
                        this.node.parent.parent.addChild(node);
                        if(SkillEmitter.replaceSkill==true){
                            if (Math.random() < 0.3) { // 30% 的几率
                                this.scheduleOnce(() => {
                                    skillbar.getComponent(SkillBar).skillProgress(0.1);
                                    let node=instantiate(this.strightSkillPrefab2) 
                                    node.position = this.node.parent.position;
                                    node.rotation = this.node.parent.rotation;
                                    this.node.parent.parent.addChild(node);
                                }, 0.1); // 立即执行
                            }
                        }
                        }
                        , this.setTime(4), macro.REPEAT_FOREVER, 0);
                        break;  
                    case "HolySpring_skillicon_30310":
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(10));
                    this.schedule(() => {
                        if(SkillEmitter.isPause==true){
                            return;
                        }
                        skillbar.getComponent(SkillBar).skillProgress(this.setTime(10));
                        let node=instantiate(this.HealingSkillPrefab) 
                        node.position = this.node.position;
                        this.node.parent.parent.addChild(node);
                        if(SkillEmitter.replaceSkill==true){
                            if (Math.random() < 0.3) { // 30% 的几率
                                this.scheduleOnce(() => {
                                    skillbar.getComponent(SkillBar).skillProgress(0.1);
                                    let node=instantiate(this.HealingSkillPrefab) 
                                    node.position = this.node.position;
                                    this.node.parent.parent.addChild(node);
                                }, 0.1); // 立即执行
                            }
                        }
                    }
                    , this.setTime(10), macro.REPEAT_FOREVER, 0);
                            break;  
                default:
                    console.log("该技能未实现");
                    break;
            }
        }
    }
    getEnemy(): Node {
        for(let i=0;i<=2;i++){
            const enemyNode=find('LevelCanvas').getChildByName(`Enemy${i}`)
            if(enemyNode!=null&&enemyNode.isValid==true){
                return enemyNode ;
            }else{
                return null;
            }
        }
    }
    setTime(time:number):number{
        time=time-time*ActorStage.instance.playerProperty.cd
        return time;
        
    }

}
