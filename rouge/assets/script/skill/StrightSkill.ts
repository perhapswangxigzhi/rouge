import { _decorator, Animation, assert, assetManager, AudioClip, AudioSource, CCFloat, Collider2D, Component, Contact2DType, dragonBones, find, instantiate, IPhysics2DContact, Node, Prefab, RigidBody2D, Tween, v2, v3, Vec2, Vec3 } from 'cc';
import { colliderTag } from '../actor/ColliderTag';
import { Actor } from '../actor/Actor';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('StrightSkill')
@requireComponent(Collider2D)
@requireComponent(RigidBody2D)
export class StrightSkill extends Component {
    collider: Collider2D;
    rigidbody: RigidBody2D;
    @property(AudioSource)
    audioSource: AudioSource = null;
    hitTag: colliderTag.Define = colliderTag.Define.PlayerProjectile;
    skillAnimation:Animation = null;
    skillDragonBoneAnimation: dragonBones.ArmatureDisplay=null;
    host: Actor | null = null;
    damage: number = 0;
    @property(Prefab)
    skillBuffPrefab: Prefab = null;
    @property(CCFloat)
    startLinearSpeed: number = 0;
    @property(String)
    playSkillDragonBoneAudio: string = '';  //播放技能动画名
    @property(CCFloat)
    skillCoefficient: number = 0;  //技能伤害系数
    @property(Number)
    skillContinueTime: number = 0;  //技能持续时间
    start() {
        this.collider = this.node.getComponent(Collider2D);
        this.rigidbody = this.node.getComponent(RigidBody2D);
         // 将组件赋到全局变量 _audioSource 中
        this.audioSource = this.node.getComponent(AudioSource);
        this.skillAnimation = this.node.getComponent(Animation);
        if(this.skillAnimation){
        this.skillAnimation.play();
        }
        this.skillDragonBoneAnimation=this.node.getComponent(dragonBones.ArmatureDisplay);
        if(this.skillDragonBoneAnimation){
          this.skillDragonBoneAnimation.playAnimation(this.playSkillDragonBoneAudio,0);
        }
        const playerNode=find('LevelCanvas/Player')
        this.host=playerNode.getComponent(Actor)
        if(this.host.current_ActorProperty!=null){
          this.damage=this.host.current_ActorProperty.attack*this.skillCoefficient;
          }

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);
        this.skillRealse();
    }

    onCollisionBegin(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if ( colliderTag.isProjectileHitable(self.tag, other.tag)) {
          if(this.skillBuffPrefab!=null){
           const skillBuffNode=instantiate(this.skillBuffPrefab);
            skillBuffNode.setParent(other.node);
          }
        }
    }
    skillRealse(){
      const wr=this.node.worldRotation;
      //旋转x轴
      let left = Vec3.UNIT_X;
      let velocityV3 = v3();
      Vec3.transformQuat(velocityV3, left, wr);

      let rigid = this.node.getComponent(RigidBody2D);
      let velocity: Vec2 = v2();
      velocity.x = velocityV3.x;
      velocity.y = velocityV3.y;
      velocity.multiplyScalar(this.startLinearSpeed);
      rigid.linearVelocity = velocity;
      this.scheduleOnce(()=>{
          this.node.destroy();
      },this.skillContinueTime)
  }
}
