import { BloomStage, Node, Prefab, Quat, Scheduler, Vec3, dragonBones, game, instantiate, math, utils, v2, v3 } from "cc";
import { Actor } from "../Actor";
import { StateDefine } from "../StateDefine";
import { SimpleEmitter } from "../projectile/SimpleEmitter";
import { bt } from "../../bt/beheviourTree";
import { BlackboardKey } from "./BlackBoradKey";
import { BossContorl } from "../BossControl";



export class MoveToDest extends bt.Action {
    execute(dt: number, result: bt.ExecuteResult) {
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        let moveDest = result.blackboard.get(BlackboardKey.MoveDest) as Vec3;
        if (!actor ) {
            bt.markFail(result);
            return;
        }
        let dur = result.blackboard.get(BlackboardKey.MoveDestDuration) - dt;
        result.blackboard.set(BlackboardKey.MoveDestDuration, dur);
        let dir = v3();
        Vec3.subtract(dir, moveDest, actor.node.worldPosition);
        dir.normalize();
        if(dur < 0){
                 bt.markSuccess(result);
            // bt.markSuccess(result);
          //  result.blackboard.delete(BlackboardKey.MoveDest);
            return;
        }
        actor.input.set(dir.x, dir.y)
        bt.markRunning(result);
       
       actor.stateMgr.transit(StateDefine.Walk);
    }
    
}


/**
 * 
 */
export class SetMoveDest extends bt.Action {
    execute(dt: number, result: bt.ExecuteResult) {
        bt.markSuccess(result);
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        let ec = actor.node.getComponent(BossContorl);
        ec.moveNextMoveDest();
        // console.log('moveAI');
    }
}
/**
 * 判断是否进入攻击范围
 */
export class AttackRange extends bt.Condition {
    isSatisfy(result: bt.ExecuteResult): boolean {
        let distance=result.blackboard.get(BlackboardKey.Distance) as number;
        
        if(distance<5){
            return true;
        }else{
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
        let playerActor = result.blackboard.get(BlackboardKey.playerActor) as Actor;
        let distance=result.blackboard.get(BlackboardKey.Distance) as number;
        if (distance < 5) {
            actor.stateMgr.transit(StateDefine.Attack);
            actor.input.set(0, 0)
            bt.markRunning(result); // 标记为 RUNNING 状态
        } else if(distance>5){
            console.log('距离过远');
            bt.markSuccess(result); // 敌人离开攻击范围，标记为 SUCCESS
        }

    }
}
/**
 * 检查技能是否处于冷却状态
 */
export class IsSkillCooldown extends bt.Condition {
    actor: Actor = null;
  
    isSatisfy(result: bt.ExecuteResult): boolean {
        console.log(this.actor.isCoolingdown);
        return this.actor.isCoolingdown;
    }
}
/**
 * 使用技能
 */
export class Useskill extends bt.Action {
     node:Node|null=null
     actor: Actor = null;
     cantanskill: boolean = true;
     result: bt.ExecuteState = null;
    //  aniBeginTime:number=0
    //  aniEndTime:number=0
     skillPre:Prefab=null
    execute(dt: number, result: bt.ExecuteResult) {
        if(this.cantanskill==true){
        this.actor.dragonBoneAnimation.playAnimation('skill_1',1)
        // this.aniBeginTime=game.totalTime
        this.cantanskill=false
        }
        result.executeState = bt.ExecuteState.Running;
        this.actor.dragonBoneAnimation.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationComplete, this);
        setTimeout(() => {
            if(this.result==bt.ExecuteState.Success){
                this.actor.stateMgr.transit(StateDefine.Idle);
                let node=instantiate(this.skillPre)
                let dir = result.blackboard.get(BlackboardKey.Dir) as Vec3;
                let angle = Math.atan2(dir.y, dir.x);
                 // 将角度转换为四元数
                let quat = new Quat();
                Quat.fromEuler(quat, 0, 0, angle * (180 / Math.PI)); // 将弧度转换为度数
                node.position = this.node.position
                node.rotation = quat;
                this.node.parent.addChild(node);
                result.executeState = bt.ExecuteState.Success;
            }
        },500);
        
    }
    onAnimationComplete(){
        // console.log('skill_1 动画播放完成');
        this.actor.castTime=game.totalTime
        this.cantanskill=true
        // this.aniEndTime=game.totalTime
        // console.log('skill_1 动画播放完成时间',this.aniEndTime-this.aniBeginTime)
        this.result=bt.ExecuteState.Success;
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
        bt.markSuccess(result);
        
        this.emitter.emit();
    }
}

/**
 * 角色进入空闲状态
 */
export class StayIdle extends bt.Action {
    execute(dt: number, result: bt.ExecuteResult) {
        bt.markSuccess(result);
        let actor: Actor = result.blackboard.get(BlackboardKey.Actor);
        actor.stateMgr.transit(StateDefine.Idle);
        // console.log("Idle: 空闲");
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
        // 当前在 dash 则不重进此状态
        if (actor.stateMgr.currState.id == StateDefine.Dash) {
            bt.markSuccess(result);
            result.blackboard.set(BlackboardKey.Escaped, true);
            return;
        }

        // 随机找一个方向，然后使用 dash 状态来逃跑
        let dir= v3();
        let target: Actor = result.blackboard.get(BlackboardKey.playerActor);
        if (target) {
            Vec3.subtract(dir, target.node.worldPosition, actor.node.worldPosition);
        }
        const v2HitNormal = v2(0,0);
        playerActor.onHurt(actor.current_ActorProperty.attack*2,actor,v2HitNormal);
        dir.normalize();
        actor.input.set(dir.x, dir.y);
        actor.stateMgr.transit(StateDefine.Dash);
        bt.markRunning(result);
    }
}

export class IsLowHp extends bt.Condition {
    isSatisfy(result: bt.ExecuteResult): boolean {
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        console.log(actor?.current_ActorProperty.hp / actor?.current_ActorProperty.maxHp);
        return actor?.current_ActorProperty.hp / actor?.current_ActorProperty.maxHp <= 0.9;
    }
}



