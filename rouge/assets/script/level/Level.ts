import { CCFloat, CCInteger, Color, Component, Label, Node, Prefab, Tween, Vec3, _decorator, assert, director, dragonBones, find, instantiate, macro, screen, sp, sys, tween, v3 } from "cc";
import { GameEvent } from "../event/GameEvent";
import { PlayerController } from "../actor/PlayControl";
import { CoinDrop } from "../ani/CoinDrop";
import { AudioMgr } from "../sound/soundManager";
import { DrangonAni } from "../ani/DrangonAni";
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

@ccclass("Level")
export class Level extends Component {   

    @property([SpawnPoint])
    spawnPoints: Array<SpawnPoint> = [];

    @property(Prefab)
    enemyPrefab: Prefab | null = null;
    @property(Prefab)
    challengeEnemyPrefab1: Prefab | null = null;
    @property(Prefab)
    challengeEnemyPrefab2: Prefab | null = null;
    @property(Prefab)
    bossPrefab: Prefab | null = null;
    totalCount = 3;
    killedCount: number = 0;
    currentEnemyCount: number = 0;
    challengeKilledCount_1: number = 0;
    challengeKilledCount_2: number = 0;
    coin_1:Node;
    coin_2:Node;
    bossWarningCoin:Node;
    wall:Node;
    Countdown:number=0;
    EnemyLimited:number=30;
    currentTween=null;
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
    onLoad() {
        AudioMgr.inst.play('bgm',0.5);
    }

    start() {
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
        this.updateCountdownTime()
        this.schedule(() => {
            this.updateCountdownTime()
        },1, macro.REPEAT_FOREVER, 0);
        
    }
    update(dt: number)  {
        this.currentEnemyCount=this.totalCount-this.killedCount
        this.currentEnemyCountLabel.string = `${this.currentEnemyCount}/${this.EnemyLimited}`;
        if(this.currentEnemyCount>=20){
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
        }else if(this.currentEnemyCount<20){
           if(this.currentTween!=null){
               this.currentTween.stop();
               this.currentEnemyCountLabel.color=new Color(255,255,255,255);
               this.currentEnemyCountLabel.node.scale = new Vec3(0.3, 0.4, 1);
               this.currentTween=null;
           }
        }else if(this.currentEnemyCount==30){
            this.onLose();
        }else if(this.currentEnemyCount>30){
            return;
        }   
   }
    onDestroy() {     
        director.off(GameEvent.OnDie, this.onActorDead, this);
    }

    doSpawn(sp: SpawnPoint) {
        let node = instantiate(this.enemyPrefab);
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
            this.currentEnemyCount=this.totalCount-parseInt(this.currentEnemyCountLabel.string);
            if(s==0){
                m--
                s=59
                this.delay=-6;
            for (let sp of this.spawnPoints) {
                   
                    this.schedule(() => {
                        this.doSpawn(sp)
                        this.totalCount +=  1;
                    }, sp.interval, sp.repeatCount, this.delay+=6);
                }
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
   
}