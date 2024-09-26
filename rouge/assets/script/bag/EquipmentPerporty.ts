import { _decorator, CCFloat, Component, math, Node } from 'cc';
const { ccclass, property } = _decorator;
enum EquipType {
    Sword,   //武器
    Armor,   //护甲
    bracers,  //护腕
    accessory,  //头盔
    helmet,   //饰品
    shoes,      //鞋子
}
export class EquipmentPerporty {
      /**
     * 装备索引
     */
    Index:string = null;
     /**
     * 装备名称
     */
    name: string = null;
     /**
     * 装备类型
     */
     type: EquipType = 0;
    /**
     * 生命值
     */
    hp: number=0 ;
    /**
     * 攻击力
    */
    attack: number = 0;
    /**
     * 暴击率
    */
    crit: number = 0;
     /**
     * 物理暴击伤害
    */
     physicalCritDamage: number = 0;
    /**
     * 防御力
    */
    defence: number = 0;
    /**
     * 移动速度
    */
    speed: number = 0;
    /**
     * 攻速
    */
    attackSpeed: number = 0;
    /**
     * 生命恢复
    */
    hpRecovery: number = 0;
  
}