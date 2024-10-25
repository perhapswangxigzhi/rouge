import { _decorator, Component, director, find, instantiate, Node, Prefab, v3, Vec3 } from "cc";
//import { StageNode } from "./stageNode";
import { UIGold } from "../ui/UIGold";
import { UIExBar } from "../ui/UIExBar";
import { Level } from "../level/Level";
import { ActorStage } from "../actor/ActorStage";
import { Actor } from "../actor/Actor";
import { Skill } from "../skill/Skill";
import { UItalendRemind } from "../ui/UItalendRemind";

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


@ccclass("PreStageNode")
export class PreStageNode extends Component {
    @property(Prefab)
    Enemy1Prefab: Prefab = null;
    @property(Prefab)
    Enemy2Prefab: Prefab = null;
    @property(Prefab)
    Enemy3Prefab: Prefab = null;
    @property(Prefab)
    ChallengeEnemy1Prefab: Prefab = null;
    @property(Prefab)
    ChallengeEnemy2Prefab: Prefab = null;
    @property(Prefab)
    Boos1Prefab: Prefab = null;
    @property(Prefab)
    ItemPrefab: Prefab = null;
    isPrelood:boolean=false;
    _nodeStage:any[]=[];
    canvasNode: Node;
    static instance:PreStageNode;
     start(): void {
        director.addPersistRootNode(this.node);   //置为常驻节点
        PreStageNode.instance=this;
    }
    //加载保存场景
    loadStageScence(){
        this.canvasNode=find('LevelCanvas');
        this.preOtherNode(0);
        this.prePlayerNode(1);
        for(let i=2;i<this._nodeStage.length;i++){
            this.preNode(i);
        }
    }
    //加载其他节点
    preOtherNode(index:number){
        UIGold.instance.coinCount=this._nodeStage[index].coinCount;
        UIExBar.instance.ExpDrop=this._nodeStage[index].ExpDrop;
        Level.instance.totalTimeCount=this._nodeStage[index].timeCount;
        Level.instance.totalCount=this._nodeStage[index].currentEnemyCount;
        UItalendRemind.instance.reflashCount=this._nodeStage[index].reflashCount;
        if(this._nodeStage[index].talentCount!=null){
            Skill.instance.skillIndexStage=this._nodeStage[index].talentCount ;
            try {
                this.scheduleOnce(()=>{
                Skill.instance.initAllSkill();
                    },1)
                } catch (error) {
                  console.error(error);
                }
        }
       
        
    }
    //加载玩家界定
    prePlayerNode(index:number){
        find("LevelCanvas/Player").setPosition(new Vec3(this._nodeStage[index].nodePostion[0], this._nodeStage[index].nodePostion[1], this._nodeStage[index].nodePostion[2]));
        ActorStage.instance.playerProperty.hp=this._nodeStage[index].hp;
        ActorStage.instance.playerProperty.ex=this._nodeStage[index].ex;
        ActorStage.instance.playerProperty.level=this._nodeStage[index].level;
        ActorStage.instance.playerProperty.killCount=this._nodeStage[index].killCount;
    }
    //加载敌人，物品等节点
    preNode(index:number){
       if(this._nodeStage[index]._nodeType==NodeType.Enemy1){
            let node=instantiate(this.Enemy1Prefab) 
            node.parent=this.canvasNode;
            this.initPrefab(index,node);
       } 
       if(this._nodeStage[index]._nodeType==NodeType.Enemy2){
            let node=instantiate(this.Enemy2Prefab) 
            this.initPrefab(index,node);
       }
       if(this._nodeStage[index]._nodeType==NodeType.Enemy3){           
            let node=instantiate(this.Enemy3Prefab)             
            this.initPrefab(index,node);    
       }
       if(this._nodeStage[index]._nodeType==NodeType.ChallengeEnemy1){
            let node=instantiate(this.ChallengeEnemy1Prefab) 
            this.initPrefab(index,node);
       }
       if(this._nodeStage[index]._nodeType==NodeType.ChallengeEnemy2){
            let node=instantiate(this.ChallengeEnemy2Prefab) 
            this.initPrefab(index,node);
       }
       if(this._nodeStage[index]._nodeType==NodeType.Boss1){
            let node=instantiate(this.Boos1Prefab) 
            this.initPrefab(index,node);
       }
       if(this._nodeStage[index]._nodeType==NodeType.Item){
            let node=instantiate(this.ItemPrefab) 
            node.setPosition(new Vec3(this._nodeStage[index].nodePostion[0], this._nodeStage[index].nodePostion[1], this._nodeStage[index].nodePostion[2]));
       }
       
    }

    initPrefab(index:number,node:Node){
        node.parent=this.canvasNode;
        node.setPosition(new Vec3(this._nodeStage[index].nodePostion[0], this._nodeStage[index].nodePostion[1], this._nodeStage[index].nodePostion[2]));
        this.scheduleOnce(()=>{
            node.getComponent(Actor).current_ActorProperty.hp=this._nodeStage[index].hp;
        },0.1);
    }
}