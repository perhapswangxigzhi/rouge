import { _decorator, Component, find } from "cc";
import signalR from "@microsoft/signalr";
import MsgPackHub from "@microsoft/signalr-protocol-msgpack";
import { StageData } from "./StageData";
import { AssentManager } from "../bag/AssentManager";
import { PreStageNode } from "./PreStageNode";
import { Level } from "../level/Level";
import { UIFont } from "../ui/UIFont";
import { EquipmentPerporty } from "../bag/EquipmentPerporty";
import { hasEquip } from "../bag/hasEquip";
import { UIporperty } from "../bag/UIporperty";
import { NodeType } from "./StageNode";
const { ccclass, property } = _decorator;



@ccclass("SignalrClient")
export class SignalrClient extends Component {
    private _hubConnection:signalR.HubConnection;
    static instance: SignalrClient;
    static opend:boolean = false;
    onLoad () {
    console.log("SignalrClient onLoad");
       this.startConnection();
       SignalrClient.instance = this;
    }

     async startConnection() {
            // 启动SignalR通信连接  
            console.log("SignalR Start...");
            this._hubConnection = new signalR.HubConnectionBuilder()
                //.withUrl("http://localhost:5240/hub")
                //.withUrl("http://8.134.206.82:5240/hub")
                .withUrl("http://havefun.wang:5240/hub")
                .withHubProtocol(new MsgPackHub.MessagePackHubProtocol())
                .build();
            try {
                await this._hubConnection.start();
                SignalrClient.opend = true;
                console.log("SignalR Connected.");
            } catch (error) {
                console.error("连接失败，服务端未开启或地址错误:", error);
                SignalrClient.opend = false;
                return; 
            }
           this.init();
            console.log("SignalR Connected.");
            var info = new ServiceMgmtSlaveInfo();
            info.SlaveId = "cocos client";
            info.Name = "实时连接测试";
            info.DeviceId = "webxxxxxx";
            this._hubConnection.invoke("Register", info);
            this._hubConnection.on("Register", (pack: ServiceRegisterPack) => {
                console.log( pack.Message);
                console.log("注册信息" + JSON.stringify(pack));
            });
        } 
    async init(){
        this.getAssentByDb("888")
        this.getObjs();
        this.getEquiptoDb("888");
    }


    async getAssent(){
        this._hubConnection.invoke("GetStageData")
        this._hubConnection.on("ReceiveData", (obj:StageData) => {
            console.log("获取用户资源：" +JSON.stringify(obj));
            AssentManager.instance.goldCount = obj.GoldCount;
            AssentManager.instance.energyCount = obj.EnergyCount;
            AssentManager.instance.diamondCount = obj.DiamondCount;
            
        });
       
    }       
          
    async setAssent(GoldCount:number, EnergyCount:number, DiamondCount:number){
        try {
            var dataObj=new StageData(GoldCount,EnergyCount,DiamondCount);
            this._hubConnection.invoke("SetStageData",dataObj)
        }
        catch (error) {
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
           if(obj.length==0){
                console.log("读取服务端文件返回的对象为空");
                return;
           } 
            console.log("上次战斗场景是否意外关闭：" +obj[obj.length-1].isPre);
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
    
    async sendAssent(assent:Assent){
        this._hubConnection.invoke("AddAssent",assent)
        this._hubConnection.on("AddAssented", (data) => {
            console.log(data);
        });
    }
    async getAssentByDb(id:string){
         this._hubConnection.invoke("GetAssent",id)
         this._hubConnection.on("GetAssented", (data) => {
            AssentManager.instance.goldCount = data.goldCount;
            AssentManager.instance.energyCount = data.energyCount;
            AssentManager.instance.diamondCount = data.diamondCount;
            UIFont.MiddleIndex = data.level;
            UIFont.instance.init();
        });
     
    }
    //上传装备
    async sendEquiptoDb(equip:EquipmentPerporty){
        this._hubConnection.invoke("AddEquip",equip)
    //     this._hubConnection.on("AddEquipd", (data) => {

    //    });
   }
   //获取装备
   async getEquiptoDb(id:string){
        this._hubConnection.invoke("GetEquip",id)
        this._hubConnection.on("GetEquiped", (data) => {
            console.log(data);
            for(let i=0;i<data.length;i++){
                if(data[i].indexOnSlot==-1){
                    hasEquip.instance.EquipMentsOnBag.push(data[i]);
                }else{
                    hasEquip.instance.EquipMentsOnSlot.push(data[i]);
                }
            }
            UIporperty.getEquipProperty();
            console.log("从服务器获取的装备",hasEquip.instance.EquipMentsOnBag,hasEquip.instance.EquipMentsOnSlot)
   }); 
}
    //删除装备
    async delEquiptoDb(equip:EquipmentPerporty){
        this._hubConnection.invoke("DelEquip",equip)
        this._hubConnection.on("DelEquiped", (data) => {
            console.log("删除装备成功");
           
        });
    }
}
class User
{
    id:string;
    Message:string;
    constructor(id,Message){
        this.id=id;
        this.Message=Message;
    }
}
export class Assent
{
    id:string;
    goldCount:number;
    energyCount:number;
    diamondCount:number;
    level:number;
     constructor(id,goldCount,energyCount,diamondCount,level){
        this.id=id;
        this.goldCount=goldCount;
        this.energyCount=energyCount;
        this.diamondCount=diamondCount;
        this.level=level;
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

