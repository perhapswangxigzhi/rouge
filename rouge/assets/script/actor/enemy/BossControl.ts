import { _decorator, Component, Node, Prefab } from 'cc';
import { bt } from '../../bt/beheviourTree';
import { BlackboardKey } from '../ai/BlackBoradKey';
import { Emit, IsCooldown, MoveToDest, StayIdle, AttackRange, Attack_Action, IsLowHp, EscapeDash, UseRangeskill, UseHealSkill, UseAllRangeSkill, UseMeleeSkill, IsCustomCooldown, IsSkillCooldown, UseDirectSkill, UseDragonSkill, UseChargeSkill, canAttack, UseLifesuckSkill } from '../ai/Behavior';
import { EnemyControl } from './EnemyControl';
import { Idle } from '../state/Idle';

const { ccclass, property } = _decorator;

@ccclass('BossContorl')
export class BossContorl extends EnemyControl {
    @property(Prefab)
    healPrefab: Prefab | null = null;
    @property(Prefab)
    skillPrefab2: Prefab | null = null;
    start() {
        super.start();
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }

    initBlackboard() {
        super.initBlackboard();
    }

    createAI() {
        if (this.ai == null) {
            this.ai = new bt.BehaviourTree();
        }

        let rootNode = new bt.Fallback();
        this.ai.root = rootNode;

        // 跟随玩家的行为序列
        let moveDestSeq = new bt.Sequence();
        moveDestSeq.addChild(new MoveToDest());
        rootNode.addChild(moveDestSeq);

        // 创建并行节点，包含攻击、逃脱和技能释放
        let parallelNode = new bt.Parallel();
        moveDestSeq.addChild(parallelNode);

        // 普通攻击行为
        this.addAttackBehavior(parallelNode);

        // 突进逃脱行为
        this.addEscapeBehavior(parallelNode);

        // boss1技能
        this.addBoss1Behavior(parallelNode);

        // boss2技能
        this.addBoos2Behavior(parallelNode);
        // boss3技能
        this.addBoos3Behavior(parallelNode);
        // boss4技能
        this.addBoos4Behavior(parallelNode);
        // boss5技能
        this.addCustomBehavior(parallelNode);

    }

    private addAttackBehavior(parallelNode: bt.Parallel) {
             // 普通攻击
            let attackSeq = new bt.Sequence();
            attackSeq.addChild(new canAttack());//判断技能释放中是否可以普通攻击
            attackSeq.addChild(new AttackRange());
            attackSeq.addChild(new Attack_Action());
            attackSeq.addChild(new StayIdle());
            parallelNode.addChild(attackSeq);
    }

    private addEscapeBehavior(parallelNode: bt.Parallel) {
        // 突进逃脱
        let escapeSeq = new bt.Sequence();
        let hasEscapeKey = new bt.IsTrue();
        hasEscapeKey.key = BlackboardKey.EscapeOnce;
        escapeSeq.addChild(hasEscapeKey);
        escapeSeq.addChild(new IsLowHp());
        escapeSeq.addChild(new EscapeDash());
        parallelNode.addChild(escapeSeq);
    }

    private addBoss1Behavior(parallelNode: bt.Parallel) {
        if (this.enemyTag === 101) { // Boss1技能
            let skillSeq = new bt.Sequence();
            skillSeq.addChild(new IsSkillCooldown().setActor(this.actor));
            skillSeq.addChild(new UseRangeskill().setActor(this.actor).setSkillPrefab(this.skillPrefab).setNode(this.node));
            parallelNode.addChild(skillSeq);
        }
    }

