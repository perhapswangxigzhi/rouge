import { Vec2 } from "cc";
import { ActorState } from "./ActorState";
import { StateDefine } from "../StateDefine";

export class Idle extends ActorState {
    onEnter(): void {
        this.actor.rigidbody.linearVelocity=Vec2.ZERO;
       // let hasIdle = this.animation.getState(StateDefine.Idle);
       
            if(this.dragonBoneAnimation){
                this.dragonBoneAnimation.playAnimation(StateDefine.Idle,-1);
                //console.log("the dragon bone play idle animation");
            }
            else{
            this.animation.play(StateDefine.Idle);
            }            
     
    }
    
    update(deltaTime: number) {

    }
    onExit(): void {

    }

    onDestory(): void {

    }
    canTransit(to: StateDefine): boolean {
        if (to == StateDefine.Idle) {
            return false;
        }
        return true;
    }
}
