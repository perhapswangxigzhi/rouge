import { _decorator, Component, Label, instantiate, Node, Vec3, Prefab, tween, Sprite, Color, SpriteFrame, director, find, color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoomTween')
export class BoomTween extends Component {
   target: Node = null;
   @property(Prefab)
   boomAni: Prefab = null;
   protected start(): void {
         const PlayerNode=find("LevelCanvas/Player")
         this.target=PlayerNode;
        this.setColor(this.node);  //逐渐变红
        this.nodeMoving(this.node);//抛物线运动
   }
   
   nodeMoving(node) { //node为做抛物线运动的节点
    let startPos = node.worldPosition //起点，抛物线开始的坐标
    let targetPos = this.target.worldPosition;
  
    let xDifference = (targetPos.x - this.node.worldPosition.x)/2;
    let middlePos = new Vec3(node.worldPosition.x + xDifference, targetPos.y + 200, 0) //中间坐标，即抛物线最高点坐标
    let destPos = new Vec3(targetPos.x, targetPos.y-30, 0) //终点，抛物线落地点
    //计算贝塞尔曲线坐标函数
    let Bezier = (t: number, p1: Vec3, cp: Vec3, p2: Vec3) => {
      let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
      let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
      return new Vec3(x, y, 0);
    };
    let tweenDuration: number = 1.0;
    tween(node)
     .parallel(
        tween(node)
            .to(tweenDuration, destPos, { 
                onUpdate: (target: Vec3, ratio: number) => {
                node.worldPosition = Bezier(ratio, startPos, middlePos, destPos); 
            }
            }),
             tween(node).to(tweenDuration, { angle: 360 }, { easing: 'smooth' }),   
    )
      .to(tweenDuration/2, { worldPosition: new Vec3(targetPos.x, targetPos.y, 0) }, { easing: 'smooth' })
      .to(tweenDuration/2, { worldPosition: new Vec3(targetPos.x, targetPos.y-30, 0) }, { easing: 'smooth' })
    
      .start();
   }
   setColor(node){
    let color=new Color(255, 255,255,255);
    let Count=0
    this.schedule(()=>{
        color.g-=5;
        color.b-=5;
        this.node.getComponent(Sprite).color=color;
        Count++;
        if(Count==42){
            this.getBoomAni();
        }
        if(Count==45){
            color.a=0;
        }
        if(Count==50){
            this.node.destroy();
        }
    },0.04,50,0.04)
   }
   getBoomAni() {
        let boomAni = instantiate(this.boomAni);
        this.node.parent.addChild(boomAni);
        boomAni.worldPosition = this.node.worldPosition
   }
}
