import { _decorator, Component, Node, Vec3, Collider2D, Contact2DType, IPhysics2DContact, v3, RigidBody2D, CircleCollider2D, AudioSource, assetManager, AudioClip, v2 } from 'cc';
import { colliderTag } from './ColliderTag';
import { PoolManager } from '../PoolManager';
import { Actor } from './Actor';
const { ccclass, property } = _decorator;

@ccclass('MagnetEffect')

export class MagnetEffect extends Component {
    actor: Actor | null = null;
    circleCollider2D: CircleCollider2D;
    rigidbody: RigidBody2D;
    @property
    magnetRange: number = 100; // 磁铁作用范围
    audioSource: AudioSource = null;
    @property
    magnetSpeed: number = 100; // 物品被吸引的速度
    item:Node = null;
    dropEx:number=10;
    itemTag:colliderTag.Define = null;
    isDie:boolean=false;
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
                this.item = other.node;
                this.itemTag=other.tag;
                // console.log('碰撞:', this.item);
                // console.log('other.tag:',other.tag);
                // console.log('self.tag:',self.tag);
    }
}
    onDisable() {
        this.circleCollider2D.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    update(dt: number) {
        // 每帧更新，使物品向玩家角色移动
            if (this.item && this.item.active&&this.itemTag==colliderTag.Define.dropItem) {
                let dir = v3(); 
                Vec3.subtract(dir, this.node.getPosition(), this.item.getPosition());
                let distance = dir.length();
                dir.normalize();

                if (distance <= this.magnetRange) {
                    let speed = this.magnetSpeed * dt;
                    this.item.setPosition(this.item.position.add(dir.multiplyScalar(speed)))
                }
                if (distance <5) {
                    PoolManager.instance().putNode(this.item);
                    this.actor.ex+=this.dropEx;
                    assetManager.resources.load("sounds/getcoin", AudioClip, (err, clip) => {
                        // 播放音效
                        this.audioSource.playOneShot(clip, 0.5);
                        });    
                    this.scheduleOnce(() => {
                    this.item=null;
                        })
             }
               
    }
}
    
}
