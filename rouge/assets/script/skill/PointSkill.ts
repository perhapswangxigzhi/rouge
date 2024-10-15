import { _decorator, Animation, assert, assetManager, AudioClip, AudioSource, CCFloat, Collider2D, Component, Contact2DType, dragonBones, find, instantiate, IPhysics2DContact, Node, PhysicsSystem2D, Prefab, rect, RigidBody2D, Tween, v2, v3, Vec2, Vec3 } from 'cc';
import { colliderTag } from '../actor/ColliderTag';
import { Actor } from '../actor/Actor';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('PointSkill')
@requireComponent(Collider2D)
@requireComponent(RigidBody2D)
export class PointSkill extends Component {
    collider: Collider2D;
    rigidbody: RigidBody2D;
    @property(AudioSource)
    audioSource: AudioSource = null;
    hitTag: colliderTag.Define = colliderTag.Define.PlayerProjectile;
    skillAnimation:Animation = null;
    skillDragonBoneAnimation: dragonBones.ArmatureDisplay=null;
    host: Actor | null = null;
    enemyNode:Node|null=null;
    enemyHost:Actor|null=null;
    damage: number = 0;
      enemyInitWorldPos: Vec3 = v3();
    colliderList: readonly Collider2D[];
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
    isEnemyInRange: boolean = false;
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
        //this.collider.on(Contact2DType.END_CONTACT, this.onCollisionEnd, this);
        this.scheduleOnce(()=>{
            this.node.destroy();
            },this.skillContinueTime)
        this.colliderList = PhysicsSystem2D.instance.testAABB(rect(0,0,2000,2000));
    }
    onCollisionBegin(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if ( colliderTag.isProjectileHitable(self.tag, other.tag)) {
            if (other.node&&other.node.isValid) { // 范围内存在敌人
                this.isEnemyInRange = true;
                this.enemyNode=other.node;
                this.enemyHost=this.enemyNode.getComponent(Actor);
                this.collider.off(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);
            }
        }
        
    }
   
    update(dt: number) {
       try {
        if (this.enemyNode) {
            if ( this.isEnemyInRange) { // 范围内存在敌人
                let dir = v3(); 
                Vec3.subtract(dir, this.enemyNode.worldPosition, this.node.worldPosition);
                let distance = dir.length();
                dir.normalize();
                 // 计算角度并设置节点的旋转
                var angle = Vec3.angle(dir, v3(1, 0, 0));
                if (dir.y < 0) {
                    angle = -angle; // 根据 y 轴方向调整角度
                }
                var degree = angle / Math.PI * 180;
                this.node.setRotationFromEuler(0, 0, degree);
                let rigid = this.node.getComponent(RigidBody2D);
                let velocity: Vec2 = v2();
                velocity.x = dir.x;
                velocity.y = dir.y;
                velocity.multiplyScalar(this.startLinearSpeed);
                rigid.linearVelocity = velocity;
                console.log(distance)
                if(distance < 5) {
                   this.scheduleOnce(() => {
                    if(this.skillBuffPrefab!=null){
                        const skillBuffNode=instantiate(this.skillBuffPrefab);
                         skillBuffNode.setParent(this.enemyNode);
                       }
                    this.enemyHost.onHurt(this.damage, this.host, new Vec2(0, 0))
                    this.node.destroy();
                   });
                }
               
            }
        }else{
                this.scheduleOnce(() => {
                this.node.destroy();
                },1)
        }
       } catch (err) {
             console.error("属性管理器未记载在场景", err.toString())
       }
        
    }
}
        
    