import { _decorator, Animation, assetManager, CCFloat, Component, find, instantiate, macro, Node, Prefab, RigidBody2D, tween, v2, v3, Vec2, Vec3 } from "cc";
import { Skill } from "./Skill";
import { StrightSkill } from "./StrightSkill";
import { Actor } from "../actor/Actor";
import { SkillManager } from "./SkillManager";
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
     fixedSkillPrefab6:Prefab=null;
     @property(Prefab)
     pointSkillPrefab:Prefab=null;
     @property(Prefab)
     HealingSkillPrefab:Prefab=null;
     @property(Prefab)
     chostSkillPrefab:Prefab=null;
    
     static instance:SkillEmitter|null=null;
     actor:Actor|null=null;
    start(){
        const playerNode=find('LevelCanvas/Player')
        this.actor=playerNode.getComponent(Actor)
        SkillEmitter.instance=this;
         // 重复释放各种技能
        // this.schedule(() => {
        // let node=instantiate(this.strightSkillPrefab) 
        // node.position = this.node.parent.position;
        // node.rotation = this.node.parent.rotation;
        // this.node.parent.parent.addChild(node);
        //  }
        // , 1, macro.REPEAT_FOREVER, 0);
        // this.schedule(() => {
        //     let node=instantiate(this.strightSkillPrefab1) 
        //     node.position = this.node.parent.position;
        //     node.rotation = this.node.parent.rotation;
        //     this.node.parent.parent.addChild(node);
        //      }
        //     , 4, macro.REPEAT_FOREVER, 0);
        // this.schedule(() => {
        //     let node1=instantiate(this.fixedSkillPrefab) 
        //     node1.position = new Vec3(this.node.parent.position.x+100,this.node.parent.position.y,this.node.parent.position.z);
        //     this.node.parent.parent.addChild(node1);
        //     let node2=instantiate(this.fixedSkillPrefab) 
        //     node2.position = new Vec3(this.node.parent.position.x,this.node.parent.position.y+100,this.node.parent.position.z);
        //     this.node.parent.parent.addChild(node2);
        //     let node3=instantiate(this.fixedSkillPrefab) 
        //     node3.position = new Vec3(this.node.parent.position.x-100,this.node.parent.position.y,this.node.parent.position.z);
        //     this.node.parent.parent.addChild(node3);
        //     let node4=instantiate(this.fixedSkillPrefab) 
        //     node4.position = new Vec3(this.node.parent.position.x,this.node.parent.position.y-100,this.node.parent.position.z);
        //     this.node.parent.parent.addChild(node4);
        //      }
        //     , 8, macro.REPEAT_FOREVER, 0);
        
        // this.schedule(() => {
        //     let node=instantiate(this.fixedSkillPrefab1) 
           
        //         node.position = this.node.parent.position;
        //     this.node.parent.parent.addChild(node);
        //      }
        //     , 4, macro.REPEAT_FOREVER, 0);
        // this.schedule(() => {
        //     let node=instantiate(this.fixedSkillPrefab2) 
        //         node.position = this.node.parent.position;
        //         this.node.parent.parent.addChild(node);
        //          }
        // , 6, macro.REPEAT_FOREVER, 0);
        
        // this.schedule(() => {
        //     let node=instantiate(this.fixedSkillPrefab3) 
        //     node.position = this.node.parent.position;
        //     this.node.parent.parent.addChild(node);
        //      }
        //     , 4, macro.REPEAT_FOREVER, 0);
        // this.schedule(() => {
        //         let node=instantiate(this.pointSkillPrefab) 
        //         node.position = this.node.parent.parent.position;
        //       //  node.rotation = this.node.parent.rotation;
        //         this.node.parent.parent.parent.addChild(node);
        //          }
        //     , 4, macro.REPEAT_FOREVER, 0);
            // this.schedule(() => {
            // let node=instantiate(this.fixedSkillPrefab4) 
            // node.position = this.node.parent.position;
            // this.node.parent.parent.addChild(node);
            //  }
            // , 8, macro.REPEAT_FOREVER, 0);
            //  this.schedule(() => {
            // let node=instantiate(this.fixedSkillPrefab5) 
            // node.position = this.node.parent.position;
            // this.node.parent.parent.addChild(node);
            //  }
            // , 4, macro.REPEAT_FOREVER, 0);
        //  this.schedule(() => {
        //     let node=instantiate(this.strightSkillPrefab2) 
        //     node.position = this.node.parent.position;
        //     node.rotation = this.node.parent.rotation;
        //     this.node.parent.parent.addChild(node);
        //      }
        //     , 4, macro.REPEAT_FOREVER, 0);
        //   this.schedule(() => {
        //     let node=instantiate(this.fixedSkillPrefab6) 
        //     node.position = this.node.parent.position;
        //     node.rotation = this.node.parent.rotation;
        //     this.node.parent.parent.addChild(node);
        //      }
        //     , 5, macro.REPEAT_FOREVER, 0);
        //    this.schedule(() => {
        //     let node=instantiate(this.HealingSkillPrefab) 
        //     node.position = this.node.parent.position;
        //     this.node.parent.parent.addChild(node);
        //      }
        //     , 10, macro.REPEAT_FOREVER, 0);
        }
        getSkill(skillIconFileName:string){
            assetManager.resources.load(`skillPre/${skillIconFileName}`, Prefab, (err, prefab ) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.chostSkillPrefab=prefab;
               
            })
            this.scheduleOnce(() => {
            this.skillRealse();
            },1)
            this.chostSkillPrefab=null;
        }
        skillRealse(){
          if(this.chostSkillPrefab){
            console.log("选择天赋的姓名",this.chostSkillPrefab.name)
            switch(this.chostSkillPrefab.name){
                case "HolySpring_skillicon_30203":
                    this.schedule(() => {
                        let node=instantiate(this.strightSkillPrefab) 
                        node.position = this.node.parent.position;
                        node.rotation = this.node.parent.rotation;
                        this.node.parent.parent.addChild(node);
                         }
                        , 1, macro.REPEAT_FOREVER, 0);
                    break;
                case "HolySpring_skillicon_30217":
                    this.schedule(() => {
                        let node=instantiate(this.fixedSkillPrefab1)                     
                        node.position = this.node.parent.position;
                        this.node.parent.parent.addChild(node);
                        }
                        , 4, macro.REPEAT_FOREVER, 0);
                    break;
                case "HolySpring_skillicon_30021":
                    this.schedule(() => {
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
                         }
                        , 8, macro.REPEAT_FOREVER, 0);
                    break;
                case "HolySpring_skillicon_30102":
                    this.schedule(() => {
                        let node=instantiate(this.fixedSkillPrefab1) 
                        node.position = this.node.position;
                        this.node.parent.addChild(node);
                         }
                        , 6, macro.REPEAT_FOREVER, 0);
                    break;
                case "HolySpring_skillicon_30130":
                    this.schedule(() => {
                        let node=instantiate(this.fixedSkillPrefab2) 
                            node.position = this.node.parent.position;
                            this.node.parent.parent.addChild(node);
                             }
                    , 6, macro.REPEAT_FOREVER, 0);
                    break;
                case "HolySpring_skillicon_50106":
                    this.schedule(() => {
                        let node=instantiate(this.fixedSkillPrefab3) 
                        node.position = this.node.parent.position;
                        this.node.parent.parent.addChild(node);
                         }
                        , 4, macro.REPEAT_FOREVER, 0);
                    break;
                case "HolySpring_skillicon_30204":
                    this.schedule(() => {
                        let node=instantiate(this.pointSkillPrefab) 
                        node.position = this.node.parent.parent.position;
                        this.node.parent.parent.parent.addChild(node);
                         }
                    , 4, macro.REPEAT_FOREVER, 0);
                    break;
                    case "HolySpring_skillicon_30135":
                    this.schedule(() => {
                        let node=instantiate(this.fixedSkillPrefab4) 
                        node.position = this.node.parent.position;
                        this.node.parent.parent.addChild(node);
                        }
                        , 8, macro.REPEAT_FOREVER, 0);
                        break;
                    case "HolySpring_skillicon_30224":
                    this.schedule(() => {
                        let node=instantiate(this.fixedSkillPrefab5) 
                        node.position = this.node.parent.position;
                        this.node.parent.parent.addChild(node);
                        }
                        , 4, macro.REPEAT_FOREVER, 0);
                        break;  
                    case "HolySpring_skillicon_30229":
                    this.schedule(() => {
                        let node=instantiate(this.strightSkillPrefab2) 
                        node.position = this.node.parent.position;
                        node.rotation = this.node.parent.rotation;
                        this.node.parent.parent.addChild(node);
                        }
                        , 4, macro.REPEAT_FOREVER, 0);
                        break;  
                    case "HolySpring_skillicon_30236":
                    this.schedule(() => {
                        let node=instantiate(this.fixedSkillPrefab6) 
                        node.position = this.node.parent.position;
                        node.rotation = this.node.parent.rotation;
                        this.node.parent.parent.addChild(node);
                        }
                        , 5, macro.REPEAT_FOREVER, 0);
                            break;  
                    case "HolySpring_skillicon_30310":
            this.schedule(() => {
                    let node=instantiate(this.HealingSkillPrefab) 
                    node.position = this.node.parent.position;
                    this.node.parent.parent.addChild(node);
                    }
                    , 10, macro.REPEAT_FOREVER, 0);
                            break;  
                default:
                    console.log("改技能未实现");
                    break;
            }
        }
    }
    }
