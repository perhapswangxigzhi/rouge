import { _decorator, CCFloat, Collider2D, Component, Contact2DType,  find, game, instantiate, IPhysics2DContact, macro, Node, PhysicsSystem2D, Prefab, rect, RigidBody2D, v2, v3, Vec2, Vec3 } from 'cc';
import { Actor } from '../Actor';
import { Projectile } from './Projectile';
import { PoolManager } from '../../util/PoolManager';
import { colliderTag } from './ColliderTag';
import { AudioMgr } from '../../sound/soundManager';
import { StageNode } from '../../signalr/StageNode';
import { QuadTree } from '../../util/QuadTree';

const { ccclass, property } = _decorator;
enum NodeType {
    Player,
    Enemy1,
    Enemy2,
    Enemy3,
    ChallengeEnemy1,
    ChallengeEnemy2,
    Boss1,
    Item,
    Other
}

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
    colliderList: Collider2D[];
    enmeyList: Node[]=[];
    enemyNode:Node;
    cooldown:number=5 
    castTime:number=0
    tree=null
    static isPause:boolean=false
    start() {
        const bounds={x:0,y:0,width:screen.width,height:screen.height}
        this.tree=new QuadTree(bounds,true,4,4);
        this.canvasNode=find('LevelCanvas')
        if(this.node.name=="Emitter_Player"){
         const playerNode=find('LevelCanvas/Player')
         this.actor=playerNode.getComponent(Actor)
        }else if(this.node.name=="Emitter_Enemy1"){
         const ememyNode=find('LevelCanvas/Enemy1')
         this.actor=ememyNode.getComponent(Actor)
        }else if(this.node.name=="PointEmitter"){
            const playerNode=find('LevelCanvas/Player')
            this.actor=playerNode.getComponent(Actor)
        }else{
            this.actor=this.node.parent.getComponent(Actor)
        }
        
        this.schedule(() =>{
            if(PointEmitter.isPause){
                return;
            }
                this.getEnemyList()
                this.emit();
                AudioMgr.inst.playOneShot('Shoot',0.5);
        }, 1/this.actor.current_ActorProperty.attackSpeed, macro.REPEAT_FOREVER, 0);
    } 
    
    get isCoolingdown(){
        return game.totalTime-this.castTime>=this.cooldown*1000;
    }
    getEnemyList(): void {
        // 清空敌人列表
        this.enmeyList = [];
    
        // 获取 LevelCanvas 下的所有敌人节点
        const levelCanvas = find('LevelCanvas');
        if (!levelCanvas) return; // 如果找不到 LevelCanvas 直接返回
    
        // 获取 LevelCanvas 下的所有子节点
        const children = levelCanvas.children;
        for (const child of children) {
            // 筛选敌人类型的节点
            if (this.isEnemy(child)) {
                const actor = child.getComponent(Actor);
                // 检查敌人是否存活
                if (actor && !actor.dead) {
                    this.enmeyList.push(child);
                }
            }
        }
    
        // 检查是否找到敌人
        if (this.enmeyList.length === 0) {
            console.log("未找到存活的敌人");
            return;
        }
    }
    
    isEnemy(child: Node): boolean {
        // 通过名称前缀或者其他标签/组件来判断是否是敌人
        return child.name.startsWith("Enemy") || child.name.startsWith("ChallengeEnemy") || child.name.startsWith("Boss");
    }
    
    findClosestEnemy(): Node | null {
        if (this.enmeyList.length === 0) return null; // 无敌人直接返回
    
        let closestEnemy: Node | null = null;
        let minDistance = Infinity;
        
        // 获取主角的位置
        const playerNode = find('LevelCanvas/Player');
        if (!playerNode) {
            console.warn("未找到主角节点");
            return null;
        }
        const playerPosition = playerNode.getPosition();
    
        // 遍历敌人列表找到最近的敌人
        for (const enemy of this.enmeyList) {
            const actor = enemy.getComponent(Actor);
            if (!actor || actor.dead) continue;
    
            const enemyPosition = enemy.getPosition();
            const distance = playerPosition.subtract(enemyPosition).length();
    
            // 更新最小距离和最近敌人
            if (distance < minDistance) {
                minDistance = distance;
                closestEnemy = enemy;
            }
        }
    
        // 返回最近的敌人
        return closestEnemy;
    }
    
    emit(): void {
        this.castTime = game.totalTime;
        try {
            // 每次攻击时，实时获取最近的敌人
            const closestEnemy = this.findClosestEnemy();
            if (closestEnemy) {
                this.enemyNode = closestEnemy;
                this.getProjectile(this.emitterRoot.worldPosition);  // 发射攻击
            } else {
                console.log("没有找到有效的敌人进行攻击");
            }
        } catch (error) {
            // 捕获并处理错误
            console.log(error);
        }
    }
    
    
    getProjectile(worldPosition:Vec3){
        let node=PoolManager.instance().getNode(this.projectilePrefab,this.canvasNode)
        let dir=v3();
        Vec3.subtract(dir,this.enemyNode.worldPosition,worldPosition)
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
        node.worldPosition=worldPosition;

        let projectile= node.getComponent(Projectile)
        projectile.host=this.actor;
    if(this.actor.current_ActorProperty!=null){
        projectile.damage=this.actor.current_ActorProperty.attack;
    }
    }
}
   

   



