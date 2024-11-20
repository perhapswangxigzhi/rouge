import { BloomStage, ERaycast2DType, Node, PhysicsSystem2D, Prefab, Quat, Scheduler, UIOpacity, UITransform, Vec2, Vec3, dragonBones, game, instantiate, math, tween, utils, v2, v3, view } from "cc";
import { Actor } from "../Actor";
import { StateDefine } from "../StateDefine";
import { SimpleEmitter } from "../projectile/SimpleEmitter";
import { bt } from "../../bt/beheviourTree";
import { BlackboardKey } from "./BlackBoradKey";
import { CureTextManager } from "../../TextManager/CureTextManager";
import { StrightSkill } from "../../skill/StrightSkill";
import { graphics } from "../enemy/graphics";
import { BossContorl } from "../enemy/BossControl";

export class MoveToDest extends bt.Action {
    execute(dt: number, result: bt.ExecuteResult) {
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        let distance=result.blackboard.get(BlackboardKey.Distance) as number;
        if (!actor ) {
            bt.markFail(result);
            return;
        }
        if(distance<=3){
            actor.stateMgr.transit(StateDefine.Idle);
            bt.markSuccess(result);
        }
        
        let dir =  result.blackboard.get(BlackboardKey.Dir)as Vec3;
        dir.normalize();
        actor.input.set(dir.x, dir.y)
        bt.markSuccess(result);
        actor.stateMgr.transit(StateDefine.Walk);
    }
   
    
}

/**
 * 判断是否进入攻击范围
 */
export class AttackRange extends bt.Condition {
    canAttack:boolean=true
    distance:number=0
    isSatisfy(result: bt.ExecuteResult): boolean {
       this.distance=result.blackboard.get(BlackboardKey.Distance) as number;
        if(this.distance<50){
            return true;
        }else{
            return false;
        }
    }
}
/**
 * 自定义技能触发器
 */
export class IsCustomCooldown extends bt.Condition {
    canrealse:boolean=true
    cooldown:number=10
    canRealseDistance:number=100
    static castTime:number=0
    isSatisfy(result: bt.ExecuteResult): boolean {
        let distance=result.blackboard.get(BlackboardKey.Distance) as number;
        if(distance<this.canRealseDistance&&game.totalTime-IsCustomCooldown.castTime>=this.cooldown*1000){
            return true;
        }
        else{
            return false;
        }
       
    }
}
/**
 * 发起攻击
 */
export class Attack_Action extends bt.Action {
    execute(dt: number, result: bt.ExecuteResult) {
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        actor.stateMgr.transit(StateDefine.Idle);
        actor.stateMgr.transit(StateDefine.Attack);
        bt.markSuccess(result)
    }
}
/**
 * 发起技能普通攻击
 */
export class Attack_Skill extends bt.Action {
    execute(dt: number, result: bt.ExecuteResult) {
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        actor.stateMgr.transit(StateDefine.Idle);
        actor.stateMgr.transit(StateDefine.Skill_1);
        bt.markSuccess(result)
    }
}
/**
 * 检查某个发射器（emitter）是否处于冷却状态
 */
export class IsCooldown extends bt.Condition {
    emitter: SimpleEmitter = null;
    isSatisfy(result: bt.ExecuteResult): boolean {
        return this.emitter.isCoolingdown;
    }
}

/**
 * 发射投掷物
 */
export class Emit extends bt.Action {
    emitter: SimpleEmitter = null;
    execute(dt: number, result: bt.ExecuteResult) {
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        if(actor.current_ActorProperty.name=='Enemy1'){
        this.emitter.emit();}
        else{
        this.emitter.pointEmit();} 
        bt.markSuccess(result);   
    }
}

/**
 * 角色进入空闲状态
 */
export class StayIdle extends bt.Action {
    execute(dt: number, result: bt.ExecuteResult) {
        let actor: Actor = result.blackboard.get(BlackboardKey.Actor);
        actor.stateMgr.transit(StateDefine.Idle);
        bt.markSuccess(result);
    }
}
/**
 * 检查技能是否处于冷却状态
 */
