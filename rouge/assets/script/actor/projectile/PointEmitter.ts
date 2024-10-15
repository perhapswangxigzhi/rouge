import { _decorator, CCFloat, Collider2D, Component, Contact2DType, find, game, instantiate, IPhysics2DContact, macro, Node, PhysicsSystem2D, Prefab, rect, RigidBody2D, v2, v3, Vec2, Vec3 } from 'cc';
import { Actor } from '../Actor';
import { Projectile } from './Projectile';
import { PoolManager } from '../../util/PoolManager';
import { colliderTag } from '../ColliderTag';
import { AudioMgr } from '../../sound/soundManager';
const { ccclass, property } = _decorator;

@ccclass('PointEmitter')
export class PointEmitter extends Component {
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
    colliderList: readonly Collider2D[];
    cooldown:number=5 
    castTime:number=0
    start() {
        this.canvasNode=find('LevelCanvas')
        if(this.node.name=="Emitter_Player"){
         const playerNode=find('LevelCanvas/Player')
         this.actor=playerNode.getComponent(Actor)
        }else if(this.node.name=="Emitter_Enemy1"){
         const ememyNode=find('LevelCanvas/Enemy1')
         this.actor=ememyNode.getComponent(Actor)
        }else if(this.node.name=="Emitter_Enemy3"){
         const ememyNode=find('LevelCanvas/Enemy3')
         this.actor=ememyNode.getComponent(Actor)
        }
        else if(this.node.name=="PointEmitter"){
            const playerNode=find('LevelCanvas/Player')
            this.actor=playerNode.getComponent(Actor)
        }
       
        // this.emit()
        this.schedule(() =>{
                 this.colliderList = PhysicsSystem2D.instance.testAABB(rect(0,0,1000,1000));
                 this.emit()
                 AudioMgr.inst.playOneShot('Shoot',0.5);
        }, 1/this.actor.current_ActorProperty.attackSpeed, macro.REPEAT_FOREVER, 0);
    } 
    
    get isCoolingdown(){
        return game.totalTime-this.castTime>=this.cooldown*1000;
    }
    
    
   emit(){
        this.castTime=game.totalTime;
            for(let i=0;i<this.colliderList.length;i++){
                if(this.colliderList[i].tag==102&&this.colliderList[i].node&&this.colliderList[i].node.isValid){
                    let node=PoolManager.instance().getNode(this.projectilePrefab,this.canvasNode)
                    let dir=v3();
                    Vec3.subtract(dir,this.colliderList[i].node.worldPosition,this.emitterRoot.worldPosition)
                    dir.normalize();
                    // 计算角度并设置节点的旋转
                    var angle = Vec3.angle(dir, v3(1, 0, 0));
                if (dir.y < 0) {
                    angle = -angle; // 根据 y 轴方向调整角度
                }
                    var degree = angle / Math.PI * 180;
                    this.node.parent.setRotationFromEuler(0, 0, degree);
                    
                    let rigid = node.getComponent(RigidBody2D);
                    let velocity: Vec2 = v2();
                    velocity.x = dir.x;
                    velocity.y = dir.y;
                    velocity.multiplyScalar(this.startLinearSpeed);
                    rigid.linearVelocity = velocity;
                    node.worldPosition=this.emitterRoot.worldPosition;

                    let projectile= node.getComponent(Projectile)
                    projectile.host=this.actor;
                if(this.actor.current_ActorProperty!=null){
                    projectile.damage=this.actor.current_ActorProperty.attack;
                }
                    
                    //7秒后回收节点
                    this.scheduleOnce(() => {
                        PoolManager.instance().putNode(node);
                    }, 7);
                break;
                }  

            }
           
        }
   }

   



