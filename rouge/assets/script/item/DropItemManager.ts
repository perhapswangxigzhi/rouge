import { _decorator, Component, Node, Camera, Vec2, v2, Vec3, Prefab, find, Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D, CircleCollider2D } from 'cc';
import { PoolManager } from '../PoolManager';
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
    @property([ItemPrefabType])
    itemPrefabType: Array<ItemPrefabType> = [];

    @property(Node)
    itemRoot:Node=null;
    canvasNode:Node=null;
    start() {
        this.circleCollider2D = this.node.getComponent(CircleCollider2D);
        this.rigidbody = this.node.getComponent(RigidBody2D);
        this.canvasNode=find('LevelCanvas')
    }
    dropItem(actorWorldPosition: Vec3) {
        let node=PoolManager.instance().getNode(this.itemPrefabType[0].itemPrefab,this.canvasNode)
        node.worldPosition=actorWorldPosition;
        this.circleCollider2D.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this);
  
    }
    onCollisionBegin(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
            console.log("已经碰撞")
        }
    }

