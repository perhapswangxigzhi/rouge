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
            // let node=instantiate(this.projectilePrefab)
            // node.setParent(this.canvasNode);
            // this.canvasNode.addChild(node)
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
            //3秒后回收节点
            this.scheduleOnce(() => {
                PoolManager.instance().putNode(node);
            }, 3);
        }
   }

   
}


