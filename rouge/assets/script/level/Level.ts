import { CCFloat, CCInteger, Color, Component, Label, Node, Prefab, Tween, Vec3, _decorator, assert, director, dragonBones, find, instantiate, macro, screen, sp, sys, tween, v3 } from "cc";
import { GameEvent } from "../event/GameEvent";
import { PlayControl } from "../actor/PlayControl";
import { CoinDrop } from "../ani/CoinDrop";
import { AudioMgr } from "../sound/soundManager";
import { DrangonAni } from "../ani/DrangonAni";
import { PreStageNode } from "../signalr/PreStageNode";
import { AssentManager } from "../bag/AssentManager";
import { ActorStage } from "../actor/ActorStage";
import { Actor } from "../actor/Actor";
import { EnemyControl } from "../actor/enemy/EnemyControl";
import { PointEmitter } from "../actor/projectile/PointEmitter";
import { SkillBar } from "../skill/SkillBar";
import { SkillEmitter } from "../skill/SkillEmitter";
import { UIFont } from "../ui/UIFont";
import { SignalrClient } from "../signalr/SignalrClient";
import { StageNode } from "../signalr/StageNode";
const { ccclass, property, requireComponent } = _decorator;

/**
 * 出生点
 */
@ccclass("SpawnPoint")
export class SpawnPoint {

    @property(Node)
    spawnNode: Node;

    @property(CCFloat)
    interval: number = 5.0;

    @property(CCInteger)
    repeatCount: number = 0;
    
}
enum LevelState {
    "第一关",
    "第二关",
    "第三关",
    "第四关",
    "第五关"
}
@ccclass("Level")
export class Level extends Component {   

    @property([SpawnPoint])
    spawnPoints: Array<SpawnPoint> = [];

    @property(Prefab)
    enemyPrefab1: Prefab | null = null;
    @property(Prefab)
    enemyPrefab2: Prefab | null = null;
    @property(Prefab)
    enemyPrefab3: Prefab | null = null;
    @property(Prefab)
    enemyPrefab4: Prefab | null = null;
    @property(Prefab)
    enemyPrefab5: Prefab | null = null;
    @property(Prefab)
    enemyPrefab6: Prefab | null = null;
    @property(Prefab)
    enemyPrefab7: Prefab | null = null;
    @property(Prefab)
    enemyPrefab8: Prefab | null = null;
    @property(Prefab)
    enemyPrefab9: Prefab | null = null;
    @property(Prefab)
    enemyPrefab10: Prefab | null = null;
    @property(Prefab)
    enemyPrefab11: Prefab | null = null;
    @property(Prefab)
    challengeEnemyPrefab1: Prefab | null = null;
    @property(Prefab)
    challengeEnemyPrefab2: Prefab | null = null;
    @property(Prefab)
    bossPrefab1: Prefab | null = null;
    @property(Prefab)
    bossPrefab2: Prefab | null = null;
    @property(Prefab)
    bossPrefab3: Prefab | null = null;
    @property(Prefab)
    bossPrefab4: Prefab | null = null;
    @property(Prefab)
    bossPrefab5: Prefab | null = null;
    
    LevelEnemy1:Prefab|null=null;
    LevelEnemy2:Prefab|null=null;
    LevelEnemy3:Prefab|null=null;
    LevelBossPrefab:Prefab|null=null; //当前关卡boss预设体
    totalCount = 0;
    killedCount: number = 0;
    currentEnemyCount: number = 0;
    challengeKilledCount_1: number = 0;
    challengeKilledCount_2: number = 0;
    coin_1:Node;
    coin_2:Node;
    bossWarningCoin:Node;
    wall:Node;
    Countdown:number=0;
    EnemyLimited:number=40;
    currentTween=null;
    playerNode:Node;
    @property(Node)
    bossNode : Node = null;

    @property(Node)
    uiFail: Node = null;

    @property(Node)
    uiWin : Node = null;

    @property(Label)
    statictics: Label = null;
    @property(Label)
    currentEnemyCountLabel: Label = null;

