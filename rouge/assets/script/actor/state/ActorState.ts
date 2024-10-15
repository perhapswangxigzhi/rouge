import { Animation, dragonBones, find } from "cc";
import { IState } from "../../fsm/State";
import { Actor } from "../Actor";
import { StateDefine } from "../StateDefine";

export abstract class ActorState implements IState<StateDefine> {
    id: StateDefine;
    actor: Actor
    playerActor: Actor
    animation: Animation
    dragonBoneAnimation: dragonBones.ArmatureDisplay;     // 定义龙骨
    constructor(id: StateDefine, actor: Actor) {
        this.actor = actor;
        this.id = id;
        this.animation = actor.animation;
        this.dragonBoneAnimation = actor.dragonBoneAnimation;
        if(find('LevelCanvas/Player')){
        this.playerActor=find('LevelCanvas/Player').getComponent(Actor)
        }
    }

    onEnter() { }
    onExit() { }
    update(deltaTime: number) { }
    onDestory() { }

    canTransit(to: StateDefine): boolean {
        return true;
    }

}