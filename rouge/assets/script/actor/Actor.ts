import { _decorator, Component, Node, RigidBody,RigidBody2D,CircleCollider2D,Collider2D, Sprite, CCFloat, Vec2, v2, IPhysics2DContact, Contact2DType, Animation, v3, Vec3, math, Color, Quat, assetManager, AudioClip, AudioSource, dragonBones } from 'cc';
import { StateMachine } from '../fsm/StateMachine';
import { StateDefine } from './StateDefine';
import { colliderTag } from './ColliderTag';
import { Projectile } from './projectile/Projectile';
import { Weapon } from './weapon/Weapon';
import { GameEvent } from '../event/GameEvent';
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
    @property(CCFloat)
    maxHp:number=100;
    attack:number=10;
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
   

    start() {
        this.rigidbody = this.getComponent(RigidBody2D);
        this.collider = this.getComponent(Collider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onProjectileTriggerEnter, this);
        this.audioSource = this.node.getComponent(AudioSource);
        
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
            this.hurtSrc = cb.node.getComponent(Projectile).host;}
            else{this.hurtSrc = cb.node.getComponent(Weapon).host;}
            let hitNormal = v3();
            Vec3.subtract(hitNormal, ca.node.worldPosition, cb.node.worldPosition);
            hitNormal.normalize();
            const v2HitNormal = v2(hitNormal.x*5, hitNormal.y*5);
            this.onHurt(this.attack, this.hurtSrc, v2HitNormal);
        }
    }
    onHurt(damage:number, from:Actor, hurtDirection?:Vec2){
        if (this.dead) {return;}
        this.hp=Math.floor(math.clamp(this.hp-damage,0,this.maxHp));
        this.rigidbody.applyLinearImpulseToCenter(hurtDirection,true)
        //受伤闪烁
        if(this.mainRenderer!=null){
        this.mainRenderer.color=Color.RED;
        this.scheduleOnce(()=>{
            this.mainRenderer.color=Color.WHITE;
    },0.2)}
    if(this.hp<=0){
        this.dead = true; // 设置死亡标志
        this.stateMgr.transit(StateDefine.Die)
        assetManager.resources.load("sounds/die1", AudioClip, (err, clip) => {
        // 播放音效
        this.audioSource.playOneShot(clip, 0.7);
         });    
        // 移除碰撞事件监听
        this.onDisable();           
    }
}
}
