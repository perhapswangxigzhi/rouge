import { Animation, AnimationState, assetManager, AudioClip, director, dragonBones, Vec2 } from "cc";
import { ActorState } from "./ActorState";
import { StateDefine } from "../StateDefine";
import { GameEvent } from "../../event/GameEvent";

export class Die extends ActorState {
    onEnter(): void {
        this.actor.rigidbody.linearVelocity = Vec2.ZERO;
            if(this.dragonBoneAnimation){
                this.dragonBoneAnimation.playAnimation(StateDefine.Die,1);
	            this.dragonBoneAnimation.addEventListener(dragonBones.EventObject.COMPLETE, this.animationEventHandler, this)
            }
            else{
            this.animation.play(StateDefine.Die);
            this.animation.once(Animation.EventType.FINISHED, this.onDieEnd, this);
            }            
        this.actor.dead = true;        
    }
    animationEventHandler(){
		//对某个动画做监听
        if(this.actor.current_ActorProperty.name=="challengeEnemy1"){
            director.emit(GameEvent.OnChallengeDie, this.actor.node); 
            }
            this.actor.scheduleOnce(() => {    
            this.actor.node.destroy();
            director.emit(GameEvent.OnDie, this.actor.node); 
            }, 0.1);         
	}

    onDieEnd(animationType: Animation.EventType, state: AnimationState) {
        if (animationType == Animation.EventType.FINISHED) {
            if (state.name == StateDefine.Die) {
                
                //删除角色
                this.actor.scheduleOnce(() => {    
                this.actor.node.destroy();
                director.emit(GameEvent.OnDie, this.actor.node); 
                }, 0.1);   
            }
        }
    }
   

    canTransit(to: StateDefine): boolean {
        return false;
    }
} 