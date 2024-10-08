import { _decorator, Button, Component, director, Node } from 'cc';
import * as signalR from '@microsoft/signalr';//  导入 SignalR

const { ccclass, property } = _decorator;

@ccclass('SignalClient')
export class SignalClient extends Component {
    
    // connection: signalR.HubConnection=null; // 定义连接属性

    onLoad() {
        // const connection = new signalR.HubConnectionBuilder()
        //    // .withUrl("http://localhost:5240/chathub")
        //    .withUrl("/chathub")
        //     .build();

        //     connection.start()
        //     .then(() => console.log("Connected to SignalR hub"))
        //     .catch(err => console.error("Connection failed: ", err));

                const connection = new signalR.HubConnectionBuilder()
                .withUrl("/chathub")
                .build();
            

                //绑定消息回调函数
                connection.on("StoCMessage", function (msg) {
                console.log("StoCMessage", msg.user, msg.message)
                });

                //开始连接
                connection.start().then(function () {
                //发送消息
                var user = "test";
                var message = "Hello world!!!";
                connection.invoke("CtoSMessage", { user, message }).catch(function (err) {
                    return console.error(err.toString());
                });
                }).catch(function (err) {
                return console.error(err.toString());
                });


    }
}
