import { dragonBones, v2, Vec3 } from "cc";
import { StateDefine } from "../StateDefine";
import { ActorState } from "./ActorState";


export class Skill_2 extends ActorState {
    animationCompleted: boolean = false;
    tempVec3: Vec3 = new Vec3();
    dir: Vec3 = new Vec3();
    distance: number = 0;
    onEnter(): void {
        
        //console.log("PlayerActor",this.playerActor.name);
        if (this.dragonBoneAnimation) {
        this.dragonBoneAnimation.playAnimation(StateDefine.Skill_2,1);
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
        this.distance= Vec3.subtract(this.dir, this.playerActor.node.worldPosition, this.actor.node.worldPosition).length();
        
        if(this.distance<100){
            console.log("skill_2 hit");
            this.playerActor.onHurt(this.actor.current_ActorProperty.attack*2,this.actor,v2HitNormal);
        }
        this.animationCompleted = true; // 设置动画完成标志
    }
    canTransit(to: StateDefine): boolean {
        // if (to == StateDefine.Attack) {
        //     return false;
        // }
        return this.animationCompleted; // 只有在动画完成时才允许状态转换
      
    }
}