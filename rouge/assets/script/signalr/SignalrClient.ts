import { _decorator, Component, find } from "cc";
import signalR from "@microsoft/signalr";
import MsgPackHub from "@microsoft/signalr-protocol-msgpack";
import { StageData } from "./StageData";
import { AssentManager } from "../bag/AssentManager";
import { PreStageNode } from "./PreStageNode";
import { Level } from "../level/Level";
const { ccclass, property } = _decorator;
enum NodeType {
    Player,
    Enemy1,
    Enemy2,
    Enemy3,
    ChallengeEnemy1,
    ChallengeEnemy2,
    Boss1,
    Item,
    Other
}



@ccclass("SignalrClient")
export class SignalrClient extends Component {
    private _hubConnection:signalR.HubConnection;
    static instance: SignalrClient;
    static opend:boolean = false;
    onLoad () {
       this.startConnection();
       SignalrClient.instance = this;
    }

    async startConnection() {
        // 先检测服务器是否开启
           
            // 启动SignalR通信连接  
            console.log("SignalR Start...");
            this._hubConnection = new signalR.HubConnectionBuilder()
               // .withUrl("http://127.0.0.1:5240/hub")
                .withUrl("http://192.168.11.6:5240/hub")
                .withHubProtocol(new MsgPackHub.MessagePackHubProtocol())
                .build();
    
            this._hubConnection.on("Register", (pack: ServiceRegisterPack) => {
                console.log("返回消息打印：" + pack.Message);
                console.log("返回消息打印：" + JSON.stringify(pack));
            });
            try {
                await this._hubConnection.start();
                SignalrClient.opend = true;
                console.log("SignalR Connected.");
            } catch (error) {
                console.error("连接失败，服务端未开启或地址错误:", error);
                SignalrClient.opend = false;
                return; // 根据需要可以选择是否返回或者继续处理
            }
            console.log("SignalR Connected.");
            var info = new ServiceMgmtSlaveInfo();
            info.SlaveId = "cocos client";
            info.Name = "实时连接测试";
            info.DeviceId = "webxxxxxx";
            this._hubConnection.invoke("Register", info);
            var obj = new MyObject("Tom", 25);
            this._hubConnection.invoke<MyObject>("GetObject", obj)
                .then((obj) => {
                    console.log("获取到的对象：", obj);
                    // 这里可以对获取到的对象进行进一步处理
                })
                .catch(err => console.error("获取对象失败", err.toString()));
            this.getAssent();
            this.getObjs();
        } 
    async getAssent(){
        try {
            this._hubConnection.invoke("GetStageData")
            this._hubConnection.on("ReceiveData", (obj:StageData) => {
                console.log("读取服务端文件返回的对象：" +JSON.stringify(obj));
                AssentManager.instance.goldCount = obj.GoldCount;
                AssentManager.instance.energyCount = obj.EnergyCount;
                AssentManager.instance.diamondCount = obj.DiamondCount;
            });
        } catch (error) {
            console.error("对象未存于文件中:", error);
            this.setAssent(0,0,0);   //创建对象于文件中
        }
    }       
          
    async setAssent(GoldCount:number, EnergyCount:number, DiamondCount:number){
        try {
            var dataObj=new StageData(GoldCount,EnergyCount,DiamondCount);
            this._hubConnection.invoke("SetStageData",dataObj)
        } catch (error) {
            console.error("传输参数对象错误:", error);
        }
    }
    async sendObjs(objs:any[],Prelood:boolean){
        var isPre=new isPrelood();
        isPre.isPre=Prelood;
        objs.push(isPre);
        this._hubConnection.invoke("SendMixedArray",objs)
      

    }
    async getObjs(){
        this._hubConnection.invoke("GetMessagePackData")
        
        .then( (obj) => {
          //  console.log("读取服务端文件返回的对象：" +JSON.stringify(obj));
          for(let i=0;i<obj.length-1;i++){
            console.log("读取服务端文件返回的对象：" +obj[i]._nodeType);
          }
            console.log("读取服务端文件返回的对象：" +obj[obj.length-1].isPre);
            if(obj[obj.length-1].isPre==true){
                find("LevelCanvas/UIContinue").active=true;
                find("LevelCanvas/UIMask").active=true;
                PreStageNode.instance.isPrelood=true
            }
            obj.pop();
            PreStageNode.instance._nodeStage=obj;
            console.log("PreStageNode的对象：" +JSON.stringify(PreStageNode.instance._nodeStage));
           
        });
      

    }




 }
    

    

class MyObject {
    Name:string;
    Age:number;
    constructor(name, age) {
        this.Name = name;
        this.Age = age;
    }
}
class ServiceMgmtSlaveInfo
{
    public SlaveId:String;
    public Name:String;
    public DeviceId:String;
    constructor() {
      
    }
}

class ServiceRegisterPack
{
    public ConnectionId:String;
    public ServiceId:String;
    public IpAddr:String;
    public Message:String;
}
class isPrelood{
    isPre:boolean;
}
    //一般节点类
class nodeNormal{
    _nodeType:NodeType;
    nodeName:string;
    nodePostion:number[];
}
    //敌人节点类
class nodeEnemy{
        _nodeType:NodeType;
        nodeName:string;
        nodePostion:number[];
        hp:number;
    }
    //玩家节点类
class nodePlayer{
        _nodeType:NodeType;
        nodeName:string;
        nodePostion:number[];
        hp:number;
        ex:number;
        level:number;
        killCount:number;
    }
    //其他属性类
    class nodeOther{
        _nodeType:NodeType;
        coinCount:number;
        ExpDrop:number;
        timeCount:number;
        currentEnemyCount:number;
        reflashCount:number
        talentCount:number[];
    }           