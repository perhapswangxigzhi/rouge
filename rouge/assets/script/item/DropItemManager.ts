import { _decorator, Component, Node, Camera, Vec2, v2, Vec3, Prefab, find, Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D, CircleCollider2D, v3, macro, Sprite, Color, RigidBody } from 'cc';
import { PoolManager } from '../util/PoolManager';
import { ActorStage } from '../actor/ActorStage';
import { AudioMgr } from '../sound/soundManager';
const { ccclass, property } = _decorator;

@ccclass("ItemPrefabType")
export class ItemPrefabType {

    @property(Prefab)
    itemPrefab: Prefab | null=null;
}
@ccclass('DropItemManager')
export class DropItemManager extends Component {
    circleCollider2D: CircleCollider2D;
    rigidbody: RigidBody2D;
    playerNode: Node = null;
    @property([ItemPrefabType])
    itemPrefabType: Array<ItemPrefabType> = [];
    itemSpeed: number = 10;
    dropEx:number=1;
    canvasNode:Node=null;
    start() {
        this.circleCollider2D = this.node.getComponent(CircleCollider2D);
        this.rigidbody = this.node.getComponent(RigidBody2D);
        this.canvasNode=find('LevelCanvas')
        this.playerNode=find('LevelCanvas/Player')
        this.circleCollider2D.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);
    }
    getItem(){
        if(this.playerNode){
        let dir=v3()
        try {
            Vec3.subtract(dir,this.playerNode.worldPosition,this.node.worldPosition)
        } catch (error) {
            console.log("玩家找不到")
        }
        let distance = dir.length();
        dir.normalize()
        let velocity: Vec2 = v2();
        velocity.x = dir.x;
        velocity.y = dir.y;
        velocity.multiplyScalar(this.itemSpeed);
        this.rigidbody.linearVelocity = velocity;
        if (distance < 30) {
            this.rigidbody.linearVelocity=Vec2.ZERO
                PoolManager.instance().putNode(this.node);
                this.unscheduleAllCallbacks();
                ActorStage.instance.playerProperty.ex += this.dropEx;
                ActorStage.instance.playerProperty.killCount += 1;
                AudioMgr.inst.playOneShot('getcoin',0.5);
        }
    
        }
    }
    getAllItem(){
      
        for(let i=0;i<this.canvasNode.children.length;i++){
            if(this.canvasNode.children[i].name=="Item"){
                this.canvasNode.children[i].getComponent(DropItemManager).getItem()
            }
        }
    }
    getMagnet(){
        if(this.playerNode&&this.node.worldPosition.x!=this.playerNode.worldPosition.x){
            let dir=v3()
            try {
                Vec3.subtract(dir,this.playerNode.worldPosition,this.node.worldPosition)
            } catch (error) {
                console.log("玩家找不到")
            }
            let distance = dir.length();
            dir.normalize()
            let velocity: Vec2 = v2();
            velocity.x = dir.x;
            velocity.y = dir.y;
            velocity.multiplyScalar(this.itemSpeed);
            this.rigidbody.linearVelocity = velocity;
            if (distance < 30) {
                    this.rigidbody.linearVelocity=Vec2.ZERO
                  //  this.node.worldPosition=new Vec3(this.playerNode.worldPosition.x,this.playerNode.worldPosition.y+50,0)
                    this.node.getComponent(Sprite).color=new Color(255,255,255,0)
                    this.scheduleOnce(()=>{
                        this.rigidbody.linearVelocity=Vec2.ZERO
                        this.node.getComponent(Sprite).color=new Color(255,255,255,255)
                        PoolManager.instance().putNode(this.node);
                        this.unscheduleAllCallbacks();
                    },5)
            }
            } 
    }
    onCollisionBegin(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
           if(other.node.name=="Player"&&self.node.name=="Item"){
               this.schedule(()=>{
                   this.getItem()
               },0.1,macro.REPEAT_FOREVER,0)
           }
           if(other.node.name=="Player"&&self.node.name=="Magnet"){
            this.schedule(()=>{
                this.getMagnet()
                this.getAllItem()
            },0.1,macro.REPEAT_FOREVER,0)
        }
           
        }
    }

