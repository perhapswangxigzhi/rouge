import { _decorator, Component, math, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Actor 属性
 */
export class ActorProperty {
    name: string = null;
    /**
     * 最大生命值
     */
    maxHp : number = 100;
    /**
     * 生命
     */
    hp: number = 100;    
    /**
     * 攻击力
    */
    attack: number = 10;

    /**
     * 等级
     */
    level: number = 0;

    /**
     * 当前经验
     */
    ex: number = 0;

    /**
     * 本级最大经验
     */
    maxEx: number = 50;
    /**
     * 击杀数
    */
    killCount: number = 0;
    /**
     * 获取血量百分比
     */
    // get hpPercent():number{
    //     return math.clamp01(this.hp/this.maxHp);
    // }
    constructor(name:string, maxHp:number,attack:number) {
        this.name = name;
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.attack = attack;
    }
}