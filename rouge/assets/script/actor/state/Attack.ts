import { dragonBones, v2, Vec3 } from "cc";
import { StateDefine } from "../StateDefine";
import { ActorState } from "./ActorState";


export class Attack extends ActorState {
     animationCompleted: boolean = false;
    tempVec3: Vec3 = new Vec3();
    onEnter(): void {
        
        //console.log("PlayerActor",this.playerActor.name);
        if (this.dragonBoneAnimation) {
        this.dragonBoneAnimation.playAnimation(StateDefine.Attack,1);
        this.dragonBoneAnimation.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationComplete, this);
        }
        this.animationCompleted = false; // 重置动画完成标志
    }
    update(deltaTime: number) {
        
    }
    onExit(): void {

    }
    onAnimationComplete(){
        const v2HitNormal = v2(0,0);
        this.playerActor.onHurt(this.actor.current_ActorProperty.attack,this.actor,v2HitNormal);
        this.animationCompleted = true; // 设置动画完成标志
    }
    canTransit(to: StateDefine): boolean {
        if (to == StateDefine.Attack) {
            return false;
        }
        return this.animationCompleted; // 只有在动画完成时才允许状态转换
      
    }
}