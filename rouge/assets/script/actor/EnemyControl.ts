import { _decorator, Component, director, find, math, Node, v3, Vec3 } from 'cc';
import { Actor } from './Actor';
import { bt } from '../bt/beheviourTree';
import { Idle } from './state/Idle';
import { StateDefine } from './StateDefine';
import { Die } from './state/Die';
import { Walk } from './state/Walk';
import { BlackboardKey } from './ai/BlackBoradKey';
import { Emit, IsCooldown, IsLowHp, MoveToDest, SetMoveDest, StayIdle ,AttackRange,Attack_Action} from './ai/Behavior';
import { SimpleEmitter } from './projectile/SimpleEmitter';
import { Attack } from './state/Attack';
const { ccclass, property } = _decorator;

@ccclass('EnemyControl')
export class EnemyControl extends Component {
    actor:Actor = null;
    playerActor:Actor = null;
    ai :bt.BehaviourTree = null;
    moveDest:Vec3=null
    enemyTag:number=0;
    distance:number=0;   
    dir: Vec3 = new Vec3();
    @property(SimpleEmitter)
    projectileEmitter:SimpleEmitter | null = null;
    start() {
        this.actor = this.node.getComponent(Actor);
        this.playerActor=this.node.parent.getChildByName('Player').getComponent(Actor);
        if(this.node.getComponentInChildren(SimpleEmitter)){
            this.enemyTag=0  //远程敌人
        }else{
            this.enemyTag=1  //近战敌人
        }
        this.createAI();
        this.initBlackboard();
        this.actor.stateMgr.registState(new Idle(StateDefine.Idle, this.actor));
        this.actor.stateMgr.registState(new Walk(StateDefine.Walk, this.actor));
        this.actor.stateMgr.registState(new Die(StateDefine.Die, this.actor));
        this.actor.stateMgr.registState(new Attack(StateDefine.Attack, this.actor));
        this.actor.stateMgr.startWith(StateDefine.Idle);
        
    }

    update(deltaTime: number) {
        if (1) {
        this.ai.update(deltaTime);
        this.moveDest=this.playerActor.node?.worldPosition.clone();
        this.distance= Vec3.subtract(this.dir, this.moveDest, this.node.worldPosition).length();
        this.ai.setData(BlackboardKey.MoveDest, this.moveDest);
        this.ai.setData(BlackboardKey.Dir, this.dir);
        this.ai.setData(BlackboardKey.Distance, this.distance);
        
        }

    }
    initBlackboard() {
        this.ai.setData(BlackboardKey.Escaped, false);
        this.ai.setData(BlackboardKey.Actor, this.actor);
        this.ai.setData(BlackboardKey.playerActor, this.playerActor);
        //this.ai.setData(BlackboardKey.AttackRange, this.attackRange);
        this.moveNextMoveDest();
    }
    moveNextMoveDest() {
        //this.ai.setData(BlackboardKey.MoveDest, this.moveDest);
        this.ai.setData(BlackboardKey.MoveDestDuration, 0.1);
       
    }
    createAI() {
        if(this.ai==null){
        this.ai = new bt.BehaviourTree();
        }
        // root 
        let rootNode = new bt.Fallback();
        this.ai.root = rootNode;
        if (1) {
            let moveDestSeq = new bt.Sequence();
            let hasMoveDest = new bt.IsTrue();
            hasMoveDest.key = BlackboardKey.MoveDest;
            moveDestSeq.addChild(hasMoveDest);

            let moveDest = new MoveToDest();
            moveDestSeq.addChild(moveDest)
            rootNode.addChild(moveDestSeq);
        }
        if ( this.enemyTag==0) {
          //  console.log('has emitter');
            let emitSeq = new bt.Sequence();
            let simpleEmitter = this.node.getComponentInChildren(SimpleEmitter);
            let cooldown = new IsCooldown();
            cooldown.emitter = simpleEmitter;
            emitSeq.addChild(cooldown);

            let emit = new Emit();
            emit.emitter = simpleEmitter;
            emitSeq.addChild(new StayIdle());
            emitSeq.addChild(emit);
            rootNode.addChild(emitSeq);
        }
        if(this.enemyTag==1){
            let attackSeq = new bt.Sequence();
            let attackRange=new AttackRange();
            attackSeq.addChild(attackRange);

            let attackAction=new Attack_Action();
            let wait = new bt.Wait();
            wait.elapsed = 0;
            attackSeq.addChild(attackAction);
            attackSeq.addChild(new StayIdle());
            attackSeq.addChild(wait);
            rootNode.addChild(attackSeq);
        }
       
       if (this.enemyTag==0) {
        let idleSeq = new bt.Sequence();
        rootNode.addChild(idleSeq);
        let wait = new bt.Wait();
         wait.elapsed = 1;
        idleSeq.addChild(wait);
        idleSeq.addChild(new SetMoveDest())
       }   
       if (this.enemyTag==1) {
        let idleSeq = new bt.Sequence();
        rootNode.addChild(idleSeq);
        idleSeq.addChild(new SetMoveDest())
       }   
      
    }

}