    private addBoos2Behavior(parallelNode: bt.Parallel) {
        if (this.enemyTag === 102) { // Boss2技能
            let healSeq = new bt.Sequence();
            let iskillCooldown = new IsSkillCooldown();
            iskillCooldown.actor = this.actor;

            let healAction = new UseHealSkill();
            healAction.actor = this.actor;
            healAction.healText = this.healPrefab;

            let skillAction = new UseRangeskill();
            skillAction.actor = this.actor;
            skillAction.skillPre = this.skillPrefab;
            skillAction.node = this.node;

            healSeq.addChild(iskillCooldown);
            healSeq.addChild(healAction);
            healSeq.addChild(skillAction);

            parallelNode.addChild(healSeq);
        }
    }
    private addBoos3Behavior(parallelNode: bt.Parallel) {
        if (this.enemyTag === 103) { // Boss3远程技能
            let AllRangeSeq = new bt.Sequence();
            let iskillCooldown = new IsSkillCooldown();
            iskillCooldown.actor = this.actor;
            this.actor.cooldown=7

            let skillAction = new UseAllRangeSkill();
            skillAction.actor = this.actor;
            skillAction.skillPre = this.skillPrefab;
            skillAction.node = this.node;

            AllRangeSeq.addChild(iskillCooldown);
            AllRangeSeq.addChild(skillAction);

            parallelNode.addChild(AllRangeSeq);
        }
        if (this.enemyTag === 103) { // Boss3近战技能
            let MeeleSeq = new bt.Sequence();
            let skillAction = new UseMeleeSkill();
            skillAction.actor = this.actor;
            skillAction.skillPre = this.skillPrefab2;
            skillAction.node = this.node;

            MeeleSeq.addChild(new IsCustomCooldown());
            MeeleSeq.addChild(skillAction);

            parallelNode.addChild(MeeleSeq);
        }
      

    }
    private addBoos4Behavior(parallelNode: bt.Parallel) {
        if (this.enemyTag === 104) {
            // 创建带权重的随机选择器
            let weightedSelector = new bt.WeightedRandomSelector();
            this.actor.cooldown=8
            // 一技能节点
            let skillSeq = new bt.Sequence();
            skillSeq.addChild(new IsSkillCooldown().setActor(this.actor));
            skillSeq.addChild(new UseDirectSkill().setActor(this.actor).setSkillPrefab(this.skillPrefab).setNode(this.node));
    
            // 二技能节点
            let AllRangeSeq = new bt.Sequence();
            let iskillCooldown = new IsSkillCooldown();
            iskillCooldown.actor = this.actor;
            let skillAction = new UseDragonSkill();
            skillAction.actor = this.actor;
            skillAction.skillPre = this.skillPrefab2;
            skillAction.node = this.node;
            AllRangeSeq.addChild(iskillCooldown);
            AllRangeSeq.addChild(skillAction);
    
            // 添加子节点到选择器
            weightedSelector.addChild(skillSeq);       // 一技能
            weightedSelector.addChild(AllRangeSeq);    // 二技能
    
            // 设置权重：一技能 3，二技能 1
            weightedSelector.setWeights([2, 1]);
    
            // 添加选择器到并行节点
            parallelNode.addChild(weightedSelector);
        }
    }
    private addCustomBehavior(parallelNode: bt.Parallel) {
        if(this.enemyTag === 105){  // Boss5 二技能
        
            this.actor.cooldown=10
            const skillSeq = new bt.Sequence();
            const iskillCooldown = new IsSkillCooldown();
            iskillCooldown.actor = this.actor;

            const skillAction = new UseChargeSkill();
            skillAction.actor = this.actor;
            skillAction.node =  this.node;
            
            skillSeq.addChild(iskillCooldown);
            skillSeq.addChild(skillAction)
            parallelNode.addChild(skillSeq);
            
            const LifesuckSkill = new bt.Sequence();
            const isCustomCooldown = new IsCustomCooldown();
            isCustomCooldown.canRealseDistance = 300;
            isCustomCooldown.cooldown = 9;
            LifesuckSkill.addChild(isCustomCooldown);
            LifesuckSkill.addChild(new UseLifesuckSkill().setActor(this.actor).setPlayerActor(this.playerActor).setSkillPrefab(this.skillPrefab)
            .setHealText(this.healPrefab).setNode(this.node));
            parallelNode.addChild(LifesuckSkill);
    
    }
}
    
}
