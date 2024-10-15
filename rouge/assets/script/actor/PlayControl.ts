import { _decorator, assetManager, AudioClip, AudioSource, Component, director, EventKeyboard, Input, input, KeyCode, macro, math, Node, v3, Vec3 } from 'cc';
const { ccclass, property, requireComponent } = _decorator;
import { Actor } from './Actor';
import { StateDefine } from './StateDefine';
import { Idle } from './state/Idle';
import { Walk } from './state/Walk';
import { Die } from './state/Die';
import { SimpleEmitter } from './projectile/SimpleEmitter';
import { VirtualInput } from '../input/VirtualInput';
import { AudioMgr } from '../sound/soundManager';


@ccclass('PlayerController')
@requireComponent(Actor)

export class PlayerController extends Component {

    actor: Actor | null = null;
    @property(Node)
    gun:Node | null = null;

    @property(SimpleEmitter)
    projectileEmitter:SimpleEmitter | null = null;
    static instance:PlayerController | null = null;
    lastAngleRad:number=0;
    direction:number=0;
    start(){
        PlayerController.instance = this;
        this.actor = this.node.getComponent(Actor);

        this.actor.stateMgr.registState(new Idle(StateDefine.Idle, this.actor))
        this.actor.stateMgr.registState(new Walk(StateDefine.Walk, this.actor))
        this.actor.stateMgr.registState(new Die(StateDefine.Die, this.actor))
        this.actor.stateMgr.startWith(StateDefine.Idle);
        const h=VirtualInput.horizontal;
        const v=VirtualInput.vertical;
        this.schedule(() => this.fire(), 1/this.actor.current_ActorProperty.attackSpeed, macro.REPEAT_FOREVER, 0);
  

}


fire(){
    this.projectileEmitter.emit();
    AudioMgr.inst.playOneShot('Shoot',0.5);
    
    }
    
    update(deltaTime: number) {
        if(this.actor.dead){
        return;}
        const h=VirtualInput.horizontal;
        const v=VirtualInput.vertical;
        if(h==0&&v==0){
            this.node.getChildByName('Gun').getChildByName('point').active=false;
        }else{
            this.node.getChildByName('Gun').getChildByName('point').active=true;
        }
        //计算角度（弧度）
        let angleRad = Math.atan2(v, h);
        // 如果 VirtualInput 为零，使用上一次存储的角度
        if (h === 0 && v === 0) {
        angleRad = this.lastAngleRad;
        }else {
        // 将弧度转换为角度
       let angleDeg = angleRad * (180 / Math.PI);
        // 确保角度在 0 到 360 度之间
        if (angleDeg < 0) {
           angleDeg += 360;
       }
        this.direction=angleDeg
        if(this.direction>180){
       this.direction=-((this.direction-180))
       this.direction=this.direction+(-180-2*this.direction)
       }
           // 存储当前角度
       this.lastAngleRad = angleRad;
       this.gun.setRotationFromEuler(0,0,this.direction)
        }
       this.actor.input.set(h,v)   
        if(this.actor.input.length()>=math.EPSILON){
            this.actor.stateMgr.transit(StateDefine.Walk);
        }else{
            this.actor.stateMgr.transit(StateDefine.Idle);
        }
    
}
}

