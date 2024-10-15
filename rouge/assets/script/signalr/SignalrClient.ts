import { _decorator, Component } from "cc";
import signalR from "@microsoft/signalr";
import MsgPackHub from "@microsoft/signalr-protocol-msgpack";
import { StageData } from "./StageData";
import { AssentManager } from "../bag/AssentManager";
const { ccclass, property } = _decorator;



@ccclass("SignalrClient")
export class SignalrClient extends Component {
    private _hubConnection:signalR.HubConnection;
    static instance: SignalrClient;

    start () {
       this.startConnection();
       SignalrClient.instance = this;
    }

    async startConnection() {
        // 先检测服务器是否开启
    
            // 启动SignalR通信连接
            console.log("SignalR Start...");
            this._hubConnection = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5240/hub")
                .withHubProtocol(new MsgPackHub.MessagePackHubProtocol())
                .build();
    
            this._hubConnection.on("Register", (pack: ServiceRegisterPack) => {
                console.log("返回消息打印：" + pack.Message);
                console.log("返回消息打印：" + JSON.stringify(pack));
            });
    
            this._hubConnection.on("ReceiveData", (obj:StageData) => {
                console.log("读取服务端文件返回的对象：" +JSON.stringify(obj));
                AssentManager.instance.goldCount = obj.GoldCount;
                AssentManager.instance.energyCount = obj.EnergyCount;
                AssentManager.instance.diamondCount = obj.DiamondCount;
               
            });
            try {
                await this._hubConnection.start();
                console.log("SignalR Connected.");
            } catch (error) {
                console.error("连接失败，服务端未开启或地址错误:", error);
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
                    
        } 
    async getAssent(){
        try {
            this._hubConnection.invoke("GetStageData")
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

// class StageData {
//     GoldCount:number;
//     EnergyCount:number;
//     DiamondCount:number;
//     constructor() {
   
//     }
// }