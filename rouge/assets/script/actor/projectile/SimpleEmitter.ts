import { _decorator, CCFloat, Collider2D, Component, find, game, instantiate, Node, Prefab, RigidBody2D, v2, v3, Vec2, Vec3 } from 'cc';
import { Actor } from '../Actor';
import { Projectile } from './Projectile';
import { PoolManager } from '../../util/PoolManager';
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
    @property(Prefab)
    traceProfab: Prefab | null=null;
    actor:Actor|null=null;
    @property(Node)
    emitterRoot:Node=null;
    canvasNode:Node=null;
    playerNode:Node=null;
    cooldown:number=5 
    castTime:number=0
    openTrace:boolean=false
    start() {
        this.canvasNode=find('LevelCanvas')
        this.playerNode=find('LevelCanvas/Player')
       if(this.node.name=="Emitter_Player"){
        this.actor=find('LevelCanvas/Player').getComponent(Actor)
       }else if(this.node.name=="Emitter_Enemy1"){
        this.actor=find('LevelCanvas/Enemy1').getComponent(Actor)
       }else if(this.node.name=="Emitter_Enemy3"){
        this.actor=find('LevelCanvas/Enemy3').getComponent(Actor)
       }
       
    } 
    get isCoolingdown(){
        return game.totalTime-this.castTime>=this.cooldown*1000;
    }
    pointEmit(){
        this.castTime=game.totalTime;
         // 获取玩家位置
        const playerPosition = this.playerNode.worldPosition;

        for (let i = 0; i < this.emitterRoot.children.length; i++) {
        let emiterNode = this.emitterRoot.children[i];
        const emitterWorldPosition = emiterNode.worldPosition;
       
        // 计算从发射器指向玩家的方向向量
        let direction = Vec3.subtract(v3(), playerPosition, emitterWorldPosition);
        // 归一化方向向量
        Vec3.normalize(direction, direction);
        // 可以用内存池优化
        let node = PoolManager.instance().getNode(this.projectilePrefab, this.canvasNode);
        // 设置速度
        let rigid = node.getComponent(RigidBody2D);
        let velocity = v2();

        // 将方向向量转化为速度向量
        velocity.x = direction.x * this.startLinearSpeed;
        velocity.y = direction.y * this.startLinearSpeed;
        rigid.linearVelocity = velocity;
        rigid.angularVelocity = this.startAngularSpeed;
        node.worldPosition = emiterNode.worldPosition;

        let projectile = node.getComponent(Projectile);
        projectile.host = this.actor;

        if (this.actor.current_ActorProperty != null) {
            projectile.damage = this.actor.current_ActorProperty.attack;
        }
    }
    }
   emit(){
        this.castTime=game.totalTime;
        for(let i=0;i<this.emitterRoot.children.length;i++){
            let emiterNode=this.emitterRoot.children[i];
            const wr=emiterNode.worldRotation;
            //使用用内存池优化
            let node=PoolManager.instance().getNode(this.projectilePrefab,this.canvasNode)
            //如果开启追踪子弹
            if(this.openTrace==true){
                let traceNode_1=PoolManager.instance().getNode(this.traceProfab,this.canvasNode)
                let traceNode_2=PoolManager.instance().getNode(this.traceProfab,this.canvasNode)
                traceNode_1.worldPosition = v3(emiterNode.worldPosition.x+10,emiterNode.worldPosition.y+10,emiterNode.worldPosition.z);
                traceNode_2.worldPosition = v3(emiterNode.worldPosition.x-10,emiterNode.worldPosition.y+10,emiterNode.worldPosition.z);
            }
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
            if(this.actor.current_ActorProperty!=null){
            projectile.damage=this.actor.current_ActorProperty.attack;
            }
        }
   }

   
}


