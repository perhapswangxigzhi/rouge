import { _decorator, Component } from "cc";
import { Actor } from "./Actor";
import { ActorProperty } from "./ActorProperty";
import { PlayControl } from "./PlayControl";
import { PreStageNode } from "../signalr/PreStageNode";
const { ccclass, property } = _decorator;
@ccclass('ActorStage')
export class ActorStage  {

    static instance: ActorStage = new ActorStage();
     // 使用字典存储多个ActorProperty对象
     actorProperties: { [key: string]: ActorProperty } = {};
     playerProperty : ActorProperty = new ActorProperty("Player",20000,5);//玩家实际属性
     static initPlayerProperty : ActorProperty = new ActorProperty("Player",20,5);  // 玩家初始属性
     enemy1_Property : ActorProperty = new ActorProperty("Enemy1",10,1);
     enemy2_Property : ActorProperty = new ActorProperty("Enemy2",20,2);
     enemy3_Property : ActorProperty = new ActorProperty("Enemy3",30,2);
     enemy4_Property : ActorProperty = new ActorProperty("Enemy4",100,4);
     enemy5_Property : ActorProperty = new ActorProperty("Enemy5",80,4);
     enemy6_Property : ActorProperty = new ActorProperty("Enemy6",100,1);
     enemy7_Property : ActorProperty = new ActorProperty("Enemy7",100,10);
     enemy8_Property : ActorProperty = new ActorProperty("Enemy8",200,10);
     enemy9_Property : ActorProperty = new ActorProperty("Enemy9",400,5);
     enemy10_Property : ActorProperty = new ActorProperty("Enemy10",800,20);
     enemy11_Property : ActorProperty = new ActorProperty("Enemy11",1000,30);
     challengeEnemy1_Property : ActorProperty = new ActorProperty("ChallengeEnemy1",50,2);
     challengeEnemy2_Property : ActorProperty = new ActorProperty("ChallengeEnemy2",50,2);
     boss1_Property : ActorProperty = new ActorProperty("Boss1",500,10);
     boss2_Property : ActorProperty = new ActorProperty("Boss2",2000,50);
     boss3_Property : ActorProperty = new ActorProperty("Boss3",5000,100);
     boss4_Property : ActorProperty = new ActorProperty("Boss4",10000,200);
     boss5_Property : ActorProperty = new ActorProperty("Boss5",50000,500);
     building_1_Property:ActorProperty=new ActorProperty("Building_1",30,0)
     building_2_Property:ActorProperty=new ActorProperty("Building_2",20,0)
     building_3_Property:ActorProperty=new ActorProperty("Building_3",10,0)
     current_ActorProperty:ActorProperty=null

     constructor() {
        this.initActorProperties(); // 在构造函数中调用初始化方法
    }

      initActorProperties() {
        this.addActorProperty(this.playerProperty);
        this.addActorProperty(this.enemy1_Property);
        this.addActorProperty(this.enemy2_Property);
        this.addActorProperty(this.enemy3_Property);
        this.addActorProperty(this.enemy4_Property);
        this.addActorProperty(this.enemy5_Property);
        this.addActorProperty(this.enemy6_Property);
        this.addActorProperty(this.enemy7_Property);
        this.addActorProperty(this.enemy8_Property);
        this.addActorProperty(this.enemy9_Property);
        this.addActorProperty(this.enemy10_Property);
        this.addActorProperty(this.enemy11_Property);
        this.addActorProperty(this.challengeEnemy1_Property);
        this.addActorProperty(this.challengeEnemy2_Property);
        this.addActorProperty(this.boss1_Property);
        this.addActorProperty(this.boss2_Property);
        this.addActorProperty(this.boss3_Property);
        this.addActorProperty(this.boss4_Property);
        this.addActorProperty(this.boss5_Property)
        this.addActorProperty(this.building_1_Property)
        this.addActorProperty(this.building_2_Property)
        this.addActorProperty(this.building_3_Property)
        
    }
     // 根据名字获取ActorProperty对象
     getActorProperty(name: string): ActorProperty | undefined {
        if(name=="Player"){
            this.reflashPlayerProperty();
            return this.actorProperties[name];
        }
        this.current_ActorProperty=this.creatActorProperty(this.actorProperties[name].name,this.actorProperties[name].maxHp,this.actorProperties[name].attack)
        return this.current_ActorProperty;
        
    }
    addActorProperty(actorProperty: ActorProperty) {
        this.actorProperties[actorProperty.name] = actorProperty;
    }
    creatActorProperty(name: string, hp: number, attack: number):ActorProperty|undefined {
        const actorProperty=new ActorProperty(name,hp,attack)
        return actorProperty;
    }
    setEnemyProperty(key: string, hpCoeff: number, attackCoeff: number) {
        this.actorProperties[key].maxHp = Math.round(this.actorProperties[key].maxHp * hpCoeff);
        this.actorProperties[key].attack = Math.round(this.actorProperties[key].attack * attackCoeff);
    }
    reflashPlayerProperty(){
        if(PreStageNode.instance==null||PreStageNode.instance.isPrelood==false){
        this.actorProperties["Player"].hp=this.actorProperties["Player"].maxHp
        this.actorProperties["Player"].killCount=0
        this.actorProperties["Player"].ex=0
        this.actorProperties["Player"].level=0
        }else{
            return;
        }
    }
}
