// import { _decorator, Button, Component, director, Node } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('client')
// export class client extends Component {
//     socket: WebSocket;
//     serverURL:string = 'ws://localhost:3000'
//      // 初始化 WebSocket 连接
//      initWebSocketConnection() {
//         this.socket = new WebSocket(this.serverURL);

//         this.socket.onopen = (event) => {
//             console.log('WebSocket connected!');
//             // 可以在此处发送初始数据到服务器
//             this.sendWebSocketData("hello");
//         };

//         this.socket.onmessage = (event) => {
//             console.log('Received message:', event.data);
//         };

//         this.socket.onerror = (error) => {
//             console.error('WebSocket error:', error);
//         };

//         this.socket.onclose = (event) => {
//             console.log('WebSocket closed:', event);
//         };
//     }
//      // 发送数据到服务器
//      sendWebSocketData(data) {
//         if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//             this.socket.send(data);
//         }
//     }

//     // 关闭 WebSocket 连接
//     closeWebSocketConnection() {
//         if (this.socket) {
//             this.socket.close();
//         }
//     }
//     // 开始时调用
//     onLoad() {
//         this.initWebSocketConnection();
//     }

//     start(){
//         this.node.on(Button.EventType.CLICK,(event)=>{
//             console.log('click button');
//             this.onClickSendButton();
//         });
//     }
//      // 点击按钮发送数据给服务器
//      onClickSendButton() {
//        let data = 'Hello, Server!';
//         this.sendWebSocketData(data);
//     }

//     // 程序关闭时调用
//     onDestroy() {
//         this.closeWebSocketConnection();
//     }

// }