export class IsSkillCooldown extends bt.Condition {
    actor: Actor = null;
    public setActor(actor: Actor): this {
        this.actor = actor;
        return this; 
    }
    isSatisfy(result: bt.ExecuteResult): boolean {
        return this.actor.isCoolingdown;
    }
}
/**
 * 使用远程直线技能(指向敌人)
 */
export class UseRangeskill extends bt.Action {
     node:Node|null=null
     actor: Actor = null;
     skillPre:Prefab=null
     public setActor(actor: Actor): this {
        this.actor = actor;
        return this; 
    }
    public setSkillPrefab(skillPre: Prefab): this {
        this.skillPre = skillPre;
        return this; 
    }
    public setNode(node: Node): this {
        this.node = node;
        return this; 
    }
    execute(dt: number, result: bt.ExecuteResult) {
        this.actor.dragonBoneAnimation.playAnimation('skill_1',1)
        let animationDuration = this.actor.dragonBoneAnimation.playAnimation('skill_1').totalTime; // 获取播放时间
        this.actor.castTime=game.totalTime;
        setTimeout(()=>{
            try {
                this.actor.stateMgr.transit(StateDefine.Idle);
                let node=instantiate(this.skillPre)
                let dir = result.blackboard.get(BlackboardKey.Dir) as Vec3;
                let angle = Math.atan2(dir.y, dir.x);   // 将角度转换为四元数
                let quat = new Quat();
                Quat.fromEuler(quat, 0, 0, angle * (180 / Math.PI)); // 将弧度转换为度数
                node.rotation = quat;
                this.node.addChild(node);
                node.worldPosition =new Vec3(this.node.worldPosition.x+30,this.node.worldPosition.y,this.node.worldPosition.z);
                bt.markSuccess(result);
            } catch (error) {
                console.log("施法者已经死亡");   
            }
        },animationDuration*1000);
        bt.markRunning(result);
    }
}
/**
 * 使用直接释放技能
 */
export class UseDirectSkill extends bt.Action {
    node:Node|null=null
    actor: Actor = null;
    skillPre:Prefab=null
    public setActor(actor: Actor): this {
        this.actor = actor;
        return this; 
    }
    public setSkillPrefab(skillPre: Prefab): this {
        this.skillPre = skillPre;
        return this; 
    }
    public setNode(node: Node): this {
        this.node = node;
        return this; 
    }
    execute(dt: number, result: bt.ExecuteResult) {
        this.actor.dragonBoneAnimation.playAnimation('skill_1',1)
        let animationDuration = this.actor.dragonBoneAnimation.playAnimation('skill_1').totalTime; // 获取播放时间
        let node=instantiate(this.skillPre)
        this.node.addChild(node);
        this.actor.castTime=game.totalTime;
        setTimeout(()=>{
            try {
                this.actor.stateMgr.transit(StateDefine.Idle);
                bt.markSuccess(result);
            } catch (error) {
             console.log("施法者已经死亡");   
            }
        },animationDuration*1000);
        bt.markRunning(result);
    }
}

/**
 * 使用治疗技能
 */
export class UseHealSkill extends bt.Action {
    actor: Actor = null;
    healText:Prefab=null
    cure:number=0
    execute(dt: number, result: bt.ExecuteResult) {
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        this.cure=Math.round(actor.current_ActorProperty.maxHp*0.05);
        this.actor.current_ActorProperty.hp+=this.cure;
        let node=instantiate(this.healText)
        this.actor.node.addChild(node);
        const hitPosition= new Vec3(node.position.x,node.position.y+100,node.position.z);
        node.getComponent(CureTextManager).showDamage( hitPosition, this.cure);
        bt.markSuccess(result);

    }
}
/**
 * 使用远程散射技能
 */
