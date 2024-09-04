import { _decorator, Animation, CCFloat, Component, find, instantiate, macro, Node, Prefab, RigidBody2D, tween, v2, v3, Vec2, Vec3 } from "cc";
import { Skill } from "./Skill";
import { StrightSkill } from "./StrightSkill";
import { Actor } from "../actor/Actor";
const { ccclass, property } = _decorator;
enum SkillType {
    NONE=0,
    StrightSkill=1,    //直线技能
    FixedSkill=2,  // 定点释放技能
    
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
     fixedSkillPrefab:Prefab=null;
     actor:Actor|null=null;
    start(){
        
       // this.canvasNode=find('LevelCanvas')
        const playerNode=find('LevelCanvas/Player')
        this.actor=playerNode.getComponent(Actor)
         // 重复释放各种技能
        this.schedule(() => {
        let node=instantiate(this.strightSkillPrefab) 
        node.position = this.node.parent.position;
        node.rotation = this.node.parent.rotation;
        this.node.parent.parent.addChild(node);
         }
        , 1, macro.REPEAT_FOREVER, 0);
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
    }
   
}