    totalTimeCount: number = 300;
    delay:number=-6;
    WavePick:number=0;
    static isPause:boolean=false;
    onLoad() {
        AudioMgr.inst.play('bgm',0.5);
        this.playerNode=find("LevelCanvas/Player");
    }
    static instance: Level |null=null;
    start() {
        Level.instance=this;
        if(sys.platform == sys.Platform.MOBILE_BROWSER ){
            screen.requestFullScreen();        
        }         
        this.coin_1=find('UIRoot/GoldChanllengeBg/UIcoin')
        this.coin_2=find('UIRoot/ExpChallengeBg/UIcoin')
        this.bossWarningCoin=find('UIRoot/UIBossWarning')
        this.wall=find('LevelCanvas/Player/Wall')
        director.on(GameEvent.OnDie, this.onActorDead, this);
        director.on(GameEvent.OnChallengeDie_1, this.onChallengeDead_1, this);
        director.on(GameEvent.OnChallengeDie_2, this.onChallengeDead_2, this);
        director.on(GameEvent.OnBossDie, this.onWin, this);
        director.on(GameEvent.OnCreate1, this.onActorCreate1,  this);
        director.on(GameEvent.OnCreate2, this.onActorCreate2,  this);
        this.chageLevelEnemy();//根据关卡改变敌人属性
        this.createLevel(UIFont.MiddleIndex);
        //查看是否需要加载上次战斗场景
        if(PreStageNode.instance!=null&&PreStageNode.instance.isPrelood==true){
            console.log('加载上次战斗场景')
            this.scheduleOnce(() => {
                PreStageNode.instance.loadStageScence();   
            },0.3)
        }
        
        this.schedule(() => {
            if(Level.isPause==true){
                return;
            }
            this.createEnemy();
            this.updateCountdownTime()
            this.onEnemyLimitedWarning();
        },1, macro.REPEAT_FOREVER, 0);

    }
    //更新当前敌人数量
    update(dt: number)  {
        if(Level.isPause==true){
            return;
        }
        this.currentEnemyCount=this.totalCount-this.killedCount
        this.currentEnemyCountLabel.string = `${this.currentEnemyCount}/${this.EnemyLimited}`;
   }
   onDestroy() {     
    director.off(GameEvent.OnDie, this.onActorDead, this);
}
   //关卡暂停
   static pause(){
        Actor.isPause=true
        EnemyControl.isPause=true
        PlayControl.isPause=true
        PointEmitter.isPause=true
        SkillBar.isPause=true
        SkillEmitter.isPause=true
        Level.isPause=true
   }
   //关卡恢复
   static resume(){
        Actor.isPause=false
        EnemyControl.isPause=false
        PlayControl.isPause=false
        PointEmitter.isPause=false
        SkillBar.isPause=false
        SkillEmitter.isPause=false
        Level.isPause=false
    }

    //选取位置生成选取敌人
    doEnemySpawn(sp: SpawnPoint,enemyPrefab:Prefab) {
        let node = instantiate(enemyPrefab);
        this.node.addChild(node);
        node.worldPosition = sp.spawnNode.worldPosition;
    }
   
