import { BloomStage, Scheduler, Vec3, math, utils, v2, v3 } from "cc";
import { Actor } from "../Actor";
import { StateDefine } from "../StateDefine";
import { SimpleEmitter } from "../projectile/SimpleEmitter";
import { bt } from "../../bt/beheviourTree";
import { BlackboardKey } from "./BlackBoradKey";
import { EnemyControl } from "../EnemyControl";



export class MoveToDest extends bt.Action {
    execute(dt: number, result: bt.ExecuteResult) {
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        if (!actor ) {
            bt.markFail(result);
            return;
        }

        let dur = result.blackboard.get(BlackboardKey.MoveDestDuration) - dt;
        result.blackboard.set(BlackboardKey.MoveDestDuration, dur);
        
        let dir =  result.blackboard.get(BlackboardKey.Dir)as Vec3;
        dir.normalize();
        if(dur < 0){
            bt.markFail(result);
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
        let ec = actor.node.getComponent(EnemyControl);
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
        let distance=result.blackboard.get(BlackboardKey.Distance) as number;
        if (distance < 5) {
            actor.stateMgr.transit(StateDefine.Attack);
            bt.markRunning(result); // 标记为 RUNNING 状态
            
        } else if(distance>5){
           result.blackboard.set(BlackboardKey.MoveDestDuration, 0.2);
            bt.markSuccess(result); // 敌人离开攻击范围，标记为 SUCCESS
        }

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
 * 检查血量是否少于一半
 */
export class IsLowHp extends bt.Condition {
    isSatisfy(result: bt.ExecuteResult): boolean {
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        return actor?.hp / actor?.maxHp <= 0.5;
    }
}
