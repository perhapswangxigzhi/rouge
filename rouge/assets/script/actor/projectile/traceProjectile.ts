import { _decorator, Animation, assert, assetManager, AudioClip, AudioSource, CCFloat, Collider2D, Component, Contact2DType, dragonBones, find, instantiate, IPhysics2DContact, macro, Node, PhysicsSystem2D, Prefab, rect, RigidBody2D, Tween, v2, v3, Vec2, Vec3 } from 'cc';
import { Actor } from '../Actor';
import { colliderTag } from './ColliderTag';
import { PoolManager } from '../../util/PoolManager';
const { ccclass, property, requireComponent } = _decorator;
@ccclass('traceProjectile')
export class traceProjectile extends Component {
    collider: Collider2D;
    rigidbody: RigidBody2D;
    @property(AudioSource)
    audioSource: AudioSource = null;
    host:Actor|null=null;
    enemyNode:Node|null=null;
    enemyHost:Actor|null=null;
    damage: number = 0;
    colliderList: readonly Collider2D[];
    levelCanvas:Node|null=null;
    @property(Prefab)
    skillBuffPrefab: Prefab = null;
    @property(CCFloat)
    startLinearSpeed: number = 0;
    @property(CCFloat)
    skillCoefficient: number = 0;  //技能伤害系数
    

    start() {
        this.collider = this.node.getComponent(Collider2D);
        this.rigidbody = this.node.getComponent(RigidBody2D);
        const playerNode=find('LevelCanvas/Player')
       this.levelCanvas=find('LevelCanvas')
        this.host=playerNode.getComponent(Actor)
        if(this.host.current_ActorProperty!=null){
          this.damage=this.host.current_ActorProperty.attack*this.skillCoefficient;
          }
        //   this.schedule(() => {
        //     PoolManager.instance().putNode(this.node);
        //   }, 3);
          this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);
    }
  
   
    getEnemyList(): void {
      // 获取 LevelCanvas 下的所有子节点
      const children =  this.levelCanvas.children;
      for (const child of children) {
          // 筛选敌人类型的节点
          if (this.isEnemy(child)) {
              const actor = child.getComponent(Actor);
              // 检查敌人是否存活
              if (actor && !actor.dead) {
                this.enemyNode=find(`LevelCanvas/${child.name}`)
                this.enemyHost=this.enemyNode.getComponent(Actor)
                return;
              }
          }
      }
   }
isEnemy(child: Node): boolean {
    // 通过名称前缀或者其他标签/组件来判断是否是敌人
    return child.name.startsWith("Enemy") || child.name.startsWith("ChallengeEnemy") || child.name.startsWith("Boss");
}
update(dt: number) {
        // 如果敌人节点存在且还没死亡
        if (this.enemyNode&& this.enemyHost&&!this.enemyHost.dead ) {
            // 持续获取敌人位置
            let dir = v3();
            let distance = Vec3.subtract(dir, this.enemyNode.worldPosition, this.node.worldPosition).length();
            dir.normalize();
            
            // 计算旋转角度以朝向敌人
            let angle = Vec3.angle(dir, v3(1, 0, 0));
            if (dir.y < 0) {
                angle = -angle;
            }
            let degree = angle / Math.PI * 180;
            this.node.setRotationFromEuler(0, 0, degree);
            
            // 设置投射物的速度方向以追踪敌人
            let velocity: Vec2 = v2(dir.x, dir.y);
            velocity.multiplyScalar(this.startLinearSpeed);
            this.rigidbody.linearVelocity = velocity;
        } else {
            // 如果敌人死亡或节点不存在，则重新获取敌人列表
            this.getEnemyList();
        }
    }


       onCollisionBegin(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if ( colliderTag.isProjectileHitable(self.tag, other.tag)) {
          if(other.node.getComponent(Actor).dead==true){
            return;
          }
          this.scheduleOnce(() => {
            PoolManager.instance().putNode(this.node);
          });
        }
         
    }
}
 
        
    