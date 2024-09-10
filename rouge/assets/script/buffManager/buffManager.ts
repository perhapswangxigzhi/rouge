import { _decorator, Color, Component, instantiate, macro, Prefab, Vec3 } from "cc";
import { DamageTextManager } from "../TextManager/DamageTextManager";
import { Actor } from "../actor/Actor";
import { EnemyControl } from "../actor/EnemyControl";
const { ccclass, property ,requireComponent,disallowMultiple} = _decorator;

@ccclass('buffManager')
export class BuffManager extends Component {
    @property(Prefab)
    damageTextPrefab:Prefab = null;
    actor:Actor = null;
    enemyController:EnemyControl = null;
   // damageText:DamageTextManager = null;
    start () {
        console.log("name",this.node.name)
        this.actor=this.node.parent.getComponent(Actor);
        const position=this.node.getPosition();
        if(this.node.name=="Holy_spring_buff_1001"){  //灼烧buff
        this.schedule(()=>{
            const damageTextNode=instantiate(this.damageTextPrefab);
            damageTextNode.setParent(this.node);
            damageTextNode.getComponent(DamageTextManager).showDamage(new Vec3(position.x,position.y*1.5,position.z),1,Color.RED)
            this.actor.current_ActorProperty.hp-=1; 
        }, 1, macro.REPEAT_FOREVER, 0);
        this.scheduleOnce(()=>{
            this.node.destroy();
        }, 6);
        }
        if(this.node.name=="HolySpring_buff_1901"){  //冰冻buff
            this.enemyController=this.node.parent.getComponent(EnemyControl);
            this.enemyController.frozenTime+=3
            this.scheduleOnce(()=>{
            this.node.destroy();
            },3)
        }
        if(this.node.name=="Holyspring_buff_2000"){  //易伤buff
           this.actor.current_ActorProperty.hurtCoefficient=1.2
            this.scheduleOnce(()=>{
            this.actor.current_ActorProperty.hurtCoefficient=1
            this.node.destroy();
            },8)
        }
   
}
}