    //生成第一种挑战怪
    onActorCreate1(node: Node) {
        if( node &&node == PlayControl.instance?.node){
            const playerNode = PlayControl.instance.node;
            const playerPosition = playerNode.worldPosition;
            const spawnPoint = new SpawnPoint();
            spawnPoint.spawnNode=new Node();
            spawnPoint.spawnNode.worldPosition = new Vec3(playerPosition.x +50, playerPosition.y+50, playerPosition.z);
            spawnPoint.interval = 2.0;
            spawnPoint.repeatCount = 4;
            this.spawnPoints.push(spawnPoint);
            this.schedule(() => {
                this.doEnemySpawn(spawnPoint,this.challengeEnemyPrefab1)
                this.totalCount +=  1;
             
            }, spawnPoint.interval, spawnPoint.repeatCount, 0.0);
        }
    }
    //生成第二种挑战怪
    onActorCreate2(node: Node) {
        if( node &&node == PlayControl.instance?.node){
            const playerNode = PlayControl.instance.node;
            const playerPosition = playerNode.worldPosition;
            const spawnPoint = new SpawnPoint();
            spawnPoint.spawnNode=new Node();
            spawnPoint.spawnNode.worldPosition = new Vec3(playerPosition.x +50, playerPosition.y-50, playerPosition.z);
            spawnPoint.interval = 2.0;
            spawnPoint.repeatCount = 4;
            this.spawnPoints.push(spawnPoint);
            this.schedule(() => {
                this.doEnemySpawn(spawnPoint,this.challengeEnemyPrefab2)
                this.totalCount +=  1;
            }, spawnPoint.interval, spawnPoint.repeatCount, 0.0);
        }
    }
     //普通敌人死亡
     onActorDead(node: Node) {
        if (node && node == PlayControl.instance?.node) {
            this.onLose();
        } 
        this.killedCount++;
    }

