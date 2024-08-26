import { _decorator, Component, director, find, math, Node, v3, Vec3 } from 'cc';
import { Actor } from './Actor';
import { bt } from '../bt/beheviourTree';
import { Idle } from './state/Idle';
import { StateDefine } from './StateDefine';
import { Die } from './state/Die';
import { Walk } from './state/Walk';
import { BlackboardKey } from './ai/BlackBoradKey';
import { Emit, IsCooldown, IsLowHp, MoveToDest, SetMoveDest, StayIdle, WeaponAttack } from './ai/Behavior';
import { SimpleEmitter } from './projectile/SimpleEmitter';
import { Weapon } from './weapon/Weapon';
const { ccclass, property } = _decorator;

@ccclass('EnemyControl')
export class EnemyControl extends Component {
    actor:Actor = null;
    playerActor:Actor = null;
    ai :bt.BehaviourTree = null;
    moveDest:Vec3=null
    start() {
        this.actor = this.node.getComponent(Actor);
        this.playerActor=this.node.parent.getChildByName('Player').getComponent(Actor);
        this.createAI();
        this.initBlackboard();
        this.actor.stateMgr.registState(new Idle(StateDefine.Idle, this.actor));
        this.actor.stateMgr.registState(new Walk(StateDefine.Walk, this.actor));
        this.actor.stateMgr.registState(new Die(StateDefine.Die, this.actor));
        this.actor.stateMgr.registState(new Die(StateDefine.Attack, this.actor));
        this.actor.stateMgr.startWith(StateDefine.Idle);
    }

    update(deltaTime: number) {
        if (1) {
        this.ai.update(deltaTime);
        this.moveDest=this.playerActor.node?.worldPosition.clone();
        //  this.ai.setData(BlackboardKey.MoveDest, this.moveDest);
    //     this.ai.setData(BlackboardKey.MoveDestDuration, 3.0);
        }

    }
    initBlackboard() {
        this.ai.setData(BlackboardKey.Escaped, false);
        this.ai.setData(BlackboardKey.Actor, this.actor);
        //this.ai.setData(BlackboardKey.AttackRange, this.attackRange);
        this.moveNextMoveDest();
    }
    moveNextMoveDest() {
        this.ai.setData(BlackboardKey.MoveDest, this.moveDest);
        this.ai.setData(BlackboardKey.MoveDestDuration, 0.5);
        let data=this.ai.getData(BlackboardKey.MoveDestDuration);
        console.log('MoveDestDuration1',data);
    }
    createAI() {
        if(this.ai==null){
        this.ai = new bt.BehaviourTree();
        }
        // root 
        let rootNode = new bt.Fallback();
        this.ai.root = rootNode;
            
        // if (0) {
        //     // escape 
        //     let escapeSeq = new bt.Sequence();
        //     rootNode.addChild(escapeSeq);

        //     // has the escaped key?
        //     let invertHasEscapedKey = new bt.InvertResultDecorator();

        //     let hasEscapeKey = new bt.IsTrue();
        //     hasEscapeKey.key = BlackboardKey.Escaped;
        //     invertHasEscapedKey.child = hasEscapeKey;
        //     escapeSeq.addChild(invertHasEscapedKey);

        //     let lowHp = new IsLowHp();
        //     escapeSeq.addChild(lowHp);

        //     //TODO: add escape action
        //     // let escape = new EscapeDash();
        //     // escapeSeq.addChild(escape);
        // }
        // Partrol .... move to dest position
        if (1) {
            let moveDestSeq = new bt.Sequence();
            rootNode.addChild(moveDestSeq);

            let hasMoveDest = new bt.IsTrue();
            hasMoveDest.key = BlackboardKey.MoveDest;
            moveDestSeq.addChild(hasMoveDest);

            let moveDest = new MoveToDest();
            moveDestSeq.addChild(moveDest)
            rootNode.addChild(moveDestSeq);
            // let wait = new bt.Wait();
            // wait.elapsed = 0.1;
            // moveDestSeq.addChild(wait);
         //  moveDestSeq.addChild(new SetMoveDest());
        }

        if (this.node.getComponentInChildren(SimpleEmitter)) {
            console.log('has emitter');
            let emitSeq = new bt.Sequence();
            rootNode.addChild(emitSeq);
            let simpleEmitter = this.node.getComponentInChildren(SimpleEmitter);
            let cooldown = new IsCooldown();
            cooldown.emitter = simpleEmitter;
            emitSeq.addChild(cooldown);

            let emit = new Emit();
            emit.emitter = simpleEmitter;
            emitSeq.addChild(emit);
            rootNode.addChild(emitSeq);
        }
        // if (this.node.getComponentInChildren(SimpleEmitter)==null) {
        //     console.log('no emitter');
        //     let weaponSeq = new bt.Sequence();
        //     rootNode.addChild(weaponSeq);
        //     let weapon = this.node.getComponentInChildren(Weapon);

        //     let weaponAttack=new WeaponAttack();
        //     weaponAttack.weapon=weapon;
        //     weaponSeq.addChild(weaponAttack);
        // }
       if (1) {
        let idleSeq = new bt.Sequence();
        rootNode.addChild(idleSeq);
        idleSeq.addChild(new StayIdle());
        // let wait = new bt.Wait();
        // wait.elapsed = 0.1;
        // idleSeq.addChild(wait);
        idleSeq.addChild(new SetMoveDest())
        console.log('moveAI');
       }   
       if (1) {
        let attackSeq = new bt.Sequence();
        rootNode.addChild(attackSeq);
        attackSeq.addChild(new WeaponAttack())
        console.log('WeaponAttack');
       }   
    }
// moveAI(){
//      if(this.ai==null){
//             this.ai = new bt.BehaviourTree();
//         }
//         let rootNode = new bt.Fallback();
//         this.ai.root = rootNode;
//         if (1) {
//             let moveDestSeq = new bt.Sequence();
//             rootNode.addChild(moveDestSeq);

//             let hasMoveDest = new bt.IsTrue();
//             hasMoveDest.key = BlackboardKey.MoveDest;
//             moveDestSeq.addChild(hasMoveDest);

//             let moveDest = new MoveToDest();
//             moveDestSeq.addChild(moveDest)
//         }
//         if (1) {
//             let idleSeq = new bt.Sequence();
//             rootNode.addChild(idleSeq);
    
//             idleSeq.addChild(new StayIdle());
//             // let wait = new bt.Wait();
//             // wait.elapsed = 0.1;
//             // idleSeq.addChild(wait);
//             idleSeq.addChild(new SetMoveDest());
      
//         }   
//     }
}


