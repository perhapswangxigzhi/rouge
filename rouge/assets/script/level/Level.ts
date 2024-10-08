import { CCFloat, CCInteger, Component, Label, Node, Prefab, Vec3, _decorator, assert, director, find, instantiate, macro, screen, sys } from "cc";
import { GameEvent } from "../event/GameEvent";
import { PlayerController } from "../actor/PlayControl";
import { CoinDrop } from "../ani/CoinDrop";
import { AudioMgr } from "../sound/soundManager";
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
    totalCount = 2;
    killedCount: number = 0;
    challengeKilledCount_1: number = 0;
    challengeKilledCount_2: number = 0;
    coin_1:Node;
    coin_2:Node;
    bossWarningCoin:Node;
    wall:Node;
    Countdown:number=0;
    @property(Node)
    uiFail: Node = null;

    @property(Node)
    uiWin : Node = null;

    @property(Label)
    statictics: Label = null;
    @property(Label)
    killCount: Label = null;

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
        this.wall=find('LevelCanvas/Wall')
        director.on(GameEvent.OnDie, this.onActorDead, this);
        director.on(GameEvent.OnChallengeDie_1, this.onChallengeDead_1, this);
        director.on(GameEvent.OnChallengeDie_2, this.onChallengeDead_2, this);
        director.on(GameEvent.OnBossDie, this.onBossDead, this);
        director.on(GameEvent.OnCreate1, this.onActorCreate1,  this);
        director.on(GameEvent.OnCreate2, this.onActorCreate2,  this);
        this.updateCountdownTime()
        this.schedule(() => {
            this.updateCountdownTime()
        },1, macro.REPEAT_FOREVER, 0);
        
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
            AudioMgr.inst.stop();
            this.uiFail.active = true;
        } else {
            this.killedCount++;
            this.killCount.string = `${this.killedCount}`; 
            //所有小怪死亡时boss出场
            if( this.killedCount == this.totalCount){
                this.wall.active=true;
                this.bossWarningCoin.active=true;
                AudioMgr.inst.stop();
                AudioMgr.inst.playOneShot('Boss_comming_warning',0.7);
                setTimeout(() => {
                this.bossWarningCoin.active=false;
                AudioMgr.inst.play('Boss_comming_bgm',0.3);
                this.doBossSpawn(this.spawnPoints[this.spawnPoints.length - 1]);
                },4000);
            }
           
        }
    }
    //第一种挑战怪全部死亡时触发
    onChallengeDead_1(){
        this.challengeKilledCount_1++;
        console.log('challengeKilledCount',this.challengeKilledCount_1)
        if(this.challengeKilledCount_1 >= 5){
            this.coin_1.worldPosition=this.spawnPoints[this.spawnPoints.length - 1].spawnNode.worldPosition;
            this.coin_1.active=true;
            this.coin_1.getComponent(CoinDrop).drop();
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
        }
   
    }
    //Boss死亡时游戏胜利
    onBossDead(node: Node) {
        AudioMgr.inst.stop();
        this.uiWin.active = true;
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
             //   this.statictics.string = `${this.killedCount}/${this.totalCount}`;
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
                //this.statictics.string = `${this.killedCount}/${this.totalCount}`;
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
                for (let sp of this.spawnPoints) {
                    this.totalCount += sp.repeatCount + 1;
                    this.schedule(() => {
                        this.doSpawn(sp)
                    }, sp.interval, sp.repeatCount, this.delay+=6);
                }
            }
            this.totalTimeCount--
            this.statictics.string= `${Math.floor(m)}:${s.toFixed(0)}`
          
        }
}