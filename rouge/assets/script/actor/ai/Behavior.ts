import { BloomStage, Scheduler, Vec3, math, utils, v2, v3 } from "cc";
import { Actor } from "../Actor";
import { StateDefine } from "../StateDefine";
import { SimpleEmitter } from "../projectile/SimpleEmitter";
import { bt } from "../../bt/beheviourTree";
import { BlackboardKey } from "./BlackBoradKey";
import { EnemyControl } from "../EnemyControl";
import { Weapon } from "../weapon/Weapon";



export class MoveToDest extends bt.Action {
    execute(dt: number, result: bt.ExecuteResult) {
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        let plplayerActor= result.blackboard.get(BlackboardKey.playerActor) as Actor;
        let moveDest = result.blackboard.get(BlackboardKey.MoveDest) as Vec3;
        if (!actor || !moveDest) {
            bt.markFail(result);
            console.error("MoveToDest: actor or moveDest is null");
            return;
        }

        let dur = result.blackboard.get(BlackboardKey.MoveDestDuration) - dt;
        result.blackboard.set(BlackboardKey.MoveDestDuration, dur);
       

        let dir = v3(); 
        Vec3.subtract(dir, moveDest, actor.node.worldPosition);
        let distance = dir.length();
        dir.normalize();
        let movedDistance = dir.length();

        if (movedDistance > distance ) {
            bt.markSuccess(result);
            result.blackboard.delete(BlackboardKey.MoveDest);
            actor.stateMgr.transit(StateDefine.Idle);
            actor.stateMgr.transit(StateDefine.Attack);
            const v2HitNormal = v2(0,0);
            plplayerActor.onHurt(10,actor,v2HitNormal);
            return;
        }
        if(dur < 0){
            bt.markSuccess(result);
            result.blackboard.delete(BlackboardKey.MoveDest);
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
    weapon: Weapon = null;
    execute(dt: number, result: bt.ExecuteResult) {
        bt.markSuccess(result);
        let actor = result.blackboard.get(BlackboardKey.Actor) as Actor;
        let ec = actor.node.getComponent(EnemyControl);
        ec.moveNextMoveDest();
        // console.log('moveAI');
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
