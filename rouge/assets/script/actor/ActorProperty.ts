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
  
    maxHp : number = 100;
    /**
     * 生命
     */
    hp: number=0 ;
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
     * 暴击率
    */
    crit: number = 0.1;
     /**
     * 物理暴击伤害
    */
    physicalCritDamage: number = 1.5;
     /**
     * 防御力
    */
    defence: number = 0;
    /**
     * 移动速度
    */
    speed: number = 10;
    /**
     * 玩家每秒攻击次数
    */
    attackSpeed: number = 3;
    /**
     * 火属性增伤
    */
    fireAttack: number = 0;
    /**
     * 雷属性增伤
    */
    thunderAttack: number = 0;
    /**
     * 水属性增伤
     */
    waterAttack: number = 0;
     /**
     * 木属性增伤
     */
     woodAttack: number = 0;
      /**
     * 金属性增伤
     */
     goldAttack: number = 0;
      /**
     * 金属性附加伤害
     */
    goldAddition: number = 0;
      /**
     * 生命恢复
     */
    LifeRecovery: number = 0;
     /**
     * 技能冷却
     */
    cd: number = 0;
    /**
     * 护盾量
     */
    shield: number = 0;

    /**
     * 设置血量
     * @param value 血量值
     */
    setHp(value: number) {
        this.hp = math.clamp(value, 0, this.maxHp);
    }
    /**
     * 易伤系数
    */
    hurtCoefficient: number = 1;
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