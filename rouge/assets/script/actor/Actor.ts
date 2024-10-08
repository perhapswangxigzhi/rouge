import { _decorator, Component, Node, RigidBody,RigidBody2D,CircleCollider2D,Collider2D, Sprite, CCFloat, Vec2, v2, IPhysics2DContact, Contact2DType, Animation, v3, Vec3, math, Color, Quat, assetManager, AudioClip, AudioSource, dragonBones, resources, Prefab, instantiate, find, UITransform, color, game } from 'cc';
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
    damage:number=0;
    // 使用字典存储多个ActorProperty对象
    actorProperties: { [key: string]: ActorProperty } = {};
    playerProperty : ActorProperty = new ActorProperty("Player",100,10);
    enemy1_Property : ActorProperty = new ActorProperty("Enemy1",50,5);
    enemy3_Property : ActorProperty = new ActorProperty("Enemy3",100,5);
    challengeEnemy1_Property : ActorProperty = new ActorProperty("challengeEnemy1",200,10);
    challengeEnemy2_Property : ActorProperty = new ActorProperty("challengeEnemy2",400,10);
    boss1_Property : ActorProperty = new ActorProperty("Boss1",500,10);
    building_1_Property:ActorProperty=new ActorProperty("building_1",30,0)
    building_2_Property:ActorProperty=new ActorProperty("building_2",20,0)
    building_3_Property:ActorProperty=new ActorProperty("building_3",10,0)
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
    Item:Prefab|null=null;
    canvasNode:Node=null;
    @property(Prefab)
    ItemPrefab: Prefab | null=null;
    @property(Prefab)
    damageTextPrefab: Prefab = null;
    cirtTextPrefab:Prefab|null=null;
    isCriticalHit:boolean=false
    
    cooldown:number=5 
    castTime:number=0
    
    start() {
      
        this.rigidbody = this.getComponent(RigidBody2D);
        this.collider = this.getComponent(Collider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onProjectileTriggerEnter, this);
        this.canvasNode=find('LevelCanvas')
        this.addActorProperty(this.playerProperty);
        this.addActorProperty(this.enemy1_Property);
        this.addActorProperty(this.enemy3_Property);
        this.addActorProperty(this.challengeEnemy1_Property);
        this.addActorProperty(this.challengeEnemy2_Property);
        this.addActorProperty(this.boss1_Property);
        this.addActorProperty(this.building_1_Property)
        this.addActorProperty(this.building_2_Property)
        this.addActorProperty(this.building_3_Property)
        this.current_ActorProperty=this.getActorProperty(this.node.name)
        this.castTime=game.totalTime;
          //获取暴击预制体
        assetManager.resources.load(`DamageTest/CirtText`, Prefab, (err, prefab) => {
            if(err){
                console.error(err);
            }
            this.cirtTextPrefab = prefab;
        });
        if(this.current_ActorProperty==this.playerProperty){
            this.playerProperty.speed=this.linearSpeed
            this.setEquip();//装备属性
            this.linearSpeed=this.playerProperty.speed
            console.log("装备属性设置成功")
            console.log(this.playerProperty)
        }
       
    }
    get isCoolingdown(){
        return game.totalTime-this.castTime>=this.cooldown*1000;
    }
      // 根据名字获取ActorProperty对象
    getActorProperty(name: string): ActorProperty | undefined {
        return this.actorProperties[name];
    }
    addActorProperty(actorProperty: ActorProperty) {
        this.actorProperties[actorProperty.name] = actorProperty;
    }
    onDisable() {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onProjectileTriggerEnter, this);
    }

    update(deltaTime: number) {
        this.stateMgr.update(deltaTime);
        
    }
    onProjectileTriggerEnter(ca:Collider2D, cb:Collider2D,contact:IPhysics2DContact){
      
        if (colliderTag.isProjectileHitable(cb.tag, ca.tag)) {
            if(cb.node.getComponent(Projectile)){
            this.hurtSrc = cb.node.getComponent(Projectile).host;
            this.damage = cb.node.getComponent(Projectile).damage;
            }
            if(cb.node.getComponent(StrightSkill)){
                this.hurtSrc = cb.node.getComponent(StrightSkill).host;
                this.damage = cb.node.getComponent(StrightSkill).damage;
            }
            if(cb.node.getComponent(FixedSkill)){
                this.hurtSrc = cb.node.getComponent(FixedSkill).host;
                this.damage = 0
                cb.node.getComponent(FixedSkill).onCollisionBegin
            }
            if(cb.node.getComponent(PointSkill)){
                this.hurtSrc = cb.node.getComponent(PointSkill).host;
                this.damage = 0
                cb.node.getComponent(PointSkill).onCollisionBegin
            }
            
            let hitNormal = v3();
            Vec3.subtract(hitNormal, ca.node.worldPosition, cb.node.worldPosition);
            hitNormal.normalize();
            const v2HitNormal = v2(hitNormal.x, hitNormal.y);
            if(this.hurtSrc.current_ActorProperty!=null){
            this.onHurt(this.damage, this.hurtSrc, v2HitNormal);
            }
        }
    }
  
    onHurt(damage:number, from:Actor, hurtDirection?:Vec2){
        if (this.dead) {return;}
        if(damage==0){return;}
        if(this.current_ActorProperty!=null){
         //伤害计算
         damage = Math.max(damage - this.current_ActorProperty.defence, 0) * this.current_ActorProperty.hurtCoefficient;
        this.isCriticalHit=false;
        this.isCriticalHit = Math.random() < this.current_ActorProperty.crit; // 判定是否暴击
        // 如果是暴击，乘以一个暴击倍数
        if (this.isCriticalHit) {
            damage =damage*this.current_ActorProperty.physicalCritDamage ; // 乘以暴击伤害
        
        }
        this.current_ActorProperty.hp=this.current_ActorProperty.hp-damage
        }

        const hitPosition = new Vec3(hurtDirection.x, hurtDirection.y+this.getComponent(UITransform).height /2+10 , this.node.position.z)
        // 判定伤害文字
        if(this.current_ActorProperty.hurtCoefficient!=1){
            //附加雷伤文字
            const damageTextNode=instantiate(this.damageTextPrefab);
            damageTextNode.setParent(this.node);
            damageTextNode.getComponent(DamageTextManager).showDamage(hitPosition, damage,new Color(125, 249, 255,255));
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
        if(this.current_ActorProperty==this.playerProperty&&AssentManager.instance.navigator==true){
            navigator.vibrate(100);
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
        this.scheduleOnce(()=>{
        let node=instantiate(this.ItemPrefab);
        this.canvasNode.addChild(node);
        node.worldPosition=this.node.worldPosition;
        },0.1)
        if(this.current_ActorProperty.name=="building_1"||this.current_ActorProperty.name=="building_2"||this.current_ActorProperty.name=="building_3"){
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
        this.playerProperty.maxHp+=Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].hp
        this.playerProperty.hp+=Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].hp
        this.playerProperty.attack+=Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].attack
        this.playerProperty.defence+=Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].defence
        this.playerProperty.speed+= this.playerProperty.speed*Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].speed
        this.playerProperty.attackSpeed+=this.playerProperty.attackSpeed*Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].attackSpeed
        this.playerProperty.crit+=Equipment.inst.equipmentPerporty[AssentManager.instance.barEquipCount[i]].crit
        }
    }
}
}
