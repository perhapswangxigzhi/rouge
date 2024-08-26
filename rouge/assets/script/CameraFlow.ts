import { _decorator, Component, Node, Camera, Vec2, v2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFlow')
export class CameraFlow extends Component {
    @property(Node)
    target: Node | null = null;

    @property(Camera)
    camera: Camera | null = null;

    // 相机跟随的偏移量
    @property(Vec3)
    offset: Vec3 = new Vec3(0, 0, 0);

    update(deltaTime: number) {
        if (this.target && this.camera) {
            // 获取目标节点的位置
            const targetPosition = this.target.position;

            // 计算相机的新位置
            if (targetPosition && this.offset) {
            const newCameraPosition = targetPosition.add(this.offset);
            
            // 更新相机的位置
            this.camera.node.position = newCameraPosition;
            }
        }
    }
}
