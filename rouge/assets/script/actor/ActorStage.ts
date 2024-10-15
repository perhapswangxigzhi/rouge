import { _decorator, Component } from "cc";
import { Actor } from "./Actor";
import { ActorProperty } from "./ActorProperty";
const { ccclass, property } = _decorator;
@ccclass('ActorStage')
export class ActorStage  {

    static instance: ActorStage = new ActorStage();
     // 使用字典存储多个ActorProperty对象
     actorProperties: { [key: string]: ActorProperty } = {};
     playerProperty : ActorProperty = new ActorProperty("Player",100,10);
     enemy1_Property : ActorProperty = new ActorProperty("Enemy1",50,5);
     enemy2_Property : ActorProperty = new ActorProperty("Enemy2",100,5);
     enemy3_Property : ActorProperty = new ActorProperty("Enemy3",10,10);
     challengeEnemy1_Property : ActorProperty = new ActorProperty("challengeEnemy1",200,10);
     challengeEnemy2_Property : ActorProperty = new ActorProperty("challengeEnemy2",400,10);
     boss1_Property : ActorProperty = new ActorProperty("Boss1",500,10);
     building_1_Property:ActorProperty=new ActorProperty("building_1",30,0)
     building_2_Property:ActorProperty=new ActorProperty("building_2",20,0)
     building_3_Property:ActorProperty=new ActorProperty("building_3",10,0)
     current_ActorProperty:ActorProperty=null
     constructor() {
        this.initActorProperties(); // 在构造函数中调用初始化方法
    }

      initActorProperties() {
        this.addActorProperty(this.playerProperty);
        this.addActorProperty(this.enemy1_Property);
        this.addActorProperty(this.enemy2_Property);
        this.addActorProperty(this.enemy3_Property);
        this.addActorProperty(this.challengeEnemy1_Property);
        this.addActorProperty(this.challengeEnemy2_Property);
        this.addActorProperty(this.boss1_Property);
        this.addActorProperty(this.building_1_Property)
        this.addActorProperty(this.building_2_Property)
        this.addActorProperty(this.building_3_Property)
        
    }
     // 根据名字获取ActorProperty对象
     getActorProperty(name: string): ActorProperty | undefined {
        if(name=="Player"){
            return this.actorProperties[name];
        }
        this.current_ActorProperty=this.setActorProperty(this.actorProperties[name].name,this.actorProperties[name].maxHp,this.actorProperties[name].attack)
        return this.current_ActorProperty;
    }
    addActorProperty(actorProperty: ActorProperty) {
        this.actorProperties[actorProperty.name] = actorProperty;
    }
    setActorProperty(name: string, hp: number, attack: number):ActorProperty|undefined {
        const actorProperty=new ActorProperty(name,hp,attack)
        return actorProperty;
    }

    }
