import { math, v2, Vec2, dragonBones} from "cc";
import { StateDefine } from "../StateDefine";
import { ActorState } from "./ActorState";

export class Walk extends ActorState {

    //临时速度
    velocity: Vec2 = v2();
    onExit() {

    }

    onDestory() {

    }

    onEnter(): void {
        if (this.dragonBoneAnimation) {
            this.dragonBoneAnimation.playAnimation(StateDefine.Walk,-1);
            console.log("the dragonBoneAnimation is playing Walk");
        } else {
            this.animation.play(StateDefine.Walk);
        }
    }
    update(deltaTime: number): void {
        this.velocity.set(this.actor.input.x, this.actor.input.y);
        this.velocity.multiplyScalar(this.actor.linearSpeed);
        this.actor.rigidbody.linearVelocity = this.velocity;

        if(this.actor.input.length()<=math.EPSILON){
            this.actor.stateMgr.transit(StateDefine.Idle)
        }
    }
    canTransit(to: StateDefine): boolean {
        if (to == this.id) {
            return false;
        }
        return true;
    }
 }
