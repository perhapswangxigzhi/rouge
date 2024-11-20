import { _decorator, Animation, AudioSource, CCFloat, Collider2D, Component, Contact2DType, dragonBones, find, instantiate, IPhysics2DContact, Node, Prefab, RigidBody2D, Tween, v2, v3, Vec2, Vec3 } from 'cc';
import { colliderTag } from '../actor/projectile/ColliderTag';
import { Actor } from '../actor/Actor';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('StrightSkill')
@requireComponent(Collider2D)
@requireComponent(RigidBody2D)
export class StrightSkill extends Component {
    @property(AudioSource)
    audioSource: AudioSource = null;

    @property(Prefab)
    skillBuffPrefab: Prefab = null;

    @property(CCFloat)
    startLinearSpeed: number = 0;

    @property(String)
    playSkillDragonBoneAudio: string = ''; // 播放技能动画名称

    @property(CCFloat)
    skillCoefficient: number = 0; // 技能伤害系数

    @property(Number)
    skillContinueTime: number = 0; // 技能持续时间

    @property(Number)
    skillPerporty: number = 0; // 技能属性

    @property(Boolean)
    skillIsEnemy: boolean = false; // 是否为敌人技能

    collider: Collider2D = null;
    rigidbody: RigidBody2D = null;
    skillAnimation: Animation = null;
    skillDragonBoneAnimation: dragonBones.ArmatureDisplay = null;
    host: Actor | null = null;
    damage: number = 0;

    start() {
        this.initComponents();
        this.playSkillEffects();
        this.calculateDamage();

        // 注册碰撞回调
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);

        // 技能释放逻辑
        this.skillRelease();

        // 设置技能持续时间后销毁节点
        this.scheduleOnce(() => {
            this.node.destroy();
        }, this.skillContinueTime);
    }

    /**
     * 初始化必要的组件
     */
    initComponents() {
        this.collider = this.node.getComponent(Collider2D);
        this.rigidbody = this.node.getComponent(RigidBody2D);
        this.audioSource = this.node.getComponent(AudioSource);
        this.skillAnimation = this.node.getComponent(Animation);
        this.skillDragonBoneAnimation = this.node.getComponent(dragonBones.ArmatureDisplay);
        if (!this.collider || !this.rigidbody) {
            console.error("Collider2D or RigidBody2D is missing!");
        }
    }

    /**
     * 播放技能动画和音效
     */
    playSkillEffects() {
        if (this.skillAnimation) {
            this.skillAnimation.play();
        }
        if (this.skillDragonBoneAnimation) {
            this.skillDragonBoneAnimation.playAnimation(this.playSkillDragonBoneAudio, 0);
        }
        if (this.audioSource) {
            this.audioSource.play();
        }
    }

    /**
     * 计算技能伤害
     */
    calculateDamage() {
        const playerNode = find('LevelCanvas/Player');
        if (this.skillIsEnemy && this.node.parent) {
            this.host = this.node.parent.getComponent(Actor);
        } else if (playerNode) {
            this.host = playerNode.getComponent(Actor);
        }

        if (this.host?.current_ActorProperty) {
            this.damage = this.host.current_ActorProperty.attack * this.skillCoefficient;
        } else {
            console.warn("Host or ActorProperty is null, damage cannot be calculated.");
        }
    }

    /**
     * 碰撞回调
     */
    onCollisionBegin(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if (colliderTag.isProjectileHitable(self.tag, other.tag)) {
            console.log('Collision detected with tag:', other.tag);

            if (this.skillBuffPrefab) {
                const skillBuffNode = instantiate(this.skillBuffPrefab);
                skillBuffNode.setParent(other.node);
            }
        }
    }

    /**
     * 技能释放逻辑
     */
    skillRelease() {
        const wr = this.node.worldRotation;
        let velocityV3 = Vec3.transformQuat(new Vec3(), Vec3.UNIT_X, wr);

        let velocity = new Vec2(velocityV3.x, velocityV3.y);
        velocity.multiplyScalar(this.startLinearSpeed);

        if (this.rigidbody) {
            this.rigidbody.linearVelocity = velocity;
        }
    }

    /**
     * 技能返回逻辑
     */
    skillBack() {
        if (this.node.parent) {
            const casterPosition = this.node.parent.worldPosition.clone();
            const skillPosition = this.node.worldPosition.clone();

            let direction = Vec3.subtract(new Vec3(), casterPosition, skillPosition).normalize();
            let returnVelocity = new Vec2(direction.x, direction.y);
            returnVelocity.multiplyScalar(this.startLinearSpeed);

            if (this.rigidbody) {
                this.rigidbody.linearVelocity = returnVelocity;
            }
        }
    }
}
