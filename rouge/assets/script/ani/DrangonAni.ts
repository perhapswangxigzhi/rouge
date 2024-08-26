import { _decorator, Component, dragonBones, Node } from 'cc';
import { Actor } from '../actor/Actor';
import { StateDefine } from '../actor/StateDefine';
import { Attack } from '../actor/state/Attack';
const { ccclass, property } = _decorator;

@ccclass('DrangonAni')
export class DrangonAni extends Component {
    @property(Actor)
    actor: Actor | null = null;
    start(){
    this.actor.stateMgr.registState(new Attack(StateDefine.Attack, this.actor))
    this.actor.stateMgr.transit(StateDefine.Attack);

    }











}


