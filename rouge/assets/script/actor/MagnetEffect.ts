import { _decorator, Component, Node, Vec3, Collider2D, Contact2DType, IPhysics2DContact, v3, RigidBody2D, CircleCollider2D, AudioSource, assetManager, AudioClip, v2 } from 'cc';
import { colliderTag } from './ColliderTag';
import { PoolManager } from '../util/PoolManager';
import { Actor } from './Actor';
const { ccclass, property } = _decorator;

@ccclass('MagnetEffect')

export class MagnetEffect extends Component {
    actor: Actor | null = null;
    circleCollider2D: CircleCollider2D;
    rigidbody: RigidBody2D;
    @property
    magnetRange: number = 300; // 磁铁作用范围
    audioSource: AudioSource = null;
    @property
    magnetSpeed: number = 100; // 物品被吸引的速度
    // item:Node = null;
    dropEx:number=10;
    itemTag:colliderTag.Define = null;
    isDie:boolean=false;
    item:Node[] = [];
    start() {
        this.circleCollider2D = this.node.getComponent(CircleCollider2D);
        this.rigidbody = this.node.getComponent(RigidBody2D);
        this.circleCollider2D.enabled = true;
        this.circleCollider2D.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.audioSource=this.node.getComponent(AudioSource);
        this.actor = this.node.getComponent(Actor);
        
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
                // 检测碰撞的物品是否是敌人掉落的物品
                if(other.tag==colliderTag.Define.dropItem){
                this.item.push(other.node)
                this.itemTag=other.tag;
            }
}
    onDisable() {
        this.circleCollider2D.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    update(dt: number) {
        if (this.item.length > 0 && this.item && this.itemTag == colliderTag.Define.dropItem) {
            this.item.forEach((item) => {
                if (item.isValid) { // 确保 item 没有被摧毁
                    let dir = v3(); 
                    Vec3.subtract(dir, this.node.getPosition(), item.getPosition());
                    let distance = dir.length();
                    dir.normalize();
    
                    if (distance <= this.magnetRange) {
                        let speed = this.magnetSpeed * dt;
                        item.setPosition(item.position.add(dir.multiplyScalar(speed)));
                    }
                    if (distance < 5) {
                        // PoolManager.instance().putNode(item);
                        this.actor.playerProperty.ex += this.dropEx;
                        this.actor.playerProperty.killCount += 1;
                        assetManager.resources.load("sounds/getcoin", AudioClip, (err, clip) => {
                            // 播放音效
                            this.audioSource.playOneShot(clip, 0.5);
                        });    
                       this.scheduleOnce(() => {
                        item.destroy();
                       });
                    }
                }else{  //如果被摧毁就从数组中移除
                      var index = this.item.indexOf(item);
                            if (index > -1) {
                                this.item.splice(index, 1);
                         }
                }
            });
        }
    }
}
