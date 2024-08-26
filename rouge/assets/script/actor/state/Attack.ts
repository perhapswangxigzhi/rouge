import { StateDefine } from "../StateDefine";
import { ActorState } from "./ActorState";


export class Attack extends ActorState {

    onEnter(): void {
        console.log("Attack: onEnter");
        this.dragonBoneAnimation.playAnimation(StateDefine.Attack,0);
        
           
    }
    update(deltaTime: number) {

    }
    onExit(): void {

    }

    onDestory(): void {

    }




    canTransit(to: StateDefine): boolean {
        if (to == StateDefine.Attack) {
            return false;
        }
        return true;
    }
}