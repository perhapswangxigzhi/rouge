import { _decorator, Component, Label, Node, ProgressBar, RichText, Sprite, SpriteFrame, tween, v3 } from 'cc';
const{ccclass, property} = _decorator;
@ccclass('UIBossWarning')
export class UIBossWarning extends Component {
    @property(Number)
    scale: number = 0;
    
    start(): void {
        this.startScaling();
       
    }
    startScaling(){
            tween(this.node)
                .to(0.5, { scale: v3(this.scale, this.scale, 1) }) // 缩小
                .to(0.5, { scale: v3(1, 1, 1) })     // 放大
                .union()                             // 合并
                .repeatForever()                     // 循环执行
                .start();                            // 开始执行
        }
    
}
