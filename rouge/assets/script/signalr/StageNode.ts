import { _decorator, Component, macro, Node } from 'cc';
import { Actor } from '../actor/Actor';
import { UIGold } from '../ui/UIGold';
import { UIExBar } from '../ui/UIExBar';
import { Level } from '../level/Level';
import { Skill } from '../skill/Skill';
import { AssentManager } from '../bag/AssentManager';
import { PreStageNode } from './PreStageNode';
import { UItalendRemind } from '../ui/UItalendRemind';
import { SignalrClient } from './SignalrClient';
const { ccclass, property } = _decorator;
export enum NodeType {
    Player,
    Enemy1,
    Enemy2,
    Enemy3,
    Enemy4,
    Enemy5,
    Enemy6,
    Enemy7,
    Enemy8,
    Enemy9,
    Enemy10,
    Enemy11,
    ChallengeEnemy1,
    ChallengeEnemy2,
    Boss1,
    Boss2,
    Boss3,
    Boss4,
    Boss5,
    Item,
    Magnet,
    Other
}


@ccclass('StageNode')

export class StageNode extends Component {
    nodeStage: any[] = [];
    index:number=0;   //index0属于其他类系节点，index1属于玩家节点，index属于敌人节点，普通节点等
    isPrelood:boolean=false;
    isPause:boolean=false;
    static _instance: StageNode;
  