export class UseAreaSkill extends bt.Action {
    node:Node|null=null
    actor: Actor = null;
    skillPre:Prefab=null
    execute(dt: number, result: bt.ExecuteResult) {
        this.actor.dragonBoneAnimation.playAnimation('skill_1',1)
        let animationDuration = this.actor.dragonBoneAnimation.playAnimation('skill_1').totalTime; // 获取播放时间
        let node=instantiate(this.skillPre)
        let node1=instantiate(this.skillPre)
        let node2=instantiate(this.skillPre)
        let dir = result.blackboard.get(BlackboardKey.Dir) as Vec3;
        let angle = (Math.atan2(dir.y, dir.x))/Math.PI*180;   // 将角度转换为四元数
        node.angle = angle;
        node1.angle = angle+30;
        node2.angle = angle-30;
        this.node.addChild(node);
        this.node.addChild(node1);
        this.node.addChild(node2);
        node.worldPosition = this.node.worldPosition
        node1.worldPosition = this.node.worldPosition
        node2.worldPosition = this.node.worldPosition
        this.actor.castTime=game.totalTime;
        setTimeout(()=>{
            try {
                this.actor.stateMgr.transit(StateDefine.Idle);
                bt.markSuccess(result);
            } catch (error) {
             console.log("施法者已经死亡");   
            }
        },animationDuration*1000);
        bt.markRunning(result);
    }
}
/**
 * 使用远程四面八方技能
 */
export class UseAllRangeSkill extends bt.Action {
    node:Node|null=null
    actor: Actor = null;
    skillPre:Prefab=null
    execute(dt: number, result: bt.ExecuteResult) {
        this.actor.dragonBoneAnimation.playAnimation('skill_1',1)
        let animationDuration = this.actor.dragonBoneAnimation.playAnimation('skill_1').totalTime; // 获取播放时间
        for(let i=0;i<12;i++){
            let node=instantiate(this.skillPre)
            node.angle = i*30;
            this.node.addChild(node);
            setTimeout(()=>{
                node.getComponent(StrightSkill).skillBack();
            },node.getComponent(StrightSkill).skillContinueTime*1000/2)
        }
        this.actor.castTime=game.totalTime;
        setTimeout(()=>{
            try {
                this.actor.stateMgr.transit(StateDefine.Idle);
                bt.markSuccess(result);
            } catch (error) {
             console.log("施法者已经死亡");   
            }
        },animationDuration*1000);
        bt.markRunning(result);
    }
}

/**
 * 使用远程天女散花技能
 */
export class UseDragonSkill extends bt.Action {
    node:Node|null=null
    actor: Actor = null;
    skillPre:Prefab=null
    execute(dt: number, result: bt.ExecuteResult) {
        this.actor.dragonBoneAnimation.playAnimation('skill_1',1)
        let animationDuration = this.actor.dragonBoneAnimation.playAnimation('skill_1').totalTime; // 获取播放时间
        for(let i=0;i<50;i++){
            setTimeout(()=>{
                let node=instantiate(this.skillPre)
                node.getComponent(graphics).startPoint=new Vec2(0,0);
                node.getComponent(graphics).endPoint=new Vec2(50,0);
                node.angle = Math.random()*360;
                this.node.addChild(node);
            },i*100)
        }
        this.actor.castTime=game.totalTime;
        setTimeout(()=>{
            try {
                this.actor.stateMgr.transit(StateDefine.Idle);
                bt.markSuccess(result);
            } catch (error) {
             console.log("施法者已经死亡");   
            }
        },animationDuration*1000);
        bt.markRunning(result);
    }
}
/**
 * 使用近战技能攻击
 */
export class UseMeleeSkill extends bt.Action {
    node:Node|null=null
    actor: Actor = null;
    skillPre:Prefab=null
    execute(dt: number, result: bt.ExecuteResult) {
        IsCustomCooldown.castTime=game.totalTime;
        let dir = result.blackboard.get(BlackboardKey.Dir) as Vec3;
        let angle = (Math.atan2(dir.y, dir.x))/Math.PI*180;   // 将角度转换为四元数
        let node=instantiate(this.skillPre)
        node.angle = angle
        this.node.addChild(node);
        node.worldPosition = this.node.worldPosition
        bt.markSuccess(result)
    }
}
/**
 * 使用滚动技能
 */
