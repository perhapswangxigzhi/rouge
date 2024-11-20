import { _decorator, Color, Component, Event, Label, Node, Sprite, tween } from 'cc';
import { ActorStage } from '../actor/ActorStage';
import { UIGold } from './UIGold';
import { Level } from '../level/Level';
const { ccclass, property } = _decorator;

@ccclass('UIShop')
export class UIShop extends Component {
    buyNormalStr = ['提高30点生命值','提高5点攻击力','提高5点防御力','提高1%暴击率','提高2%爆伤','提高1%金属性伤害','提高1%木属性伤害','提高1%水属性伤害',
        '提高1%雷属性伤害','提高1%火属性伤害'];
    buyRareStr = ['提高60点生命值','提高10点攻击力','提高10点防御力','提高2%暴击率','提高4%爆伤','提高2%金属性伤害','提高2%木属性伤害','提高2%水属性伤害',
        '提高2%雷属性伤害','提高2%火属性伤害'];
    buyEpicStr = ['提高300点生命值','提高25点攻击力','提高25点防御力','提高5%暴击率','提高10%爆伤','提高5%金属性伤害','提高5%木属性伤害','提高5%水属性伤害',
        '提高5%雷属性伤害','提高5%火属性伤害'];
    dialog:Node|null=null  ;  
    start() {
        this.dialog=this.node.getChildByName('DiaLog');
    }
    protected onEnable(): void {
        this.initProperty();
        Level.pause();
    }
    protected onDisable(): void {
        Level.resume();
    }
    initProperty(){
        const property=this.node.getChildByName('Property');
        property.children[0].getComponent(Label).string=`生命:${ActorStage.instance.playerProperty.maxHp.toString()}`;
        property.children[1].getComponent(Label).string=`攻击力:${ActorStage.instance.playerProperty.attack.toString()}`;
        property.children[2].getComponent(Label).string=`防御力:${ActorStage.instance.playerProperty.defence.toString()}`;
        property.children[3].getComponent(Label).string=`暴击率:${Math.round(ActorStage.instance.playerProperty.crit*100).toString()}%`;
        property.children[4].getComponent(Label).string=`爆伤:${Math.round(ActorStage.instance.playerProperty.physicalCritDamage*100).toString()}%`;
        property.children[5].getComponent(Label).string=`移速:${ActorStage.instance.playerProperty.speed.toString()}`;
        property.children[6].getComponent(Label).string=`攻速:${ActorStage.instance.playerProperty.attackSpeed.toString()}`;
        property.children[7].getComponent(Label).string=`金属性增伤:${Math.round(ActorStage.instance.playerProperty.goldAttack*100).toString()}%`;
        property.children[8].getComponent(Label).string=`木属性增伤:${Math.round(ActorStage.instance.playerProperty.woodAttack*100).toString()}%`;
        property.children[9].getComponent(Label).string=`水属性增伤:${Math.round(ActorStage.instance.playerProperty.waterAttack*100).toString()}%`;
        property.children[10].getComponent(Label).string=`火属性增伤:${Math.round(ActorStage.instance.playerProperty.fireAttack*100).toString()}%`;
        property.children[11].getComponent(Label).string=`雷属性增伤:${Math.round(ActorStage.instance.playerProperty.thunderAttack*100).toString()}%`;
        property.children[12].getComponent(Label).string=`生命恢复:${Math.round(ActorStage.instance.playerProperty.LifeRecovery*100).toString()}%`;
        property.children[13].getComponent(Label).string=`技能冷却:${Math.round(ActorStage.instance.playerProperty.cd*100).toString()}`; 
    }
    buyPerperty(event:Event){
        if(UIGold.instance.Count<10){
            this.dialog.active=true;
            const colorTween = tween(this.dialog.getComponent(Sprite))
            .to(0.75, { color: new Color(255, 255, 255, 255) }) // 恢复颜色
            .delay(1)
            .to(0.75, { color: new Color(255, 255, 255, 0) }); // 渐隐
            colorTween.start();
            return;
        }
        const node = event.target as Node;
        const buyStr=node.children[0].getComponent(Label).string;
        const numberMatches = buyStr.match(/\d+(\.\d+)?/);
        let extractedNumber: number = 0;
        if (numberMatches) {
            extractedNumber = parseFloat(numberMatches[0]);
        }
        
        if (buyStr.includes('生命值')) {
            ActorStage.instance.playerProperty.maxHp += extractedNumber;
            ActorStage.instance.playerProperty.hp += extractedNumber;
        }else if (buyStr.includes('攻击力')) {
            ActorStage.instance.playerProperty.attack += extractedNumber;
        }else if (buyStr.includes('防御力')) {
            ActorStage.instance.playerProperty.defence += extractedNumber;
        }else if (buyStr.includes('暴击率')) {
            ActorStage.instance.playerProperty.crit +=  parseFloat((extractedNumber / 100).toFixed(2));
        }else if (buyStr.includes('爆伤')) {
            ActorStage.instance.playerProperty.physicalCritDamage +=  parseFloat((extractedNumber / 100).toFixed(2));
        }else if (buyStr.includes('金属性伤害')) {
            ActorStage.instance.playerProperty.goldAttack +=  parseFloat((extractedNumber / 100).toFixed(2));
        }else if (buyStr.includes('木属性伤害')) {
            ActorStage.instance.playerProperty.woodAttack +=  parseFloat((extractedNumber / 100).toFixed(2));
        }else if (buyStr.includes('水属性伤害')) {
            ActorStage.instance.playerProperty.waterAttack +=  parseFloat((extractedNumber / 100).toFixed(2));
        }else if (buyStr.includes('火属性伤害')) {
            ActorStage.instance.playerProperty.fireAttack += parseFloat((extractedNumber / 100).toFixed(2));
        }else if (buyStr.includes('雷属性伤害')) {
            ActorStage.instance.playerProperty.thunderAttack +=  parseFloat((extractedNumber / 100).toFixed(2));
        }
        this.initProperty();
        this.reflashProperty();
        const buygold=node.children[1].children[0].getChildByName("Label").getComponent(Label).string;
        UIGold.instance.buyCount+=parseInt(buygold)+2;
    }
    reflashProperty(){
        if(UIGold.instance.Count<2){
            this.dialog.active=true;
            const colorTween = tween(this.dialog.getComponent(Sprite))
            .to(0.75, { color: new Color(255, 255, 255, 255) }) // 恢复颜色
            .delay(1)
            .to(0.75, { color: new Color(255, 255, 255, 0) }); // 渐隐
            colorTween.start();
            return;
        }
        const shop=this.node.getChildByName('Shop');
            for(let i=0;i<shop.children.length;i++){
                const random=Math.floor(Math.random()*10);
                const randomBuyStr=Math.random();
                if(randomBuyStr<0.1){
                shop.children[i].children[0].getComponent(Label).string=this.buyEpicStr[random];
                shop.children[i].children[0].getComponent(Label).color=new Color(255,174,0);
                } else if(randomBuyStr<0.3&&randomBuyStr>=0.1){
                shop.children[i].children[0].getComponent(Label).string=this.buyRareStr[random];
                shop.children[i].children[0].getComponent(Label).color=new Color(0,163,255); 
                }else{
                shop.children[i].children[0].getComponent(Label).string=this.buyNormalStr[random];
                shop.children[i].children[0].getComponent(Label).color=new Color(255,255,235); 
                }   
             }
        UIGold.instance.buyCount+=-2;     
    }
}


