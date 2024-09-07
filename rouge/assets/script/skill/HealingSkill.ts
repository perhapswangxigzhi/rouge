import { _decorator, Animation, assert, assetManager, AudioClip, AudioSource, CCFloat, Collider2D, Component, Contact2DType, dragonBones, find, instantiate, IPhysics2DContact, Node, Prefab, RigidBody2D, Tween, v2, v3, Vec2, Vec3 } from 'cc';
import { colliderTag } from '../actor/ColliderTag';
import { Actor } from '../actor/Actor';
import { DamageTextManager } from '../TextManager/DamageTextManager';
import { CureTextManager } from '../TextManager/CureTextManager';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('HealingSkill')
export class HealingSkill extends Component {
    @property(AudioSource)
    audioSource: AudioSource = null;
    skillDragonBoneAnimation: dragonBones.ArmatureDisplay=null;
    host: Actor | null = null;
    cure: number = 0;
    @property(CCFloat)
    skillCoefficient: number = 0;  //技能治疗系数
    @property(Number)
    skillContinueTime: number = 0;  //技能持续时间
    @property(String)
    playSkillDragonBoneAudio: string = '';  //播放技能龙骨动画名
    @property(Prefab)
    cureTextPrefab: Prefab | null = null;  //播放技能龙骨动画名
    start() {
         // 将组件赋到全局变量 _audioSource 中
        this.audioSource = this.node.getComponent(AudioSource);

        this.skillDragonBoneAnimation=this.node.getComponent(dragonBones.ArmatureDisplay)
        this.skillDragonBoneAnimation.playAnimation(this.playSkillDragonBoneAudio,0);
        const playerNode=find('LevelCanvas/Player')
        this.host=playerNode.getComponent(Actor)
        if(this.host.current_ActorProperty!=null){
          this.cure=this.host.current_ActorProperty.attack*this.skillCoefficient;
        }
        //监听动画播放完成事件
        
       this.skillDragonBoneAnimation.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onAnimationComplete, this);
       this.scheduleOnce(()=>{
        this.node.destroy();
        },this.skillContinueTime)
    }

   
    onAnimationComplete() {
      this.host.current_ActorProperty.setHp(95)
      this.host.current_ActorProperty.hp+=this.cure
       //显示伤害文字
       const cureTextNode=instantiate(this.cureTextPrefab);
       cureTextNode.setParent(this.node);
       const hitPosition = new Vec3(this.node.position.x, this.node.position.y+30, this.node.position.z);
       cureTextNode.getComponent(CureTextManager).showDamage(hitPosition, this.cure);
       this.audioSource.playOneShot(this.audioSource.clip, 1);

  
   }
   
    
}
