import { _decorator, Component, director, find, math, Node, Prefab, v3, Vec3 } from 'cc';
import { Actor } from '../Actor';
import { bt } from '../../bt/beheviourTree';
import { Idle } from '../state/Idle';
import { StateDefine } from '../StateDefine';
import { Die } from '../state/Die';
import { Walk } from '../state/Walk';
import { BlackboardKey } from '../ai/BlackBoradKey';
import { Emit, IsCooldown, MoveToDest, StayIdle, AttackRange, Attack_Action, IsCustomCooldown, UseRangeskill, Attack_Skill, UseRockskill, UseAreaSkill, IsSkillCooldown } from '../ai/Behavior';
import { SimpleEmitter } from '../projectile/SimpleEmitter';
import { Attack } from '../state/Attack';
import { Dash } from '../state/Dash';
import { Skill_1 } from '../state/Skill';
import { Skill_2 } from '../state/Skill_2';

const { ccclass, property } = _decorator;

@ccclass('EnemyControl')
export class EnemyControl extends Component {

    actor: Actor = null;
    playerActor: Actor = null;
    playerNode: Node = null;
    ai: bt.BehaviourTree = null;
    moveDest: Vec3 = null;
    enemyTag: number = 0;
    distance: number = 0;
    dir: Vec3 = new Vec3();
    @property(SimpleEmitter)
    projectileEmitter: SimpleEmitter | null = null;
    frozenTag: boolean = false; // 冻结敌人
    frozenTime: number = 0; // 冻结时间
    MaxfrozenTime: number = 3; // 冻结时间上限
    @property(Prefab)
    skillPrefab: Prefab | null = null;
    static isPause:boolean=false;
    start() {
        this.actor = this.node.getComponent(Actor);
        this.playerNode = this.node.parent.getChildByName('Player');
        if (this.playerNode) {
            this.playerActor = this.playerNode.getComponent(Actor);
        }

        // 设置 enemyTag
        this.setEnemyTag();

        // 创建并初始化 AI 和黑板
        this.createAI();
        this.initBlackboard();

        // 注册状态
        this.registerStates();

        // 启动默认状态
        this.actor.stateMgr.startWith(StateDefine.Idle);
    }

    update(deltaTime: number) {
        if (EnemyControl.isPause) return;

        // 冻结处理
        if (this.frozenTime > 0) {
            this.frozenTime -= deltaTime;
            this.actor.stateMgr.transit(StateDefine.Idle);
        } else {
            this.ai.update(deltaTime);
            if (this.playerNode?.isValid) {
                this.moveDest = this.playerActor.node?.worldPosition.clone();
                this.distance = Vec3.subtract(this.dir, this.moveDest, this.node.worldPosition).length();
                this.ai.setData(BlackboardKey.MoveDest, this.moveDest);
                this.ai.setData(BlackboardKey.Dir, this.dir);
                this.ai.setData(BlackboardKey.Distance, this.distance);
            }
        }
    }

    // 设置 enemyTag
    protected setEnemyTag() {
        const name = this.node.name;
        if (name === 'Enemy6') {
            this.enemyTag = 3; // 滚动技能类敌人
        } else if (name === 'Enemy7') {
            this.enemyTag = 4; // 散射技能类敌人
        } else if (name === 'Boss1') {
            this.enemyTag = 101; // boss敌人
        } else if (name === 'Boss2') {
            this.enemyTag = 102; // boss敌人
        } else if (name === 'Boss3') {
            this.enemyTag = 103; // boss敌人
        } else if (name === 'Boss4') {
            this.enemyTag = 104; // boss敌人
        } else if (name === 'Boss5') {
            this.enemyTag = 105; // boss敌人
        }else if (this.skillPrefab != null) {
            this.enemyTag = 2; // 远程技能类敌人
        } else if (this.node.getComponentInChildren(SimpleEmitter)) {
            this.enemyTag = 0; // 射击类敌人
        } else {
            this.enemyTag = 1; // 近战类敌人
        }
    }

    // 注册敌人的状态
    protected registerStates() {
        const stateMgr = this.actor.stateMgr;
        stateMgr.registState(new Idle(StateDefine.Idle, this.actor));
        stateMgr.registState(new Walk(StateDefine.Walk, this.actor));
        stateMgr.registState(new Die(StateDefine.Die, this.actor));
        stateMgr.registState(new Attack(StateDefine.Attack, this.actor));
        stateMgr.registState(new Skill_1(StateDefine.Skill_1, this.actor));
        stateMgr.registState(new Skill_2(StateDefine.Skill_2, this.actor));
        stateMgr.registState(new Dash(StateDefine.Dash, this.actor));
    }

