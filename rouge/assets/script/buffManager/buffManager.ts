import { _decorator, Color, Component, instantiate, macro, Prefab, Vec3 } from "cc";
import { DamageTextManager } from "../TextManager/DamageTextManager";
import { Actor } from "../actor/Actor";
import { EnemyControl } from "../actor/EnemyControl";
import { BossContorl } from "../actor/BossControl";
const { ccclass, property ,requireComponent,disallowMultiple} = _decorator;

@ccclass('buffManager')
export class BuffManager extends Component {
    @property(Prefab)
    damageTextPrefab:Prefab = null;
    actor:Actor = null;
    enemyController:EnemyControl = null;
    bossController:BossContorl = null;
    static canUseFreezeBuff:boolean=false;  //是否可以使用冰冻buff
    static canUseThunderBuff:boolean=false;  //是否可以使用雷蛰buff
    static canUseBurnBuff:boolean=false;  //是否可以使用灼烧buff
    start () {
        console.log("name",this.node.name)
        this.actor=this.node.parent.getComponent(Actor);
        const position=this.node.getPosition();
        if(this.node.name=="Holy_spring_buff_1001"){  //灼烧buff
            if(BuffManager.canUseBurnBuff==false){
                this.node.destroy();
                return;
            }
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
        if(this.node.name=="HolySpring_buff_1901"){
            if(BuffManager.canUseFreezeBuff==false){
                this.node.destroy();
                return;
            }
            //冰冻buff
        try {
            if(this.node.parent.name.includes("Enemy")){
                this.enemyController=this.node.parent.getComponent(EnemyControl);
                this.enemyController.frozenTime+=3
            }else if(this.node.parent.name.includes("Boss")){
                this.bossController=this.node.parent.getComponent(BossContorl);
                this.bossController.frozenTime+=0.5
            }

        } catch (error) {
            console.log("未打到可冰冻目标")
        }
           
            this.scheduleOnce(()=>{
            this.node.destroy();
            },3)
        }
        if(this.node.name=="Holyspring_buff_2000"){  //雷蛰buff
            if(BuffManager.canUseThunderBuff==false){
                this.node.destroy();
                return;
            }
           this.actor.current_ActorProperty.hurtCoefficient=1.2
            this.scheduleOnce(()=>{
                this.actor.current_ActorProperty.hurtCoefficient=1
                this.node.destroy();
            },8)
        }
   
}
}