import { _decorator, CCFloat, CCInteger, Component, instantiate, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
@ccclass("MapBuildings")
export class MapBuildings {

    @property(Node)
    spawnNode: Node;

    @property(CCInteger)
    repeatCount: number = 0;
    
}
@ccclass('MapManager')
export class MapManager extends Component {
   
    @property([MapBuildings])
    MapBuildings: Array<MapBuildings> = [];
    start() {
        for(let bd of this.MapBuildings){
           for(let i=0;i<bd.repeatCount;i++){
            let newNode = instantiate(bd.spawnNode);
            newNode.parent = this.node;
            newNode.position=new Vec3((Math.random()>0.5?1:-1)*Math.random()*7000,(Math.random()>0.5?1:-1)*Math.random()*12600);
           }
        }
    }

    update(deltaTime: number) {
        
    }
}


