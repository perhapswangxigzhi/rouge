import { _decorator, CCFloat, Collider2D, Component, find, game, instantiate, Node, Prefab, RigidBody2D, v2, v3, Vec2, Vec3 } from 'cc';
import { Actor } from '../Actor';
import { Projectile } from './Projectile';
import { PoolManager } from '../../PoolManager';
import { colliderTag } from '../ColliderTag';
const { ccclass, property } = _decorator;

@ccclass('SimpleEmitter')
export class SimpleEmitter extends Component {

    @property(CCFloat)
    startLinearSpeed: number = 0;
    @property(CCFloat)
    startAngularSpeed: number = 0;
    @property(Prefab)
    projectilePrefab: Prefab | null=null;

    actor:Actor|null=null;
    @property(Node)
    emitterRoot:Node=null;
    canvasNode:Node=null;

    cooldown:number=5 ;
    castTime:number=0
    start() {
        this.canvasNode=find('LevelCanvas')
       if(this.node.name=="Emitter01"){
        const playerNode=find('LevelCanvas/Player')
        this.actor=playerNode.getComponent(Actor)
       // console.log(this.actor.node)
       }else if(this.node.name=="Emitter4Dir"){
        const ememyNode=find('LevelCanvas/Enemy1')
        this.actor=ememyNode.getComponent(Actor)
      //  console.log(this.actor.node)
       }
       
    } 
    get isCoolingdown(){
        return game.totalTime-this.castTime>=this.cooldown*1000;
    }

   emit(){
        this.castTime=game.totalTime;
        for(let i=0;i<this.emitterRoot.children.length;i++){
            let emiterNode=this.emitterRoot.children[i];
            const wr=emiterNode.worldRotation;
            //可以用内存池优化
            let node=PoolManager.instance().getNode(this.projectilePrefab,this.canvasNode)

            //旋转x轴
            let left = Vec3.UNIT_X;
            let velocityV3 = v3();
            Vec3.transformQuat(velocityV3, left, wr);

            let rigid = node.getComponent(RigidBody2D);
            let velocity: Vec2 = v2();
            velocity.x = velocityV3.x;
            velocity.y = velocityV3.y;
            velocity.multiplyScalar(this.startLinearSpeed);

            rigid.linearVelocity = velocity;
            rigid.angularVelocity = this.startAngularSpeed;
            node.worldPosition=emiterNode.worldPosition;

            let projectile= node.getComponent(Projectile)
            projectile.host=this.actor;
            //4秒后回收节点
            this.scheduleOnce(() => {
                PoolManager.instance().putNode(node);
            }, 4);
        }
   }

   
}


