import { _decorator, Component, Label, instantiate, Node, Vec3, Prefab, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CureTextManager')
export class CureTextManager extends Component {
   
   
    public showDamage(position: Vec3, damageAmount: number) {
       
        this.node.position = position;
        const formattedDamage = `+${damageAmount.toString().replace(/\B/g, " ")}`;
        const labelComponent=this.node.getComponent(Label)
        labelComponent.string = formattedDamage;
        
        // 设置初始字体大小
        labelComponent.fontSize = 10;

        // 使用tween动画调整字体大小
        tween(labelComponent)
            .to(0.5, { fontSize: 25 }) // 在0.5秒内将字体大小从10变到30
            .start();

        // 设置伤害数字的显示效果，比如渐隐、移动等
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.5); 
    }
}