    // 初始化黑板
    protected initBlackboard() {
        this.ai.setData(BlackboardKey.EscapeOnce, true);
        this.ai.setData(BlackboardKey.Actor, this.actor);
        this.ai.setData(BlackboardKey.playerActor, this.playerActor);
        this.ai.setData(BlackboardKey.Dir, this.dir);
        this.ai.setData(BlackboardKey.CanAttack, true);
    }

    // 创建 AI 行为树
    protected createAI() {
        if (!this.ai) {
            this.ai = new bt.BehaviourTree();
        }

        // 创建根节点
        let rootNode = new bt.Fallback();
        this.ai.root = rootNode;

        // 跟随玩家
        let moveDestSeq = new bt.Sequence();
        let moveDest = new MoveToDest();
        moveDestSeq.addChild(moveDest);
        rootNode.addChild(moveDestSeq);

        // 根据 enemyTag 创建不同的行为
        this.createEnemyBehavior(moveDestSeq);
    }

    // 根据 enemyTag 创建不同的敌人行为
    protected createEnemyBehavior(moveDestSeq: bt.Sequence) {
        if (this.enemyTag === 0) {
            // 射击类敌人
            this.createRangedEnemyBehavior(moveDestSeq);
        } else if (this.enemyTag === 1) {
            // 近战敌人
            this.createMeleeEnemyBehavior(moveDestSeq);
        } else if (this.enemyTag === 2) {
            // 远程技能敌人
            this.createSkillEnemyBehavior(moveDestSeq);
        } else if (this.enemyTag === 3) {
            // 滚动技能敌人
            this.createRollingSkillEnemyBehavior(moveDestSeq);
        } else if (this.enemyTag === 4) {
            // 散射技能敌人
            this.createAreaSkillEnemyBehavior(moveDestSeq);
        } 
    }

    private createRangedEnemyBehavior(moveDestSeq: bt.Sequence) {
        const emitSeq = new bt.Sequence();
        const simpleEmitter = this.node.getComponentInChildren(SimpleEmitter);
        const cooldown = new IsCooldown();
        cooldown.emitter = simpleEmitter;
        const emit = new Emit();
        emit.emitter = simpleEmitter;
        const wait = new bt.Wait();

        emitSeq.addChild(cooldown);
        emitSeq.addChild(new StayIdle());
        emitSeq.addChild(wait);
        emitSeq.addChild(emit);
        moveDestSeq.addChild(emitSeq);
    }

    private createMeleeEnemyBehavior(moveDestSeq: bt.Sequence) {
        const attackSeq = new bt.Sequence();
        const attackRange = new AttackRange();
        attackSeq.addChild(attackRange);
        const attackAction = new Attack_Skill();
        attackSeq.addChild(attackAction);
        moveDestSeq.addChild(attackSeq);
    }

    private createSkillEnemyBehavior(moveDestSeq: bt.Sequence) {
        const skillSeq = new bt.Sequence();
        const iskillCooldown = new IsSkillCooldown();
        iskillCooldown.actor = this.actor;
        const skillAction = new UseRangeskill();
        skillAction.actor = this.actor;
        skillAction.skillPre = this.skillPrefab;
        skillAction.node = this.node;
        skillSeq.addChild(iskillCooldown);
        skillSeq.addChild(skillAction);
        moveDestSeq.addChild(skillSeq);
    }

    private createRollingSkillEnemyBehavior(moveDestSeq: bt.Sequence) {
        const skillSeq = new bt.Sequence();
        const iskillCooldown = new IsSkillCooldown();
        iskillCooldown.actor = this.actor;
        const skillAction = new UseRockskill();
        skillAction.actor = this.actor;
        skillAction.node = this.node;
        skillSeq.addChild(iskillCooldown);
        skillSeq.addChild(skillAction);
        moveDestSeq.addChild(skillSeq);
    }

    private createAreaSkillEnemyBehavior(moveDestSeq: bt.Sequence) {
        const skillSeq = new bt.Sequence();
        const iskillCooldown = new IsSkillCooldown();
        iskillCooldown.actor = this.actor;
        const skillAction = new UseAreaSkill();
        skillAction.actor = this.actor;
        skillAction.skillPre = this.skillPrefab;
        skillAction.node = this.node;
        skillSeq.addChild(iskillCooldown);
        skillSeq.addChild(skillAction);
        moveDestSeq.addChild(skillSeq);
    }

   
}
