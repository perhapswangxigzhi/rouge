import { _decorator, assetManager, AudioClip, AudioSource, CCFloat, CCInteger, Component, instantiate, Node, randomRange, tween, Vec3 } from 'cc';
import { SkillCooling } from '../ui/SkillCooling';
import { UIGold } from '../ui/UIGold';
import { UIExBar } from '../ui/UIExBar';
const { ccclass, property } = _decorator;

@ccclass('CoinDrop')
export class CoinDrop extends Component {
    @property(CCInteger)
    coinCount: number = 8;
    @property(CCInteger)
    minRaidus: number = 50;
    @property(CCInteger)
    maxRaidus: number = 150;
    @property(CCFloat)
    duration1:number = 0.3;
    @property(CCFloat)
    duration2:number = 0.8;
    @property(Node)
    target: Node = null;
    audioSource: AudioSource = null;
    dropGroup:Node[] = [];
    start(){
    }
    drop(){
        this.audioSource=this.node.getComponent(AudioSource);
        //dropGroup = []
        if(this.node.getChildByName('coin')){
            var  coinPfb=this.node.getChildByName('coin')
            }else if(this.node.getChildByName('exp')){
            var  coinPfb=this.node.getChildByName('exp')
        }
        if(this.dropGroup.length==0){
        this.dropGroup.push(coinPfb)
        for (var  i = 0; i < this.coinCount; i++) {
        var  pfbClone = instantiate(coinPfb)
           pfbClone.parent=coinPfb.parent
           this.dropGroup.push(pfbClone)
       
        }
    }
        var  finishedCount=0
        for(var  i=0;i<this.coinCount;i++){
            var  angle=randomRange(i*360/this.coinCount,(i+1)*360/this.coinCount)
            var  radius=randomRange(this.minRaidus,this.maxRaidus)
            var  randX=radius*Math.cos(angle)
            var  randY=radius*Math.sin(angle)
           tween(this.dropGroup[i])
                .to(this.duration1,{position:new Vec3(randX,randY,0)},{easing:'smooth'})
                .to(this.duration2,{worldPosition:this.target.worldPosition},{easing:'smooth'})
                .call(()=>{
                    finishedCount++;
                    if(finishedCount>=this.coinCount){ 
                         if(coinPfb==this.node.getChildByName('coin')){
                            UIGold.instance.coinCount+=this.coinCount*2;
                        } if(coinPfb==this.node.getChildByName('exp')){
                            UIExBar.instance.ExpDrop+=this.coinCount*10;
                        }
                        assetManager.resources.load("sounds/getcoin", AudioClip, (err, clip) => {
                            // 播放音效
                            this.audioSource.playOneShot(clip, 1);
                            });    
                    this.node.active=false
                     // 重置所有节点的位置到初始位置
                    for (let i = 0; i < this.dropGroup.length; i++) {
                        tween(this.dropGroup[i])
                    .to(this.duration2, { worldPosition:this.node.worldPosition }, { easing: 'smooth' })
                    .start();
                     }
                    }
                })
                
                .start()
        }
    }
   
}
    



