import { _decorator, Animation, assert, assetManager, AudioClip, AudioSource, CCFloat, Collider2D, Component, Contact2DType, find, instantiate, IPhysics2DContact, Node, Prefab, RigidBody2D, Tween, v2, v3, Vec2, Vec3 } from 'cc';
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
    host: Actor | null = null;
    damage: number = 0;
    @property(CCFloat)
    startLinearSpeed: number = 0;
    start() {
        this.collider = this.node.getComponent(Collider2D);
        this.rigidbody = this.node.getComponent(RigidBody2D);
         // 将组件赋到全局变量 _audioSource 中
        this.audioSource = this.node.getComponent(AudioSource);
        this.skillAnimation = this.node.getComponent(Animation);
        this.skillAnimation.play();
        const playerNode=find('LevelCanvas/Player')
        this.host=playerNode.getComponent(Actor)
        if(this.host.current_ActorProperty!=null){
          this.damage=this.host.current_ActorProperty.attack*2;
          }

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);
        this.skillRealse();
    }

    onCollisionBegin(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if ( colliderTag.isProjectileHitable(self.tag, other.tag)) {
            // console.log('技能已经命中目标');
            // console.log(this.damage)
          this.scheduleOnce(() => {
            this.node.destroy();
          },1);
          
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
      },4)
  }
}