    //第一种挑战怪全部死亡时触发
    onChallengeDead_1(){
        this.challengeKilledCount_1++;
        console.log('challengeKilledCount',this.challengeKilledCount_1)
        if(this.challengeKilledCount_1 >= 5){
            this.coin_1.active=true;
        this.coin_1.getComponent(CoinDrop).drop();
            this.challengeKilledCount_1=0;
            //挑战怪属性增加
        ActorStage.instance.challengeEnemy1_Property.maxHp*=2
        ActorStage.instance.challengeEnemy1_Property.attack*=2
        }
    

    }
    //第二种挑战怪全部死亡时触发
    onChallengeDead_2(){
        this.challengeKilledCount_2++;
        console.log('challengeKilledCount',this.challengeKilledCount_2)
        if(this.challengeKilledCount_2 >= 5){
            this.coin_2.active=true;
            this.coin_2.getComponent(CoinDrop).drop();
            this.challengeKilledCount_2=0;
            ActorStage.instance.challengeEnemy2_Property.maxHp*=2
            ActorStage.instance.challengeEnemy2_Property.attack*=2
        }
    }
    //Boss死亡时游戏胜利
    onWin(node: Node) {
        AudioMgr.inst.stop();
        this.uiWin.active = true;
        this.uiWin.parent.getChildByName('UIMask').active = true;
        if(SignalrClient.opend==true){
            this.node.getComponent(StageNode).enabled=false;
            var objOfnull=[]
            SignalrClient.instance.sendObjs(objOfnull,false)
        }
        Level.pause();
    }
    //游戏失败
    onLose(){
        AudioMgr.inst.stop();
        this.uiFail.active = true;
        this.uiFail.parent.getChildByName('UIMask').active = true;
        if(find("UIRoot/UIlimitedWarning").active==true){
            this.uiFail.getChildByName('Button-001').active = false;
            this.uiFail.getChildByName('Button').active = true;
            this.uiFail.getChildByName('Button').setPosition(v3(0,-410,0));
        }
        
        if(SignalrClient.opend==true){ //如果是联网模式，则上传数据
            this.node.getComponent(StageNode).enabled=false;
            var objOfnull=[]
            SignalrClient.instance.sendObjs(objOfnull,false)
        }
        const failAnimation = this.uiFail.getChildByName('Fail Animation').getComponent(dragonBones.ArmatureDisplay)
        failAnimation.playAnimation('effect',1)
        failAnimation.addEventListener(dragonBones.EventObject.COMPLETE, ()=>{
            director.pause();  
        }, this)
    }
    //更新截止时间
    updateCountdownTime() {
        let m=this.totalTimeCount/60;
        let s=this.totalTimeCount%60;
        if(s==0){
            m--
            s=59
        }
        this.totalTimeCount--
        this.statictics.string= `${Math.floor(m)}:${s.toFixed(0)}`
        
            //最后一分钟时boss出场
        if( this.totalTimeCount==60){
            this.wall.active=true;
            this.bossWarningCoin.active=true;
            AudioMgr.inst.stop();
            AudioMgr.inst.playOneShot('Boss_comming_warning',0.7);
            setTimeout(() => {
                this.bossWarningCoin.active=false;
                AudioMgr.inst.play('Boss_comming_bgm',0.3);
                const spawnPoint = new SpawnPoint();
                spawnPoint.spawnNode=this.bossNode
                spawnPoint.interval = 0;
                spawnPoint.repeatCount = 1;
                this.spawnPoints.push(spawnPoint);
                this.doEnemySpawn(spawnPoint,this.LevelBossPrefab);
            },4000);
        }
            //倒计时结束
        if(this.totalTimeCount==0){
            this.uiFail.getChildByName('Button').active =false;
            this.uiFail.getChildByName('Button-001').active = false;
            this.uiFail.getChildByName('Button-002').active = true;
            this.onLose();
        }
    }
    //敌人上限警告
   onEnemyLimitedWarning(){
    if(this.currentEnemyCount>=30&&this.currentEnemyCount<40){
        if(this.currentTween!=null){
            return;
        }
        this.currentEnemyCountLabel.color=new Color(255,0,0,255);
        this.currentTween=tween(this.currentEnemyCountLabel.node)
        .to(0.5, { scale: v3(0.3, 0.4, 1) }) // 缩小
        .to(0.5, { scale: v3(0.4, 0.5, 1) })     // 放大
        .union()                             // 合并
        .repeatForever()                     // 循环执行
        .start();                            // 开始执行
    }else if(this.currentEnemyCount<30){
       if(this.currentTween!=null){
           this.currentTween.stop();
           this.currentEnemyCountLabel.color=new Color(255,255,255,255);
           this.currentEnemyCountLabel.node.scale = new Vec3(0.3, 0.4, 1);
           this.currentTween=null;
       }
    }
    if(this.currentEnemyCount>=40){
        this.UIlimitedWarning();
        return;
    }
}
    //警告ui
    UIlimitedWarning(){
        find("UIRoot/UIlimitedWarning").active=true;
        const label=find("UIRoot/UIlimitedWarning/dialog2/Label-001").getComponent(Label)
        const time=parseInt(label.string);
        let count=parseInt(label.string);
        this.schedule(()=>{ 
            if(this.currentEnemyCount>=40){
            count--;
            label.string=count.toString();
            if(count==0){
                this.onLose();
                return;
            }
            }else{
                label.string=time.toString();
                find("UIRoot/UIlimitedWarning").active=false;
                return;
            }
            },1,time,1)
        }
    //生成关卡
    createLevel(level:LevelState){
        if(UIFont.MiddleIndex==0){
            this.LevelEnemy1=this.enemyPrefab1;
            this.LevelEnemy2=this.enemyPrefab2;
            this.LevelEnemy3=this.enemyPrefab3;
            this.LevelBossPrefab=this.bossPrefab1;
            return;
        }
        if(UIFont.MiddleIndex==1){
            this.LevelEnemy1=this.enemyPrefab3;
            this.LevelEnemy2=this.enemyPrefab4;
            this.LevelEnemy3=this.enemyPrefab5; 
            this.LevelBossPrefab=this.bossPrefab2;
            return;
        }
       if(UIFont.MiddleIndex==2){
            this.LevelEnemy1=this.enemyPrefab5;
            this.LevelEnemy2=this.enemyPrefab6;
            this.LevelEnemy3=this.enemyPrefab7
            this.LevelBossPrefab=this.bossPrefab3
            return;
       }
       if(UIFont.MiddleIndex==3){
            this.LevelEnemy1=this.enemyPrefab7;
            this.LevelEnemy2=this.enemyPrefab8;
            this.LevelEnemy3=this.enemyPrefab9
            this.LevelBossPrefab=this.bossPrefab4
            return;
       }
        if(UIFont.MiddleIndex==4){
            this.LevelEnemy1=this.enemyPrefab9;
            this.LevelEnemy2=this.enemyPrefab10;
            this.LevelEnemy3=this.enemyPrefab11
            this.LevelBossPrefab=this.bossPrefab5
            return;
        }

    }


