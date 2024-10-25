import { _decorator, Animation, assert, assetManager, AudioClip, AudioSource, CCFloat, Collider2D, Component, Contact2DType, dragonBones, find, instantiate, IPhysics2DContact, macro, Node, PhysicsSystem2D, Prefab, rect, RigidBody2D, Tween, v2, v3, Vec2, Vec3 } from 'cc';
import { Actor } from '../Actor';
import { colliderTag } from '../ColliderTag';
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
        this.host=playerNode.getComponent(Actor)
        if(this.host.current_ActorProperty!=null){
          this.damage=this.host.current_ActorProperty.attack*this.skillCoefficient;
          }
        this.schedule(() =>{
            this.getEnemyList()
        }, 1/this.host.current_ActorProperty.attackSpeed, macro.REPEAT_FOREVER, 0);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);
    }
    getEnemyList(): void {
        for(let i=0;i<=2;i++){
            this.enemyNode=find('LevelCanvas').getChildByName(`Enemy${i}`)
            if(this.enemyNode!=null){
                this.enemyHost=this.enemyNode.getComponent(Actor)
                return;
            }
        }
    }
    update(dt: number) {
        try{
        if (this.enemyNode&&this.enemyHost.dead==false) {
                let dir = v3(); 
                Vec3.subtract(dir, this.enemyNode.worldPosition, this.node.worldPosition);
             //   let distance = dir.length();
                dir.normalize();
                 // 计算角度并设置节点的旋转
                var angle = Vec3.angle(dir, v3(1, 0, 0));
                if (dir.y < 0) {
                    angle = -angle; // 根据 y 轴方向调整角度
                }
                var degree = angle / Math.PI * 180;
                this.node.setRotationFromEuler(0, 0, degree);
                this.rigidbody = this.node.getComponent(RigidBody2D);
                let velocity: Vec2 = v2();
                velocity.x = dir.x;
                velocity.y = dir.y;
                velocity.multiplyScalar(this.startLinearSpeed);
                this.rigidbody.linearVelocity = velocity;
                // if(distance < 5) {
                // this.scheduleOnce(() => {
                //     if(this.skillBuffPrefab!=null){
                //     const skillBuffNode=instantiate(this.skillBuffPrefab);
                //     skillBuffNode.setParent(this.enemyNode);
                //  }
                // this.enemyHost.onHurt(this.damage, this.host, new Vec2(0, 0))
                // this.node.destroy();
                // });
                // } 
            }
        }catch(error){
            console.log("目标已经死亡")
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
            this.unscheduleAllCallbacks();
          });
        }else{
            this.scheduleOnce(() => {
            PoolManager.instance().putNode(this.node);
      }, 5);
         }
    }
}
 
        
    