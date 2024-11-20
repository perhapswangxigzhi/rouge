import { _decorator, Component, director, find, instantiate, Node, Prefab, v3, Vec3 } from "cc";
//import { StageNode } from "./stageNode";
import { UIGold } from "../ui/UIGold";
import { UIExBar } from "../ui/UIExBar";
import { Level } from "../level/Level";
import { ActorStage } from "../actor/ActorStage";
import { Actor } from "../actor/Actor";
import { Skill } from "../skill/Skill";
import { UItalendRemind } from "../ui/UItalendRemind";
import { NodeType } from "./StageNode";

const { ccclass, property } = _decorator;


@ccclass("PreStageNode")
export class PreStageNode extends Component {
    @property(Prefab)
    Enemy1Prefab: Prefab = null;
    @property(Prefab)
    Enemy2Prefab: Prefab = null;
    @property(Prefab)
    Enemy3Prefab: Prefab = null;
    @property(Prefab)
    Enemy4Prefab: Prefab = null;
    @property(Prefab)
    Enemy5Prefab: Prefab = null;
    @property(Prefab)
    Enemy6Prefab: Prefab = null;
    @property(Prefab)
    Enemy7Prefab: Prefab = null;
    @property(Prefab)
    Enemy8Prefab: Prefab = null;
    @property(Prefab)
    Enemy9refab: Prefab = null;
    @property(Prefab)
    Enemy10Prefab: Prefab = null;
    @property(Prefab)
    Enemy11Prefab: Prefab = null;
    @property(Prefab)
    ChallengeEnemy1Prefab: Prefab = null;
    @property(Prefab)
    ChallengeEnemy2Prefab: Prefab = null;
    @property(Prefab)
    Boss1Prefab: Prefab = null;
    @property(Prefab)
    Boss2Prefab: Prefab = null;
    @property(Prefab)
    Boss3Prefab: Prefab = null;
    @property(Prefab)
    Boss4Prefab: Prefab = null;
    @property(Prefab)
    Boss5Prefab: Prefab = null;
    @property(Prefab)
    ItemPrefab: Prefab = null;
    @property(Prefab)
    MagnetPrefab: Prefab = null;
    isPrelood:boolean=false;
    _nodeStage:any[]=[];
    canvasNode: Node;

    private prefabMap: Map<NodeType, Prefab> = new Map<NodeType, Prefab>();

    static instance:PreStageNode;
     start(): void {
          director.addPersistRootNode(this.node);   //置为常驻节点
          PreStageNode.instance=this;
          this.prefabMap.set(NodeType.Enemy1, this.Enemy1Prefab);
          this.prefabMap.set(NodeType.Enemy2, this.Enemy2Prefab);
          this.prefabMap.set(NodeType.Enemy3, this.Enemy3Prefab);
          this.prefabMap.set(NodeType.Enemy4, this.Enemy4Prefab);
          this.prefabMap.set(NodeType.Enemy5, this.Enemy5Prefab);
          this.prefabMap.set(NodeType.Enemy6, this.Enemy6Prefab);
          this.prefabMap.set(NodeType.Enemy7, this.Enemy7Prefab);
          this.prefabMap.set(NodeType.Enemy8, this.Enemy8Prefab);
          this.prefabMap.set(NodeType.Enemy9, this.Enemy9refab);
          this.prefabMap.set(NodeType.Enemy10, this.Enemy10Prefab);
          this.prefabMap.set(NodeType.Enemy11, this.Enemy11Prefab);
          this.prefabMap.set(NodeType.ChallengeEnemy1, this.ChallengeEnemy1Prefab);
          this.prefabMap.set(NodeType.ChallengeEnemy2, this.ChallengeEnemy2Prefab);
          this.prefabMap.set(NodeType.Boss1, this.Boss1Prefab);
          this.prefabMap.set(NodeType.Boss2, this.Boss2Prefab);
          this.prefabMap.set(NodeType.Boss3, this.Boss3Prefab);
          this.prefabMap.set(NodeType.Boss4, this.Boss4Prefab);
          this.prefabMap.set(NodeType.Boss5, this.Boss5Prefab);
          this.prefabMap.set(NodeType.Item, this.ItemPrefab);
          this.prefabMap.set(NodeType.Magnet, this.MagnetPrefab);
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
     // 加载玩家节点
     prePlayerNode(index: number): void {
          const playerData = this._nodeStage[index];
          const playerNode = find("LevelCanvas/Player");

          playerNode.setPosition(new Vec3(...playerData.nodePostion));
          const playerProps = ActorStage.instance.playerProperty;
          playerProps.hp = playerData.hp;
          playerProps.ex = playerData.ex;
          playerProps.level = playerData.level;
          playerProps.killCount = playerData.killCount;
     }
     // 加载敌人、物品等节点
     preNode(index: number): void {
          const stageData = this._nodeStage[index];
          const prefab = this.prefabMap.get(stageData._nodeType);
          const node = instantiate(prefab);
          if (prefab) {
               this.preEnemyNode(index, node);
          } else if (stageData._nodeType === NodeType.Item || stageData._nodeType === NodeType.Magnet) {
               this.preNormalNode(index, node);
          }
      }
       
    
     // 加载敌人节点
     preEnemyNode(index: number, node: Node): void {
          const stageData = this._nodeStage[index];
          node.parent = this.canvasNode;
          node.setPosition(new Vec3(...stageData.nodePostion));
          this.scheduleOnce(() => {
          const actor = node.getComponent(Actor);
          if (actor) {
               actor.current_ActorProperty.hp = stageData.hp;
          }
          }, 0.1);
     }
        // 加载一般节点
        preNormalNode(index: number, node: Node): void {
          const stageData = this._nodeStage[index];
          node.parent = this.canvasNode;
          node.setPosition(new Vec3(...stageData.nodePostion))
     }
}