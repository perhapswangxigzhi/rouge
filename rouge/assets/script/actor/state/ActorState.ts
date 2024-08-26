import { Animation, dragonBones } from "cc";
import { IState } from "../../fsm/State";
import { Actor } from "../Actor";
import { StateDefine } from "../StateDefine";

export abstract class ActorState implements IState<StateDefine> {
    id: StateDefine;
    actor: Actor
    animation: Animation
    dragonBoneAnimation: dragonBones.ArmatureDisplay; // 定义龙骨动画属性

    constructor(id: StateDefine, actor: Actor) {
        this.actor = actor;
        this.id = id;
        this.animation = actor.animation;
        this.dragonBoneAnimation = actor.dragonBoneAnimation;
    }

    onEnter() { }
    onExit() { }
    update(deltaTime: number) { }
    onDestory() { }

    canTransit(to: StateDefine): boolean {
        return true;
    }

}