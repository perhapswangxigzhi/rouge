import { _decorator, BoxCollider2D, Color, Component, Graphics, math, PolygonCollider2D, RigidBody, v2, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('graphics')
export class graphics extends Component {

    ctx: Graphics = null;
    boxCollider: BoxCollider2D = null;
    startPoint: Vec2 = v2(0, 0);
    endPoint: Vec2 = v2(400, 0);
    start() {
        // 获取 Graphics 组件
        this.ctx = this.getComponent(Graphics);
       this.drawLaser(this.startPoint, this.endPoint)
    }

    /**
     * 绘制带蓝色光晕的白色激光效果
     * @param startPoint 起点
     * @param endPoint 终点
     * @param color 激光中心颜色
     */
    drawLaser(startPoint: Vec2, endPoint: Vec2) {
        const ctx = this.ctx;
        ctx.clear();
        // 设置线段两端为圆角
        ctx.lineCap = Graphics.LineCap.ROUND;

        // 蓝色光晕效果：先绘制外层光晕
        for (let i = 12; i >= 1; i--) { // 增加层数
            const alpha = 1 - i * 0.07;  // 透明度递减更慢
            const width = 8 + i * 2;    // 光晕宽度更宽
            const outerColor = new Color(119,220,253, alpha * 255); // 蓝色光晕

            ctx.lineWidth = width;
            ctx.strokeColor = outerColor;
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.lineTo(endPoint.x, endPoint.y);
            ctx.stroke();
            
        }
      //  this.setBoxCollider(startPoint, endPoint,ctx.lineWidth) //改变碰撞体大小
        // 白色主激光线渐变效果
        for (let i = 0; i < 8; i++) { // 增加渐变层数
            const alpha = 1 - i * 0.15; // 透明度衰减更平滑
            const width = 10 - i * 0.75; // 保持较宽的光晕
            const mainLaserColor = new Color(255, 255, 255, alpha * 255);

            ctx.lineWidth = width;
            ctx.strokeColor = mainLaserColor;
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.lineTo(endPoint.x, endPoint.y);
            ctx.stroke();
        }
       
    }
    //设置碰撞体大小
    setBoxCollider(startPoint: Vec2, endPoint: Vec2,width:number) {
       this.boxCollider = this.node.getComponent(BoxCollider2D);
       this.boxCollider.size = new math.Size(Math.abs(startPoint.x - endPoint.x), width)
       this.boxCollider.offset= new Vec2(Math.abs(startPoint.x - endPoint.x)/2,0)
    }
    drawLightning(startPoint: Vec2, endPoint: Vec2, segments: number) {
        const ctx = this.ctx;
        ctx.lineCap = Graphics.LineCap.ROUND;

        // 创建随机中间点
        const points: Vec2[] = [startPoint];
        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            const x = startPoint.x + (endPoint.x - startPoint.x) * t;
            const y = startPoint.y + (endPoint.y - startPoint.y) * t + Math.random() * 40 - 20; // 随机偏移
            points.push(v2(x, y));
        }
        points.push(endPoint);

        // 绘制外层光晕
        for (let i = 6; i >= 1; i--) {
            const alpha = 1 - i * 0.15;
            const width = 6 + i;
            const outerColor = new Color(119, 220, 253, alpha * 255);

            ctx.lineWidth = width;
            ctx.strokeColor = outerColor;
            ctx.moveTo(points[0].x, points[0].y);
            for (let j = 1; j < points.length; j++) {
                ctx.lineTo(points[j].x, points[j].y);
            }
            ctx.stroke();
        }

        // 绘制白色主闪电线
        for (let i = 0; i < 4; i++) {
            const alpha = 1 - i * 0.2;
            const width = 4 - i * 0.5;
            const mainLightningColor = new Color(255, 255, 255, alpha * 255);

            ctx.lineWidth = width;
            ctx.strokeColor = mainLightningColor;
            ctx.moveTo(points[0].x, points[0].y);
            for (let j = 1; j < points.length; j++) {
                ctx.lineTo(points[j].x, points[j].y);
            }
            ctx.stroke();
        }
    }


}
