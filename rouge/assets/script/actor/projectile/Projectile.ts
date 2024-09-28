import { _decorator, assert, assetManager, AudioClip, AudioSource, Collider2D, Component, Contact2DType, find, IPhysics2DContact, Node, Prefab, RigidBody2D, Tween } from 'cc';
import { Actor } from '../Actor';
import { colliderTag } from '../ColliderTag';
import { PoolManager } from '../../util/PoolManager';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Projectile')
@requireComponent(Collider2D)
@requireComponent(RigidBody2D)
export class Projectile extends Component {

    collider: Collider2D;

    rigidbody: RigidBody2D;

    spinTween: Tween<Node> | null = null;
   

    @property({ type: colliderTag.Define })
    hitTag: colliderTag.Define = colliderTag.Define.PlayerProjectile;

    isDie: boolean = false;
    @property(Actor)
    host: Actor | null = null;
    damage: number = 0;

    start() {
        this.collider = this.node.getComponent(Collider2D);
        this.rigidbody = this.node.getComponent(RigidBody2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);
        
    }

    onCollisionBegin(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if ( colliderTag.isProjectileHitable(self.tag, other.tag)) {
          if(other.node.getComponent(Actor).dead==true){
            //关闭监听事件
            console.log("死亡怪物名字",other.node.name);
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);
          }
          this.scheduleOnce(() => {
            // PoolManager.instance().putNode(this.node);
            this.node.destroy();
          });
          
        }
    }
}

