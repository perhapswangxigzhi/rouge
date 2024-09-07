import { CCFloat, CCInteger, Component, Label, Node, Prefab, Vec3, _decorator, assert, director, find, instantiate, screen, sys } from "cc";
import { GameEvent } from "../event/GameEvent";
import { PlayerController } from "../actor/PlayControl";
import { CoinDrop } from "../ani/CoinDrop";
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
    enemyPrefab1: Prefab | null = null;
    totalCount = 2;
    killedCount: number = 0;
    challengeKilledCount: number = 0;
    coin:Node;
    @property(Node)
    uiFail: Node = null;

    @property(Node)
    uiWin : Node = null;

    @property(Label)
    statictics: Label = null;

    totalEnemyCount: number = 0;

    start() {
        if(sys.platform == sys.Platform.MOBILE_BROWSER ){
            screen.requestFullScreen();        
        }         
        for (let sp of this.spawnPoints) {
            this.totalCount += sp.repeatCount + 1;
            this.schedule(() => {
                this.doSpawn(sp)
            }, sp.interval, sp.repeatCount, 0.0);
        }
        this.coin=find('UIRoot/GoldChanllengeBg/UIcoin')
        director.on(GameEvent.OnDie, this.onActorDead, this);
        director.on(GameEvent.OnChallengeDie, this.onChallengeDead, this);
        director.on(GameEvent.OnCreate, this.onActorCreate,  this);
        this.statictics.string = `${this.killedCount}/${this.totalCount}`;
    }

    onDestroy() {     
        director.off(GameEvent.OnDie, this.onActorDead, this);
    }

    doSpawn(sp: SpawnPoint) {
        let node = instantiate(this.enemyPrefab);
        this.node.addChild(node);
        node.worldPosition = sp.spawnNode.worldPosition;
    }
    doChallengeSpawn(sp: SpawnPoint) {
        let node = instantiate(this.enemyPrefab1);
        this.node.addChild(node);
        node.worldPosition = sp.spawnNode.worldPosition;
    }
    onActorDead(node: Node) {
        if (node && node == PlayerController.instance?.node) {
            this.uiFail.active = true;
        } else {
            this.killedCount++;
            this.statictics.string = `${this.killedCount}/${this.totalCount}`; 
            
            if( this.killedCount >= this.totalCount){
                this.uiWin.active = true;
            }
        }
    }
    onChallengeDead(){
        this.challengeKilledCount++;
        console.log('challengeKilledCount',this.challengeKilledCount)
        if(this.challengeKilledCount >= 5){
            this.coin.worldPosition=this.spawnPoints[4].spawnNode.worldPosition;
            this.coin.active=true;
            this.coin.getComponent(CoinDrop).drop();
        }


    }
    onActorCreate(node: Node) {
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
                this.doChallengeSpawn(spawnPoint)
                this.totalCount +=  1;
                this.statictics.string = `${this.killedCount}/${this.totalCount}`;
            }, spawnPoint.interval, spawnPoint.repeatCount, 0.0);
        }
    }
}