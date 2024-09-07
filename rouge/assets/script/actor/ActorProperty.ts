import { _decorator, CCFloat, Component, math, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Actor 属性
 */
export class ActorProperty {
    name: string = null;
    /**
     * 最大生命值
     */
    @property(CCFloat)
    maxHp : number = 100;
    /**
     * 生命
     */
    @property(CCFloat)
        hp: number ;
    /**
     * 攻击力
    */
    attack: number = 10;

    /**
     * 等级
     */
    level: number = 0;

    /**
     * 获取经验
     */
    ex: number = 0;

    /**
     * 升级所需经验
     */
    maxEx: number = 50;
    /**
     * 击杀数
    */
    killCount: number = 0;
     /**
     * 设置血量
     * @param value 血量值
     */
     setHp(value: number) {
        this.hp = math.clamp(value, 0, this.maxHp);
    }
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