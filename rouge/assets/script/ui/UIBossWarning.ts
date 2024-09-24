import { _decorator, Component, Node, ProgressBar, RichText, Sprite, SpriteFrame, tween, v3 } from 'cc';
const{ccclass, property} = _decorator;
@ccclass('UIBossWarning')
export class UIBossWarning extends Component {
    @property(SpriteFrame)
    warningIcon: SpriteFrame = null!;
    private sprite: Sprite | null = null;
    protected onLoad(): void {
        this.sprite=this.node.getComponent(Sprite)
        if(this.sprite){
            this.sprite.spriteFrame=this.warningIcon;
        }
        this.startScaling();
    }
    startScaling(){
        if(this.sprite){
            // 设置缩小和放大的动画
            tween(this.sprite.node)
                .to(0.5, { scale: v3(0.5, 0.5, 1) }) // 缩小
                .to(0.5, { scale: v3(1, 1, 1) })     // 放大
                .union()                             // 合并
                .repeatForever()                     // 循环执行
                .start();                            // 开始执行
        }
    }
}
