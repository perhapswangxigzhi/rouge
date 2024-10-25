import { _decorator, Component, Node, RigidBody,RigidBody2D,CircleCollider2D,Collider2D, Sprite, CCFloat, Vec2, v2, IPhysics2DContact, Contact2DType, Animation, v3, Vec3, math, Color, Quat, assetManager, AudioClip, AudioSource, dragonBones, resources, Prefab, instantiate, find, UITransform, color, game, director, sys } from 'cc';
import { StateMachine } from '../fsm/StateMachine';
import { StateDefine } from './StateDefine';
import { colliderTag } from './ColliderTag';
import { Projectile } from './projectile/Projectile';
import { GameEvent } from '../event/GameEvent';
import { PoolManager } from '../util/PoolManager';
import { DamageTextManager } from '../TextManager/DamageTextManager';
import { ActorProperty } from './ActorProperty';
import { StrightSkill } from '../skill/StrightSkill';
import { FixedSkill } from '../skill/FixedSkill';
import { PointSkill } from '../skill/PointSkill';
import { mathutil } from '../util/MathUtil';
import { AudioMgr } from '../sound/soundManager';
import { Equipment } from '../bag/Equipment';
import { AssentManager } from '../bag/AssentManager';
import { PlayerController } from './PlayControl';
import { ActorStage } from './ActorStage';
import { traceProjectile } from './projectile/traceProjectile';
const { ccclass, property ,requireComponent,disallowMultiple} = _decorator;

@ccclass('Actor')
@requireComponent(RigidBody2D)
@requireComponent(CircleCollider2D)
@disallowMultiple(true)
export class Actor extends Component {

    rigidbody: RigidBody2D |null = null;
    collider: Collider2D |null = null;

    stateMgr:StateMachine<StateDefine>=new StateMachine();
    
    @property(Animation)
    animation: Animation|null=null;
    @property(dragonBones.ArmatureDisplay)
    dragonBoneAnimation:dragonBones.ArmatureDisplay|null = null;
    current_ActorProperty:ActorProperty|null=null;
    @property(Sprite)
    mainRenderer: Sprite|null=null;
    dead: boolean = false;
    _input: Vec2 = v2();
    hurtSrc:Actor|null=null;
    set input(v: Vec2) { this._input.set(v.x, v.y); }
    get input(): Vec2 { return this._input; }

