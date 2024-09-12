import { _decorator, Component, director, find, math, Node, Prefab, v3, Vec3 } from 'cc';
import { Actor } from './Actor';
import { bt } from '../bt/beheviourTree';
import { Idle } from './state/Idle';
import { StateDefine } from './StateDefine';
import { Die } from './state/Die';
import { Walk } from './state/Walk';
import { BlackboardKey } from './ai/BlackBoradKey';
import { Emit, IsCooldown, MoveToDest, SetMoveDest, StayIdle ,AttackRange,Attack_Action, IsLowHp, EscapeDash, IsSkillCooldown, Useskill} from './ai/Behavior_boss';
import { SimpleEmitter } from './projectile/SimpleEmitter';
import { Attack } from './state/Attack';
import { Dash } from './state/Dash';
const { ccclass, property } = _decorator;

@ccclass('BossContorl')
export class BossContorl extends Component {
    actor:Actor = null;
    playerActor:Actor = null;
    ai :bt.BehaviourTree = null;
    moveDest:Vec3=null
    enemyTag:number=0;
    distance:number=0;   
    dir: Vec3 = new Vec3();
    @property(SimpleEmitter)
    projectileEmitter:SimpleEmitter | null = null;
    @property(Prefab)
    skillPrefab:Prefab|null=null;
    // frozenTag:boolean=false;//冻结敌人
    // frozenTime:number=0;//冻结时间
    // MaxfrozenTime:number=3;  //冻结时间上限
    start() {
        this.actor = this.node.getComponent(Actor);
        this.playerActor=this.node.parent.getChildByName('Player').getComponent(Actor);
        this.initBlackboard();
        this.createAI();
        this.actor.stateMgr.registState(new Idle(StateDefine.Idle, this.actor));
        this.actor.stateMgr.registState(new Walk(StateDefine.Walk, this.actor));
        this.actor.stateMgr.registState(new Die(StateDefine.Die, this.actor));
        this.actor.stateMgr.registState(new Attack(StateDefine.Attack, this.actor));
        this.actor.stateMgr.registState(new Dash(StateDefine.Dash, this.actor));
        this.actor.stateMgr.startWith(StateDefine.Idle);
        
    }

    update(deltaTime: number) {
    
        this.ai.update(deltaTime);
        this.moveDest=this.playerActor.node?.worldPosition.clone();
        this.distance= Vec3.subtract(this.dir, this.moveDest, this.node.worldPosition).length();
       // this.ai.setData(BlackboardKey.MoveDest, this.moveDest);
        this.ai.setData(BlackboardKey.Dir, this.dir);
        this.ai.setData(BlackboardKey.Distance, this.distance);
        
       

    }
    initBlackboard() {
        if(this.ai==null){
            this.ai = new bt.BehaviourTree();
            }
        this.ai.setData(BlackboardKey.Escaped, false);
        this.ai.setData(BlackboardKey.Actor, this.actor);
        this.ai.setData(BlackboardKey.playerActor, this.playerActor);
        this.moveNextMoveDest();
    }
    moveNextMoveDest() {
        this.ai.setData(BlackboardKey.MoveDest, this.playerActor.node?.worldPosition.clone());
        this.ai.setData(BlackboardKey.MoveDestDuration, 0.3);
       
    }
    createAI() {
        // if(this.ai==null){
        // this.ai = new bt.BehaviourTree();
        // }
        // root 
        let rootNode = new bt.Sequence();
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
        if (1) {
            let idleSeq = new bt.Sequence();
            rootNode.addChild(idleSeq);
            idleSeq.addChild(new SetMoveDest())
           }  
              // 创建并行节点
         let parallelNode = new bt.Parallel();
         rootNode.addChild(parallelNode); 
           if (1) {
            // escape 
            let escapeSeq = new bt.Sequence();
            // rootNode.addChild(escapeSeq);
            parallelNode.addChild(escapeSeq);
            let invertHasEscapedKey = new bt.InvertResultDecorator();
            let hasEscapeKey = new bt.IsTrue();
            hasEscapeKey.key = BlackboardKey.Escaped;
            invertHasEscapedKey.child = hasEscapeKey;
            escapeSeq.addChild(invertHasEscapedKey);

            let lowHp = new IsLowHp();
            escapeSeq.addChild(lowHp);

            let escape = new EscapeDash();
            escapeSeq.addChild(escape);
        }
        
        if(1){
            let attackSeq = new bt.Sequence();
            let attackRange=new AttackRange();
            attackSeq.addChild(attackRange);
            let attackAction=new Attack_Action();
            attackSeq.addChild(attackAction);
            attackSeq.addChild(new StayIdle());
          //  rootNode.addChild(attackSeq);
            parallelNode.addChild(attackSeq);
        }
        if(1){
            let skillSeq = new bt.Sequence();
            let iskillCooldown=new IsSkillCooldown();
            iskillCooldown.actor=this.actor;
            skillSeq.addChild(iskillCooldown);
            let skillAction=new Useskill();
            skillAction.actor=this.actor;
            skillAction.skillPre=this.skillPrefab;
            skillAction.node=this.node;
            skillSeq.addChild(skillAction);
            // skillSeq.addChild(new StayIdle());
          //  rootNode.addChild(attackSeq);
            parallelNode.addChild(skillSeq);
        }
     
      
    }

}


