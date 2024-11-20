import { _decorator, Animation, assert, assetManager, AudioClip, AudioSource, CCFloat, CCInteger, Collider2D, Component, Contact2DType, dragonBones, find, instantiate, IPhysics2DContact, macro, Node, PhysicsSystem2D, Prefab, Rect, rect, RigidBody2D, Tween, v2, v3, Vec2, Vec3 } from 'cc';
import { colliderTag } from '../actor/projectile/ColliderTag';
import { Actor } from '../actor/Actor';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('FixedSkill')
@requireComponent(Collider2D)
@requireComponent(RigidBody2D)
export class FixedSkill extends Component {
    collider: Collider2D;
    rigidbody: RigidBody2D;
    @property(AudioSource)
    audioSource: AudioSource = null;
    hitTag: colliderTag.Define = colliderTag.Define.PlayerProjectile;
    skillDragonBoneAnimation: dragonBones.ArmatureDisplay=null;
    host: Actor | null = null;
    enemHost: Actor[] = [];
    damage: number = 0;
    Count:number=0;
    @property(Prefab)
    skillBuffPrefab: Prefab = null;
    @property(CCFloat)
    skillCoefficient: number = 0;  //技能伤害系数
    @property(CCInteger)
    skillReleaseCount: number = 0;  //技能释放次数
    @property(String)
    playSkillDragonBoneAudio: string = '';  //播放技能龙骨动画名
    @property(Number)
    skillPerporty: number = 0;  //技能属性
    @property(Boolean)
    skillIsEnemy: boolean = false;  //是否为敌人技能
    skillRealseTime:number=0;
    start() {
        this.collider = this.node.getComponent(Collider2D);
        this.rigidbody = this.node.getComponent(RigidBody2D);
         // 将组件赋到全局变量 _audioSource 中
        this.audioSource = this.node.getComponent(AudioSource);
        this.skillDragonBoneAnimation=this.node.getComponent(dragonBones.ArmatureDisplay)
        this.skillDragonBoneAnimation.playAnimation(this.playSkillDragonBoneAudio,0);
        this.skillRealseTime= this.skillDragonBoneAnimation.playAnimation(this.playSkillDragonBoneAudio,0).totalTime
        const playerNode=find('LevelCanvas/Player')
        if(this.skillIsEnemy==true){
         this.host=this.node.parent.getComponent(Actor)
        }else{
          this.host=playerNode.getComponent(Actor)
        }
        if(this.host.current_ActorProperty!=null){
          this.damage=this.host.current_ActorProperty.attack*this.skillCoefficient;
        }
         this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);
        this.collider.on(Contact2DType.END_CONTACT, this.onCollisionEnd, this);
        //监听动画播放完成事件
       this.skillDragonBoneAnimation.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onAnimationComplete, this);
       this.scheduleOnce(()=>{
        this.node.destroy();
      },this.skillRealseTime*this.skillReleaseCount)
    }

    onCollisionBegin(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if ( colliderTag.isProjectileHitable(self.tag, other.tag)) {
          this.enemHost.push(other.node.getComponent(Actor));
        }
    
    }
    
    onCollisionEnd(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
      if (colliderTag.isProjectileHitable(self.tag, other.tag)) {
      
          var index = this.enemHost.indexOf(other.node.getComponent(Actor));
          if (index > -1) {
            this.enemHost.splice(index, 1);
      }
    }
  }
    onAnimationComplete() {
        const v2HitNormal = v2(0,0);
        this.enemHost.forEach((enemy) => {
          if(this.skillBuffPrefab!=null){
            const skillBuffNode=instantiate(this.skillBuffPrefab);
             skillBuffNode.setParent(enemy.node);
           }
          enemy.onHurt(this.damage, this.host, v2HitNormal)
        })
     
   }

}
