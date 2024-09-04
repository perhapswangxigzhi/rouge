import { _decorator, Component, Node, RigidBody,RigidBody2D,CircleCollider2D,Collider2D, Sprite, CCFloat, Vec2, v2, IPhysics2DContact, Contact2DType, Animation, v3, Vec3, math, Color, Quat, assetManager, AudioClip, AudioSource, dragonBones, resources, Prefab, instantiate, find } from 'cc';
import { StateMachine } from '../fsm/StateMachine';
import { StateDefine } from './StateDefine';
import { colliderTag } from './ColliderTag';
import { Projectile } from './projectile/Projectile';
import { Weapon } from './weapon/Weapon';
import { GameEvent } from '../event/GameEvent';
import { PoolManager } from '../PoolManager';
import { DamageTextManager } from './DamageTextManager';
import { ActorProperty } from './ActorProperty';
import { StrightSkill } from '../skill/StrightSkill';
import { FixedSkill } from '../skill/FixedSkill';
import { PointSkill } from '../skill/PointSkill';
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

    hp:number=100;
    maxHp:number=100;
    attack:number=10;
    ex:number=0;
    maxEx:number=100;
    level:number=0;
    damage:number=0;
    // 使用字典存储多个ActorProperty对象
    actorProperties: { [key: string]: ActorProperty } = {};
    playerProperty : ActorProperty = new ActorProperty("Player",100,10);
    enemy1_Property : ActorProperty = new ActorProperty("Enemy1",50,5);
    enemy3_Property : ActorProperty = new ActorProperty("Enemy3",100,5);
    current_ActorProperty:ActorProperty|null=null;
    @property(Sprite)
    mainRenderer: Sprite|null=null;
    audioSource: AudioSource = null;
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

    start() {
        this.rigidbody = this.getComponent(RigidBody2D);
        this.collider = this.getComponent(Collider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onProjectileTriggerEnter, this);
        this.audioSource = this.node.getComponent(AudioSource);
        this.canvasNode=find('LevelCanvas')
        this.addActorProperty(this.playerProperty);
        this.addActorProperty(this.enemy1_Property);
        this.addActorProperty(this.enemy3_Property);
        this.current_ActorProperty=this.getActorProperty(this.node.name)
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
            // else{this.hurtSrc = cb.node.getComponent(Weapon).host;
            //     console.log("actor weapon:",this.hurtSrc.node.name)
            // }
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
        this.current_ActorProperty.hp=this.current_ActorProperty.hp-damage;
        }
        const hitPosition = new Vec3(hurtDirection.x, hurtDirection.y*2+30, this.node.position.z);
        // 显示伤害文字
        const damageTextNode=instantiate(this.damageTextPrefab);
        damageTextNode.setParent(this.node);
        damageTextNode.getComponent(DamageTextManager).showDamage(hitPosition, damage);;

        this.rigidbody.applyLinearImpulseToCenter(hurtDirection,true)
        //受伤闪烁
        if(this.mainRenderer!=null){
        this.mainRenderer.color=Color.RED;
        this.scheduleOnce(()=>{
            this.mainRenderer.color=Color.WHITE;
    },0.2)}
    assetManager.resources.load("sounds/bulletIn", AudioClip, (err, clip) => {
        // 播放音效
        this.audioSource.playOneShot(clip, 0.3);
         });   
    if(this.current_ActorProperty.hp<=0){
        this.dead = true; // 设置死亡标志
        this.scheduleOnce(()=>{
       // let node=PoolManager.instance().getNode(this.ItemPrefab,this.canvasNode)
        let node=instantiate(this.ItemPrefab);
        this.canvasNode.addChild(node);
        node.worldPosition=this.node.worldPosition;
        },0.1)
        
        this.stateMgr.transit(StateDefine.Die)
        assetManager.resources.load("sounds/die1", AudioClip, (err, clip) => {
        // 播放音效
        this.audioSource.playOneShot(clip, 0.5);
         });    
        // 移除碰撞事件监听
        this.onDisable();           
    }
}
}
