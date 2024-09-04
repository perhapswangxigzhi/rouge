import { _decorator, Animation, assert, assetManager, AudioClip, AudioSource, CCFloat, Collider2D, Component, Contact2DType, dragonBones, find, instantiate, IPhysics2DContact, Node, Prefab, RigidBody2D, Tween, v2, v3, Vec2, Vec3 } from 'cc';
import { colliderTag } from '../actor/ColliderTag';
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
    isEnemyInRange: boolean = false;
    @property(CCFloat)
    skillCoefficient: number = 0;  //技能伤害系数
    @property(Number)
    skillContinueTime: number = 0;  //技能持续时间
    @property(String)
    playSkillDragonBoneAudio: string = '';  //播放技能龙骨动画名
    start() {
        this.collider = this.node.getComponent(Collider2D);
        this.rigidbody = this.node.getComponent(RigidBody2D);
         // 将组件赋到全局变量 _audioSource 中
        this.audioSource = this.node.getComponent(AudioSource);
        this.skillDragonBoneAnimation=this.node.getComponent(dragonBones.ArmatureDisplay)
        this.skillDragonBoneAnimation.playAnimation(this.playSkillDragonBoneAudio,0);
        const playerNode=find('LevelCanvas/Player')
        this.host=playerNode.getComponent(Actor)
        if(this.host.current_ActorProperty!=null){
          this.damage=this.host.current_ActorProperty.attack*this.skillCoefficient;
        }

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);
        this.collider.on(Contact2DType.END_CONTACT, this.onCollisionEnd, this);
        //监听动画播放完成事件
       this.skillDragonBoneAnimation.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onAnimationComplete, this);
       this.scheduleOnce(()=>{
        this.node.destroy();
        },this.skillContinueTime)
    }

    onCollisionBegin(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if ( colliderTag.isProjectileHitable(self.tag, other.tag)) {
          //console.log('敌人进入技能范围');
          this.isEnemyInRange = true;
          this.enemHost.push(other.node.getComponent(Actor));
        }
    }
    
    onCollisionEnd(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
      if (colliderTag.isProjectileHitable(self.tag, other.tag)) {
        //  console.log('敌人离开技能范围');
          this.isEnemyInRange = false;
          var index = this.enemHost.indexOf(other.node.getComponent(Actor));
          if (index > -1) {
            this.enemHost.splice(index, 1);
      }
    }
  }
    onAnimationComplete() {
     // console.log("动画播放完成");
      if (this.isEnemyInRange==true) {
        const v2HitNormal = v2(0,0);
        this.enemHost.forEach((enemy) => {
          enemy.onHurt(this.damage, this.host, v2HitNormal)
        })
      }
      
   }
   
    
}