    @property(CCFloat)
    linearSpeed:number=0;
    isAttacking: boolean = false;
    canvasNode:Node=null;
    ItemPrefab: Prefab | null=null;
    @property(Prefab)
    damageTextPrefab: Prefab = null;
    cirtTextPrefab:Prefab|null=null;
    isCriticalHit:boolean=false
    damageQueue = [];
    itemName:string=null;
    cooldown:number=5 
    castTime:number=0
    enemyStatic:boolean=false   //敌人是否处于减速状态
    static openDirection:boolean=false   //开启减速
    static increaseDeAndFrez:boolean=false //在减速和冰冻状态下，开启增伤
    start() {
        this.rigidbody = this.getComponent(RigidBody2D);
        this.collider = this.getComponent(Collider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onProjectileTriggerEnter, this);
        this.canvasNode=find('LevelCanvas')
        this.current_ActorProperty=ActorStage.instance.getActorProperty(this.node.name)
        this.castTime=game.totalTime;
          //获取暴击预制体
        assetManager.resources.load(`DamageTest/CirtText`, Prefab, (err, prefab) => {
            if(err){
                console.error(err);
            }
            this.cirtTextPrefab = prefab;
        });
        if(this.current_ActorProperty==ActorStage.instance.playerProperty){
            this.setEquip();//装备属性
            this.linearSpeed=ActorStage.instance.playerProperty.speed
            console.log("装备属性设置成功")
            console.log(ActorStage.instance.playerProperty)
        }
        
    }
    get isCoolingdown(){
        return game.totalTime-this.castTime>=this.cooldown*1000;
    }
    onDisable() {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onProjectileTriggerEnter, this);
    }
    onListenable() {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onProjectileTriggerEnter, this);
    }
    update(deltaTime: number) {
        this.stateMgr.update(deltaTime);
           // 在每帧处理所有累积的伤害
        while (this.damageQueue.length > 0) {
            const { damage, hurtSrc, hitNormal } = this.damageQueue.shift();
            this.onHurt(damage, hurtSrc, hitNormal);
        }
    }
    onProjectileTriggerEnter(ca:Collider2D, cb:Collider2D,contact:IPhysics2DContact){
      
        if (colliderTag.isProjectileHitable(cb.tag, ca.tag)) {
            let hurtSrc;
            let damage = 0;
            if(cb.node.getComponent(Projectile)){
                hurtSrc = cb.node.getComponent(Projectile).host;
                damage = cb.node.getComponent(Projectile).damage;
            }
            if(cb.node.getComponent(traceProjectile)){
                hurtSrc = cb.node.getComponent(traceProjectile).host;
                damage = cb.node.getComponent(traceProjectile).damage;
               
            }
            if(cb.node.getComponent(StrightSkill)){
                hurtSrc = cb.node.getComponent(StrightSkill).host;
                damage = cb.node.getComponent(StrightSkill).damage;
                if(cb.node.getComponent(StrightSkill).skillPerporty==3){   //冰属性减速
                    this.oppoSpeed(0.5);
                }
                damage=this.increaseHurt(cb.node.getComponent(StrightSkill).skillPerporty,damage)
            }
            if(cb.node.getComponent(FixedSkill)){
                hurtSrc = cb.node.getComponent(FixedSkill).host;
                damage = 0;
                cb.node.getComponent(FixedSkill).onCollisionBegin
                if(cb.node.getComponent(FixedSkill).skillPerporty==3){
                    this.oppoSpeed(0.5);
                }
                damage=this.increaseHurt(cb.node.getComponent(FixedSkill).skillPerporty,damage)
            }
            if(cb.node.getComponent(PointSkill)){
                hurtSrc = cb.node.getComponent(PointSkill).host;
                damage = 0;
                if(cb.node.getComponent(PointSkill).skillPerporty==3){
                    this.oppoSpeed(0.5);
                }
                damage=this.increaseHurt(cb.node.getComponent(PointSkill).skillPerporty,damage)
            }
            if(this.enemyStatic==true&&Actor.increaseDeAndFrez==true){  //减速状态下，凑齐10水元素羁绊开启增伤
                damage=damage*2;
            }
            let hitNormal = v3();
            Vec3.subtract(hitNormal, ca.node.worldPosition, cb.node.worldPosition);
            hitNormal.normalize();
            const v2HitNormal = v2(hitNormal.x, hitNormal.y);
              // 将伤害信息加入队列
            this.damageQueue.push(
                { damage, hurtSrc, hitNormal: v2HitNormal }
            );
            // if(this.hurtSrc.current_ActorProperty!=null){
            // this.onHurt(this.damage, this.hurtSrc, v2HitNormal);
            // }
        }
    }
  
    onHurt(damage:number, from:Actor, hurtDirection?:Vec2){
        if (this.dead) {return;}
        if(damage==0){return;}
        if(this.current_ActorProperty!=null){
            if(from.current_ActorProperty!=null&&from.current_ActorProperty==ActorStage.instance.playerProperty){
                //伤害计算
            damage = Math.max(damage+ActorStage.instance.playerProperty.goldAddition-Math.floor((damage*this.current_ActorProperty.defence)/(50+this.current_ActorProperty.defence)), 0) * this.current_ActorProperty.hurtCoefficient;   
            }else{
                damage = Math.max(damage - Math.floor((damage*this.current_ActorProperty.defence)/(50+this.current_ActorProperty.defence)), 0) * this.current_ActorProperty.hurtCoefficient;
            }
            this.isCriticalHit=false;
            this.isCriticalHit = Math.random() < this.current_ActorProperty.crit; // 判定是否暴击
            // 如果是暴击，乘以一个暴击倍数
            if (this.isCriticalHit) {
                damage =damage*this.current_ActorProperty.physicalCritDamage ; // 乘以暴击伤害
            
            }
            if(this.current_ActorProperty==ActorStage.instance.playerProperty&&this.current_ActorProperty.shield>0){
                this.current_ActorProperty.shield=this.current_ActorProperty.shield-damage
            }else{
            this.current_ActorProperty.hp=this.current_ActorProperty.hp-damage;
            }
        }
        const hitPosition = new Vec3(hurtDirection.x, hurtDirection.y+this.getComponent(UITransform).height /2+10 , this.node.position.z)
        // 判定伤害文字
        if(this.current_ActorProperty.hurtCoefficient!=1){
            //附加雷伤文字
            const damageTextNode=instantiate(this.damageTextPrefab);
            damageTextNode.setParent(this.node);
            damageTextNode.getComponent(DamageTextManager).showDamage(hitPosition, damage,new Color(82, 40, 255,255));
        }else if(this.isCriticalHit){
            //暴击伤害文字
            const cirtTextNode=instantiate(this.cirtTextPrefab);
            cirtTextNode.setParent(this.node);
            cirtTextNode.getComponent(DamageTextManager).showCirtDamage(hitPosition, damage,Color.YELLOW);
        }
        else{
            //普通伤害文字
            const damageTextNode=instantiate(this.damageTextPrefab);
            damageTextNode.setParent(this.node);
            damageTextNode.getComponent(DamageTextManager).showDamage(hitPosition, damage,Color.WHITE);
        }
        this.rigidbody.applyLinearImpulseToCenter(hurtDirection,true)
        if(sys.isMobile==true){  //当前环境为手机
        if(this.current_ActorProperty==ActorStage.instance.playerProperty&&AssentManager.instance.navigator==true){
            navigator.vibrate(100);
        }
    }
        //受伤闪烁
        if(this.mainRenderer!=null){
        this.mainRenderer.color=Color.RED;
        this.scheduleOnce(()=>{
            this.mainRenderer.color=Color.WHITE;
    },0.2)}
    if(this.dragonBoneAnimation!=null){
        this.dragonBoneAnimation.color=Color.RED;
        this.scheduleOnce(()=>{
        this.dragonBoneAnimation.color=Color.WHITE;
    },0.2)}
    AudioMgr.inst.playOneShot('bulletIn',0.7);
    if(this.current_ActorProperty.hp<=0){
        this.dead = true; // 设置死亡标志
        // 移除碰撞事件监听
        this.onDisable();   
        //获取掉落物
        this.scheduleOnce(()=>{
        let randomItem = Math.random();
        // 根据随机值选择资源
        if (randomItem < 0.01) { // 1%的几率
            this.itemName = "Magnet";
        } else { // 90%的几率
            this.itemName = "Item";
        }
        assetManager.resources.load(`item/${this.itemName}`,Prefab, (err, prefab) => {
            if(err){
                console.error(err);
            }
            this.ItemPrefab = prefab;
            let node=PoolManager.instance().getNode(this.ItemPrefab,this.canvasNode)
            node.worldPosition=this.node.worldPosition;
        })
        })
        if(this.current_ActorProperty.name=="Building_1"||this.current_ActorProperty.name=="Building_2"||this.current_ActorProperty.name=="Building_3"){
            this.animation.play("die");
            this.scheduleOnce(()=>{
                this.node.destroy();
        },0.1)
        }else{
        this.stateMgr.transit(StateDefine.Die)     
        }
        AudioMgr.inst.playOneShot('die1',0.8);
             
    }
    }
    //实装装备属性
    setEquip(){
        if(AssentManager.instance){
        for(let i=0;i<AssentManager.instance.barEquipCount.length;i++){
        ActorStage.instance.playerProperty.maxHp+=Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].hp
        ActorStage.instance.playerProperty.hp+=Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].hp
        ActorStage.instance.playerProperty.attack+=Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].attack
        ActorStage.instance.playerProperty.defence+=Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].defence
        ActorStage.instance.playerProperty.speed+= ActorStage.instance.playerProperty.speed*Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].speed
        ActorStage.instance.playerProperty.attackSpeed+=ActorStage.instance.playerProperty.attackSpeed*Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].attackSpeed
        ActorStage.instance.playerProperty.crit+=Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].crit
        }
    }
    }
    //减速敌人
    oppoSpeed(directFactor:number){
        if(Actor.openDirection==true&&this.enemyStatic==false){
            if(this.current_ActorProperty!=ActorStage.instance.playerProperty){
                this.linearSpeed=this.linearSpeed*directFactor; //乘以减速系数
                this.cooldown=this.cooldown*directFactor; //减速敌人发射子弹时间
                this.enemyStatic=true; //敌人进入减速状态
                return ;
            }
        }else{
            return ;
        }
    }
  //属性增伤
   increaseHurt(skillPerporty:number,damage:number){
    if(skillPerporty==1){
        damage+=damage*ActorStage.instance.playerProperty.goldAttack;
    }else if(skillPerporty==2){
        damage+=damage*ActorStage.instance.playerProperty.woodAttack;
    }else if(skillPerporty==3){
        damage+=damage*ActorStage.instance.playerProperty.waterAttack;
    }else if(skillPerporty==4){
        damage+=damage*ActorStage.instance.playerProperty.fireAttack;
    }else if(skillPerporty==5){
        damage+=damage*ActorStage.instance.playerProperty.thunderAttack;
    }
    return damage;
  }
  
}