    //生成敌人
    createEnemy(){
        
        this.WavePick=6-Math.floor(this.totalTimeCount/60);
        let s=this.totalTimeCount%60;
        if(this.totalTimeCount==66){  
            return;
        }
       
        if(s==0){//每分钟刷新一论波数
            this.chageWaveEnemy();
        }
        //每6秒生成两处敌人
        if(s%6==0){
            var random_1 = Math.floor(Math.random() * 10);
            this.schedule(() => {
                if(this.WavePick==1){
                    this.doEnemySpawn(this.spawnPoints[random_1],this.LevelEnemy1)
                    this.totalCount +=  1;
                }
                if(this.WavePick==2){
                    this.doEnemySpawn(this.spawnPoints[random_1],this.LevelEnemy1)
                    this.totalCount +=  1;
                }
                if(this.WavePick==3){
                    this.doEnemySpawn(this.spawnPoints[random_1],this.LevelEnemy2)
                    this.totalCount +=  1;
                }
                if(this.WavePick==4){
                    this.doEnemySpawn(this.spawnPoints[random_1],this.LevelEnemy2)
                    this.totalCount +=  1;
                }
                if(this.WavePick==5){
                    this.doEnemySpawn(this.spawnPoints[random_1],this.LevelEnemy2)
                    this.doEnemySpawn(this.spawnPoints[random_1],this.LevelEnemy3)
                    this.totalCount +=  2;
                }
               
                }, this.spawnPoints[random_1].interval, this.spawnPoints[random_1].repeatCount,0.01);
           var random_2 = Math.floor(Math.random() * 10);
            this.schedule(() => {
                if(this.WavePick==1){
                this.doEnemySpawn(this.spawnPoints[random_2],this.LevelEnemy1)
                this.totalCount +=  1;
                }
                if(this.WavePick==2){
                this.doEnemySpawn(this.spawnPoints[random_2],this.LevelEnemy2)
                this.totalCount +=  1;
                }
                if(this.WavePick==3){
                this.doEnemySpawn(this.spawnPoints[random_2],this.LevelEnemy3)
                this.totalCount +=  1;
                }
                if(this.WavePick==4){
                    this.doEnemySpawn(this.spawnPoints[random_2],this.LevelEnemy3)
                    this.totalCount +=  1;
                }
                if(this.WavePick==5){
                    this.doEnemySpawn(this.spawnPoints[random_1],this.LevelEnemy1)
                    this.doEnemySpawn(this.spawnPoints[random_2],this.LevelEnemy3)
                    this.totalCount +=  2;
                }
              
            }, this.spawnPoints[random_2].interval, this.spawnPoints[random_2].repeatCount,0.01);
    }
    }
    //根据波次改变敌人属性
    chageWaveEnemy(){
        if(this.WavePick==1){
            this.setEnemyProperty(1)
        }
        if(this.WavePick==2){
            this.setEnemyProperty(2)
        }
        if(this.WavePick==3){
            this.setEnemyProperty(2)
        }
        if(this.WavePick==4){
            this.setEnemyProperty(2)
        }
        if(this.WavePick==5){
            this.setEnemyProperty(2)
        }
    }
    //根据关卡改变敌人属性
    chageLevelEnemy(){
        if(UIFont.MiddleIndex==0){
            this.setEnemyProperty(1)
        }
        if(UIFont.MiddleIndex==1){
            this.setEnemyProperty(5)
        }
        if(UIFont.MiddleIndex==2){
            this.setEnemyProperty(10)
        }
        if(UIFont.MiddleIndex==3){
            this.setEnemyProperty(20)
        }
        if(UIFont.MiddleIndex==4){
            this.setEnemyProperty(30)
        }
    }
    //设置敌人属性
    setEnemyProperty(coefficient:number){

        for(let i=1;i<=11;i++){
            let enemyName="Enemy"+i.toString()
            ActorStage.instance.setEnemyProperty(enemyName,coefficient,coefficient*0.75)
        }
    }
 

}