export class UseRockskill extends bt.Action {
    node:Node|null=null
    actor: Actor = null;
    velocity = new Vec2();
    isRunning = false;
   execute(dt: number, result: bt.ExecuteResult) {
        this.actor.stateMgr.transit(StateDefine.Skill_1);
       let dir = result.blackboard.get(BlackboardKey.Dir) as Vec3;
       let distance = result.blackboard.get(BlackboardKey.Distance) as number;
       dir.normalize();
       this.velocity.set(dir.x, dir.y);
       this.velocity.multiplyScalar(5);
       if(distance<20){
        this.actor.rigidbody.linearVelocity=v2();
       }else{
        this.actor.rigidbody.linearVelocity =this.velocity;
       }
       if(this.isRunning==false){
        this.isRunning=true;
        setTimeout(()=>{
            try {
               this.actor.castTime=game.totalTime;
               this.isRunning=false;
               bt.markSuccess(result);
            } catch (error) {
             console.log("施法者已经死亡");   
            }
        },4*1000);
       }
       bt.markRunning(result);
   }
}
/**
 * 使用冲锋技能
 */
export class UseChargeSkill extends  bt.Action {
    node:Node|null=null
    actor: Actor = null;
    playerActor: Actor = null;
    velocity = new Vec2();
    isRunning = false;
    isCharge = false;
    distance = 0;
    actorPosition = new Vec3();
    point:Node|null=null
    screenWidth = view.getVisibleSize().width
    screenHeight = view.getVisibleSize().height
   execute(dt: number, result: bt.ExecuteResult) {
        this.actor.stateMgr.transit(StateDefine.Skill_2);
        let dir = result.blackboard.get(BlackboardKey.Dir) as Vec3;
        result.blackboard.set(BlackboardKey.CanAttack, false);
        this.distance = result.blackboard.get(BlackboardKey.Distance) as number;
        this.actorPosition = this.actor.node.position.clone();
        this.playerActor = result.blackboard.get(BlackboardKey.playerActor) as Actor;
         // 先超玩家方向冲刺
         if(this.isCharge==false){
            let radian = Math.atan2(dir.y, dir.x);  
            var angle=radian/Math.PI*180; 
            if(this.point==null){
                this.point=this.node.children[0]
            }
            this.point.active = true;
            this.point.setParent(this.node.parent)
            this.point.position = this.actorPosition;
            this.point.angle = angle+90;
            this.velocity.set(dir.x, dir.y);
            this.velocity.multiplyScalar(20);
            this.isCharge=true;
         }
         // 超玩家300米后，再超敌人方向冲刺
        if(this.distance>300){
            let radian = Math.atan2(dir.y, dir.x);  
            var angle=radian/Math.PI*180;
            this.point.active = true;
            this.point.position = this.actorPosition;    
            this.point.angle = angle+90;
            this.velocity.set(dir.x, dir.y);
            this.velocity.multiplyScalar(20);
        }
        
         this.actor.rigidbody.linearVelocity =this.velocity;

       if(this.isRunning==false){
        this.isRunning=true;
        setTimeout(()=>{
            try {
                this.actor.castTime=game.totalTime;
               this.isRunning=false;
               result.blackboard.set(BlackboardKey.CanAttack, true);
               this.point.active = false;
               this.actor.stateMgr.transit(StateDefine.Idle);
               bt.markSuccess(result);
            } catch (error) {
             console.log("施法者已经死亡");   
            }
        },4*1000);
       }
       bt.markRunning(result);
   }
}
/**
 * 使用生命汲取技能
 */
