import { _decorator, assert, assetManager, AudioClip, AudioSource, Collider2D, Component, Contact2DType, dragonBones, find, IPhysics2DContact, Node, Prefab, RigidBody2D, Tween } from 'cc';
import { Actor } from '../Actor';
import { colliderTag } from '../ColliderTag';
import { PoolManager } from '../../PoolManager';
import { DrangonAni } from '../../ani/DrangonAni';
import { StateDefine } from '../StateDefine';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Weapon')
@requireComponent(Collider2D)
@requireComponent(RigidBody2D)
export class Weapon extends Component {

    collider: Collider2D;

    rigidbody: RigidBody2D;
    dragonBoneAnimation: dragonBones.ArmatureDisplay|null = null; // 定义龙骨动画属性
    spinTween: Tween<Node> | null = null;
    @property(AudioSource)
    audioSource: AudioSource = null;
    @property({ type: colliderTag.Define })
    hitTag: colliderTag.Define = colliderTag.Define.PlayerProjectile;
    @property(Actor)
    host: Actor | null = null;

    isDie: boolean = false;
   

    start() {
        this.collider = this.node.getComponent(Collider2D);
        this.rigidbody = this.node.getComponent(RigidBody2D);
         // 将组件赋到全局变量 _audioSource 中
        this.audioSource = this.node.getComponent(AudioSource);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);
        const ememyNode=find('LevelCanvas/Enemy3')
        this.host=ememyNode.getComponent(Actor)
        //console.log(this.host.node)
      
    }


    onCollisionBegin(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if ( colliderTag.isProjectileHitable(self.tag, other.tag)) {
        //     assetManager.resources.load("sounds/bulletIn", AudioClip, (err, clip) => {
        //         if (this.audioSource) {
        //             // 播放音效
        //             this.audioSource.playOneShot(clip, 0.5);
        //         } 
        //   });
        //   this.scheduleOnce(() => {
        //     PoolManager.instance().putNode(this.node);
        //   });

        }
    }
}