    start(){
        StageNode._instance=this;
        this.schedule(() =>{
            if(this.isPause==true){
                return;
            }
          this.reflash()
        }, 1, macro.REPEAT_FOREVER, 0);
    }
     onDisable(): void {
        PreStageNode.instance._nodeStage=this.nodeStage
    }
    reflash() {
        this.reflashOtherNode(this.index);
        this.index++
        this.reaflashNode(this.node.getChildByName("Player"),this.index)
        for(let i=0;i<this.node.children.length;i++){
            //每次找到目标节点。索引加一，刷新节点信息
            if(this.node.children[i].name.startsWith("Enemy")||this.node.children[i].name.startsWith("ChallengeEnemy")||
                this.node.children[i].name.startsWith("Boss")||this.node.children[i].name==("Item")||
                this.node.children[i].name==("Magnet")
            ){  
                this.index++
                this.reaflashNode(this.node.children[i],this.index)
            } 
        }
        this.nodeStage.splice(this.index+1)
        this.index=0;  
        if(SignalrClient.opend==true){
            var obj=this.nodeStage
            SignalrClient.instance.sendObjs(obj,true)
        }
       
    }
    //判断节点类型
    judgmentNodeType(node: Node): NodeType {
        switch (node.name) {
            case "Enemy1":
                return NodeType.Enemy1;
            case "Enemy2":
                return NodeType.Enemy2;
            case "Enemy3":
                return NodeType.Enemy3;
            case "Enemy4":
                return NodeType.Enemy4;
            case "Enemy5":
                return NodeType.Enemy5;
            case "Enemy6":
                return NodeType.Enemy6;
            case "Enemy7":
                return NodeType.Enemy7;
            case "Enemy8":
                return NodeType.Enemy8;
            case "Enemy9":
                return NodeType.Enemy9;
            case "Enemy10":
                return NodeType.Enemy10;
            case "Enemy11":
                return NodeType.Enemy11;
            case "ChallengeEnemy1":
                return NodeType.ChallengeEnemy1;
            case "ChallengeEnemy2":
                return NodeType.ChallengeEnemy2;
            case "Boss1":
                return NodeType.Boss1;
            case "Boss2":
                return NodeType.Boss2;
            case "Boss3":
                return NodeType.Boss3;  
            case "Boss4":
                return NodeType.Boss4;
            case "Boss5":   
                return NodeType.Boss5;
            case "Item":
                return NodeType.Item;
            case "Magnet":
                return NodeType.Magnet;
            case "Player":
                return NodeType.Player;
    }
}
    //初始化各种节点类
    setNormalNode(node: Node,index:number) {
        let myNode=new nodeNormal();
        myNode._nodeType=this.judgmentNodeType(node);
        myNode.nodeName=node.name;
        myNode.nodePostion=[node.position.x, node.position.y, node.position.z];
        this.nodeStage.splice(index,1, myNode);     
        
    }
    setEnemyNode(node: Node,index:number) {
        let myNode=new nodeEnemy();
        myNode._nodeType=this.judgmentNodeType(node);
        myNode.nodeName=node.name;
        myNode.nodePostion=[node.position.x, node.position.y, node.position.z];
        try {
            if(node.getComponent(Actor)?.dead==false){
            myNode.hp=node.getComponent(Actor).current_ActorProperty.hp
            }else{
                this.nodeStage.splice(index,1)
                index--;
                return;    
            }
        } catch (error) {
            this.nodeStage.splice(index,1)
            index--;
            return;   
        }
        this.nodeStage.splice(index,1, myNode);     
    }
    setPlayerNode(node: Node) {
        let myNode=new nodePlayer();
        myNode._nodeType=this.judgmentNodeType(node);
        myNode.nodeName=node.name;
        myNode.nodePostion=[node.position.x, node.position.y, node.position.z];
        myNode.hp=node.getComponent(Actor)?.current_ActorProperty.hp
        myNode.ex=node.getComponent(Actor)?.current_ActorProperty.ex
        myNode.level=node.getComponent(Actor)?.current_ActorProperty.level
        myNode.killCount=node.getComponent(Actor)?.current_ActorProperty.killCount
        this.nodeStage.push(myNode);
    }
    setOtherNode() {
        let myNode=new nodeOther();
        myNode._nodeType=NodeType.Other;
        myNode.coinCount=UIGold.instance.coinCount;
        myNode.ExpDrop=UIExBar.instance.ExpDrop;
        myNode.timeCount=Level.instance.totalTimeCount;
        myNode.currentEnemyCount=Level.instance.currentEnemyCount;
        myNode.reflashCount=UItalendRemind.instance.reflashCount
        myNode.talentCount=Skill.instance?.skillIndexStage
        this.nodeStage.push(myNode);
    }
    //刷新节点信息
    reaflashNode(node:Node,index:number){
        if(node.name.startsWith("Enemy")||node.name.startsWith("ChallengeEnemy")||
        node.name.startsWith("Boss"))
        {   
            if(this.nodeStage[index]==null){
                this.setEnemyNode(node,index);
            }else if(this.nodeStage[index].name!=node.name){
                this.setEnemyNode(node,index);
            }else {
                this.nodeStage[index].nodePostion=[node.position.x, node.position.y, node.position.z];
                this.nodeStage[index].bossHp=node.getComponent(Actor)?.current_ActorProperty.hp
            }
        }
        if(node.name==("Item")||node.name==("Magnet"))
        {
            if(this.nodeStage[index]==null){
                this.setNormalNode(node,index);
            }else if(this.nodeStage[index].name!=node.name){
                this.setNormalNode(node,index);
            }else {
                this.nodeStage[index].nodePostion=[node.position.x, node.position.y, node.position.z];
            }
        }
        if(node.name==("Player")){
            if(this.nodeStage[index]==null){
                this.setPlayerNode(node);
            }else {
                this.nodeStage[index].nodePostion=[node.position.x, node.position.y, node.position.z];
                this.nodeStage[index].hp=node.getComponent(Actor)?.current_ActorProperty.hp
                this.nodeStage[index].ex=node.getComponent(Actor)?.current_ActorProperty.ex
                this.nodeStage[index].level=node.getComponent(Actor)?.current_ActorProperty.level
                this.nodeStage[index].killCount=node.getComponent(Actor)?.current_ActorProperty.killCount
            }
        }
    }
    //刷新其他类节点信息
    reflashOtherNode(index:number){
            if(this.nodeStage[index]!=null){
                this.nodeStage[index].coinCount=UIGold.instance.coinCount;
                this.nodeStage[index].ExpDrop=UIExBar.instance.ExpDrop;
                this.nodeStage[index].timeCount=Level.instance.totalTimeCount;
                this.nodeStage[index].currentEnemyCount=Level.instance.currentEnemyCount;
                this.nodeStage[index].reflashCount=UItalendRemind.instance.reflashCount
                this.nodeStage[index].talentCount=Skill.instance?.skillIndexStage
            }else{
                this.setOtherNode()
            }
        }
    }
    class isPrelood{
        isPre:boolean;
    }
        //一般节点类
    class nodeNormal{
        _nodeType:NodeType;
        nodeName:string;
        nodePostion:number[];
    }
        //敌人节点类
    class nodeEnemy{
            _nodeType:NodeType;
            nodeName:string;
            nodePostion:number[];
            hp:number;
        }
        //玩家节点类
    class nodePlayer{
            _nodeType:NodeType;
            nodeName:string;
            nodePostion:number[];
            hp:number;
            ex:number;
            level:number;
            killCount:number;
        }
    //其他属性类
    class nodeOther{
        _nodeType:NodeType;
        coinCount:number;
        ExpDrop:number;
        timeCount:number;
        currentEnemyCount:number;
        reflashCount:number
        talentCount:number[];
    }                   