export class UseLifesuckSkill extends bt.Action {
    node:Node|null=null
    actor: Actor = null;
    skillPre:Prefab=null
    playerActor: Actor = null;
    healText:Prefab=null
    cure:number=0
    public setActor(actor: Actor): this {
        this.actor = actor;
        return this; 
    }
   public setPlayerActor(playerActor: Actor): this {
        this.playerActor = playerActor;
        return this; 
    }
   public setSkillPrefab(skillPre: Prefab): this {
        this.skillPre = skillPre;
        return this; 
    }
   public setHealText(healText: Prefab): this {
        this.healText = healText;
        return this; 
    }
   public setNode(node: Node): this {
        this.node = node;
        return this; 
    }
   execute(dt: number, result: bt.ExecuteResult) {
       this.actor.dragonBoneAnimation.playAnimation('skill_1',1)
        let animationDuration = this.actor.dragonBoneAnimation.playAnimation('skill_1').totalTime; // 获取播放时间
        IsCustomCooldown.castTime=game.totalTime;
       setTimeout(()=>{
           try {
                this.actor.stateMgr.transit(StateDefine.Idle);
                let node=instantiate(this.skillPre)
                let healNode=instantiate(this.healText)
                let dir = result.blackboard.get(BlackboardKey.Dir) as Vec3;
                let angle = (Math.atan2(dir.y, dir.x))/Math.PI*180;   
                node.angle = angle+180;
                this.node.addChild(node);
                this.node.addChild(healNode);
                node.worldPosition =new Vec3(this.playerActor.node.worldPosition.x,this.playerActor.node.worldPosition.y-20,this.playerActor.node.worldPosition.z);
                tween(node.getComponent(UIOpacity))
                .to(1, { opacity: 0 })  // 1秒内将透明度变为0
                .start();
                this.cure=Math.round(this.actor.current_ActorProperty.attack);
                if(this.actor.current_ActorProperty.hp+this.cure>this.actor.current_ActorProperty.maxHp){
                   this.cure=this.actor.current_ActorProperty.maxHp-this.actor.current_ActorProperty.hp;
                }
                const hitPosition= new Vec3(healNode.position.x,healNode.position.y+210,healNode.position.z);
                healNode.getComponent(CureTextManager).showDamage( hitPosition, this.cure);
                bt.markSuccess(result);
           } catch (error) {
                console.log("施法者已经死亡");   
           }
       },animationDuration*1000);
       bt.markRunning(result);
   }
}

/**
 * @en 
 * Use dash to escape
 * @zh
 * 使用突进来攻击玩家
 */
export class EscapeDash extends bt.Action {
    execute(dt: number, result: bt.ExecuteResult) {
        let actor: Actor = result.blackboard.get(BlackboardKey.Actor);
        let playerActor: Actor = result.blackboard.get(BlackboardKey.playerActor);
        // 使用 dash 状态来突近玩家
        let dir =  result.blackboard.get(BlackboardKey.Dir)as Vec3;
        const length= result.blackboard.get(BlackboardKey.Distance)
        dir.normalize();
        const actorInitPos =actor.node.worldPosition.clone();  // 角色初始位置
        const dirInit=dir.clone();// 记录角色初始方向

        let radian = Math.atan2(dir.y, dir.x);   
        var angle=radian/Math.PI*180;    //算出的角度为正为绕着x轴顺时针旋转，负为逆时针旋转
        actor.node.children[0].active = true;
        actor.node.children[0].angle = angle+90;    //初始朝向超下，所以要加90度，默认为朝右
       // actor.node.children[0].getComponent(UITransform).height = length;
        setTimeout(()=>{
            try {
                actor.input.set(dirInit.x, dirInit.y)  // 角色以初始方向突进
                actor.stateMgr.transit(StateDefine.Dash);
                //检测在突进过程中是否击中玩家
                setTimeout(()=>{
                    let hitResult = PhysicsSystem2D.instance.raycast(actorInitPos, actor.node.worldPosition, ERaycast2DType.All);
                    for (let i = 0; i < hitResult.length; i++) {
                       if(hitResult[i].collider.tag==101){  //如果击中了玩家，则造成伤害
                        let hitNormal = v2();
                        playerActor.onHurt(actor.current_ActorProperty.attack*2,actor,hitNormal);
                       }
                    }
                },500)
                actor.node.children[0].active = false;
                bt.markSuccess(result);
            } catch (error) {
                console.log(error);
            }
        },2000)
        result.blackboard.set(BlackboardKey.EscapeOnce, false);
        bt.markRunning(result);
    }
}
export class canAttack extends bt.Condition {
    isSatisfy(result: bt.ExecuteResult): boolean {
       let canAttack=result.blackboard.get(BlackboardKey.CanAttack) as boolean;
       return canAttack;
    }
}
export class IsLowHp extends bt.Condition {
    isSatisfy(result: bt.ExecuteResult): boolean {
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        return actor?.current_ActorProperty.hp / actor?.current_ActorProperty.maxHp <= 0.8;
    }

}
