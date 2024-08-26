import { dragonBones } from "cc";
import { StateDefine } from "../StateDefine";
import { ActorState } from "./ActorState";


export class Attack extends ActorState {
     animationCompleted: boolean = false;

    onEnter(): void {
        
        console.log("Attack: onEnter");
        if (this.dragonBoneAnimation) {
        this.dragonBoneAnimation.playAnimation(StateDefine.Attack,1);

        }
      
       
    }
    update(deltaTime: number) {
        
    }
    onExit(): void {

    }

    canTransit(to: StateDefine): boolean {
        if (to == StateDefine.Attack) {
            return false;
        }
        return true;
    }
}