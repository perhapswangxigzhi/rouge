import { _decorator, Animation, CCFloat, Component, find, instantiate, Node, RigidBody2D, tween, v2, v3, Vec2, Vec3 } from "cc";
import { Skill } from "./Skill";
const { ccclass, property } = _decorator;
enum SkillType {
    NONE=0,
    IndividualSkill=1,    //单体技能
    RangeSkill=2,  // 范围技能
    
}
@ccclass('IndividualSkill')
export class IndividualSkill extends Component {
    attack:number;
    skillAnimation:Animation
    //skillType:SkillType
    skill:Skill|null=null;
     @property(CCFloat)
     startLinearSpeed: number = 0;
     canvasNode:Node=null;
    start(){
        
        this.skillAnimation = this.node.getComponent(Animation);
        this.skillAnimation.play();
        this.canvasNode=find('LevelCanvas')
        // this.skill=new Skill();
        // this.schedule(()=>{
        //     this.skillRealse();
        // },2,0,2)
        
       

    }
    skillRealse(){
        let node=instantiate(this.node) 
        this.node.parent.parent.addChild(node);
        node.worldPosition=this.node.parent.worldPosition;
        node.rotation=this.node.parent.rotation
        console.log("node.parent.name",this.node.parent.name)
        const wr=this.node.parent.worldRotation;
        //旋转x轴
        let left = Vec3.UNIT_X;
        let velocityV3 = v3();
        Vec3.transformQuat(velocityV3, left, wr);

        let rigid = node.getComponent(RigidBody2D);
        let velocity: Vec2 = v2();
        velocity.x = velocityV3.x;
        velocity.y = velocityV3.y;
        velocity.multiplyScalar(this.startLinearSpeed);

        rigid.linearVelocity = velocity;
        // this.scheduleOnce(()=>{
        //     this.node.destroy();
        // },2)
    }
}