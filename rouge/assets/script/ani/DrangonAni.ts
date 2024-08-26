import { _decorator, Component, dragonBones, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DrangonAni')
export class DrangonAni extends Component {
    start(){
    // 创建龙骨动画对象
    const dragonDisplay = this.node.getComponent(dragonBones.ArmatureDisplay);
     // 播放动画
    dragonDisplay.playAnimation('attack', -1);

    }











}


