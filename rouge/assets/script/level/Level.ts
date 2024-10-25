import { CCFloat, CCInteger, Color, Component, Label, Node, Prefab, Tween, Vec3, _decorator, assert, director, dragonBones, find, instantiate, macro, screen, sp, sys, tween, v3 } from "cc";
import { GameEvent } from "../event/GameEvent";
import { PlayerController } from "../actor/PlayControl";
import { CoinDrop } from "../ani/CoinDrop";
import { AudioMgr } from "../sound/soundManager";
import { DrangonAni } from "../ani/DrangonAni";
import { PreStageNode } from "../signalr/PreStageNode";
import { AssentManager } from "../bag/AssentManager";
import { ActorStage } from "../actor/ActorStage";
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
    challengeEnemyPrefab1: Prefab | null = null;
    @property(Prefab)
    challengeEnemyPrefab2: Prefab | null = null;
    @property(Prefab)
    bossPrefab: Prefab | null = null;
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
    sp:number=0;
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
    onLoad() {
        AudioMgr.inst.play('bgm',0.5);
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
        //this.updateCountdownTime()
        //如果不需要加载保存场景，正常执行
        if(PreStageNode.instance==null||PreStageNode.instance.isPrelood==false){
            console.log('load stage scene为空')
            this.schedule(() => {
                this.createEnemy();
                this.updateCountdownTime()
                this.onEnemyLimitedWarning();
            },1, macro.REPEAT_FOREVER, 0);
            return;
        }else{
            this.scheduleOnce(() => {
            PreStageNode.instance.loadStageScence();   
            },0.3)
        this.schedule(() => {
            this.createEnemy();
            this.updateCountdownTime()
            this.onEnemyLimitedWarning();
        },1, macro.REPEAT_FOREVER, 0);

    }
}

    update(dt: number)  {
        this.currentEnemyCount=this.totalCount-this.killedCount
        this.currentEnemyCountLabel.string = `${this.currentEnemyCount}/${this.EnemyLimited}`;
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
    onDestroy() {     
        director.off(GameEvent.OnDie, this.onActorDead, this);
    }

    doEnemy1Spawn(sp: SpawnPoint) {
        let node = instantiate(this.enemyPrefab1);
        this.node.addChild(node);
        node.worldPosition = sp.spawnNode.worldPosition;
    }
    doEnemy2Spawn(sp: SpawnPoint) {
        let node = instantiate(this.enemyPrefab2);
        this.node.addChild(node);
        node.worldPosition = sp.spawnNode.worldPosition;
    }
    doEnemy3Spawn(sp: SpawnPoint) {
        let node = instantiate(this.enemyPrefab3);
        this.node.addChild(node);
        node.worldPosition = sp.spawnNode.worldPosition;
    }

    doBossSpawn(sp: SpawnPoint) {
        let node = instantiate(this.bossPrefab);
        this.node.addChild(node);
        node.worldPosition = sp.spawnNode.worldPosition;
    }
    doChallengeSpawn1(sp: SpawnPoint) {
        let node = instantiate(this.challengeEnemyPrefab1);
        this.node.addChild(node);
        node.worldPosition = sp.spawnNode.worldPosition;
    }
    doChallengeSpawn2(sp: SpawnPoint) {
        let node = instantiate(this.challengeEnemyPrefab2);
        this.node.addChild(node);
        node.worldPosition = sp.spawnNode.worldPosition;
    }
    onActorDead(node: Node) {
        if (node && node == PlayerController.instance?.node) {
            this.onLose();
        } 
        this.killedCount++;
      
    }
  
    //第一种挑战怪全部死亡时触发
    onChallengeDead_1(){
        this.challengeKilledCount_1++;
        console.log('challengeKilledCount',this.challengeKilledCount_1)
        if(this.challengeKilledCount_1 >= 5){
            this.coin_1.worldPosition=this.spawnPoints[this.spawnPoints.length - 1].spawnNode.worldPosition;
            this.coin_1.active=true;
            this.coin_1.getComponent(CoinDrop).drop();
            this.challengeKilledCount_1=0;
        }
        //挑战怪属性增加
        ActorStage.instance.challengeEnemy1_Property.maxHp*=2
        ActorStage.instance.challengeEnemy1_Property.attack*=2

    }
     //第二种挑战怪全部死亡时触发
    onChallengeDead_2(){
        this.challengeKilledCount_2++;
        console.log('challengeKilledCount',this.challengeKilledCount_2)
        if(this.challengeKilledCount_2 >= 5){
            this.coin_2.worldPosition=this.spawnPoints[this.spawnPoints.length - 1].spawnNode.worldPosition;
            this.coin_2.active=true;
            this.coin_2.getComponent(CoinDrop).drop();
            this.challengeKilledCount_2=0;
        }
        ActorStage.instance.challengeEnemy2_Property.maxHp*=2
        ActorStage.instance.challengeEnemy2_Property.attack*=2
    }
    //Boss死亡时游戏胜利
    onWin(node: Node) {
        AudioMgr.inst.stop();
        this.uiWin.active = true;
        this.uiWin.parent.getChildByName('UIMask').active = true;
       
    }
    //游戏失败
    onLose(){
        AudioMgr.inst.stop();
        this.uiFail.active = true;
        this.uiFail.parent.getChildByName('UIMask').active = true;
        const failAnimation = this.uiFail.getChildByName('Fail Animation').getComponent(dragonBones.ArmatureDisplay)
        failAnimation.playAnimation('effect',1)
        failAnimation.addEventListener(dragonBones.EventObject.COMPLETE, ()=>{
            director.pause();  
        }, this)
    }
    onActorCreate1(node: Node) {
        if( node &&node == PlayerController.instance?.node){
            const playerNode = PlayerController.instance.node;
            const playerPosition = playerNode.worldPosition;
            const spawnPoint = new SpawnPoint();
            spawnPoint.spawnNode=new Node();
            spawnPoint.spawnNode.worldPosition = new Vec3(playerPosition.x +100, playerPosition.y+100, playerPosition.z);
            spawnPoint.interval = 2.0;
            spawnPoint.repeatCount = 4;
            this.spawnPoints.push(spawnPoint);
            this.schedule(() => {
                this.doChallengeSpawn1(spawnPoint)
                this.totalCount +=  1;
             
            }, spawnPoint.interval, spawnPoint.repeatCount, 0.0);
        }
    }
    onActorCreate2(node: Node) {
        if( node &&node == PlayerController.instance?.node){
            const playerNode = PlayerController.instance.node;
            const playerPosition = playerNode.worldPosition;
            const spawnPoint = new SpawnPoint();
            spawnPoint.spawnNode=new Node();
            spawnPoint.spawnNode.worldPosition = new Vec3(playerPosition.x +100, playerPosition.y-100, playerPosition.z);
            spawnPoint.interval = 2.0;
            spawnPoint.repeatCount = 4;
            this.spawnPoints.push(spawnPoint);
            this.schedule(() => {
                this.doChallengeSpawn2(spawnPoint)
                this.totalCount +=  1;
            }, spawnPoint.interval, spawnPoint.repeatCount, 0.0);
        }
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
                this.doBossSpawn(spawnPoint);
            },4000);
        }
        if(this.totalTimeCount==0){
            this.uiFail.getChildByName('Button').active =false;
            this.uiFail.getChildByName('Button-001').active = false;
            this.uiFail.getChildByName('Button-002').active = true;
            this.onLose();
        }
    }
    createEnemy(){
        let s=this.totalTimeCount%60;
        var randomNum = Math.floor(Math.random() * 10);
        if(this.totalTimeCount==66){  
            return;
        }
       
        if(s==0){//每分钟刷新一论波数
            this.WavePick+=1
            this.chageWaveEnemy();
        }
        //每6秒生成两处敌人
        if(s%6==0){
        this.schedule(() => {
                this.doEnemy1Spawn(this.spawnPoints[randomNum])
                this.totalCount +=  1;
            }, this.spawnPoints[randomNum].interval, this.spawnPoints[randomNum].repeatCount,0);
           
        this.schedule(() => {
            this.doEnemy2Spawn(this.spawnPoints[this.sp])
            this.totalCount +=  1;
        }, this.spawnPoints[this.sp].interval, this.spawnPoints[this.sp].repeatCount,0);
            this.sp++
        }
        
       if(this.sp==10){
        this.sp=0
       }
    }
    chageWaveEnemy(){
       if(this.WavePick==2){
            this.setEnemyProperty(2)
       }
       if(this.WavePick==3){
            this.setEnemyProperty(1.5)
        }
        if(this.WavePick==3){
            this.setEnemyProperty(1.5)
        }
        if(this.WavePick==4){
            this.setEnemyProperty(2)
        }
        if(this.WavePick>=2){
            var randomNum = Math.floor(Math.random() * 10);
            this.schedule(() => {
                this.doEnemy3Spawn(this.spawnPoints[randomNum])
                this.totalCount +=  1;
            }, this.spawnPoints[randomNum].interval, this.spawnPoints[randomNum].repeatCount,0);
        }
    }
    setEnemyProperty(coefficient:number){
        ActorStage.instance.enemy1_Property.maxHp=Math.floor(ActorStage.instance.enemy1_Property.maxHp*coefficient)
        ActorStage.instance.enemy1_Property.attack=Math.floor(ActorStage.instance.enemy1_Property.attack*1.5)
        ActorStage.instance.enemy2_Property.maxHp=Math.floor(ActorStage.instance.enemy2_Property.maxHp*coefficient)
        ActorStage.instance.enemy2_Property.attack=Math.floor(ActorStage.instance.enemy2_Property.attack*1.5)
        ActorStage.instance.enemy3_Property.maxHp=Math.floor(ActorStage.instance.enemy3_Property.maxHp*coefficient)
        ActorStage.instance.enemy3_Property.attack=Math.floor(ActorStage.instance.enemy3_Property.attack*1.5)

    }
   UIlimitedWarning(){
    find("UIRoot/UIlimitedWarning").active=true;
    const label=find("UIRoot/UIlimitedWarning/Label-001").getComponent(Label)
    const time=parseInt(label.string);
    let count=parseInt(label.string);
    this.schedule(()=>{ 
        count--;
        label.string=count.toString();
        },1,time,1)
        if(count==0){
            this.onLose();
            return;
        }
    }
   

}
