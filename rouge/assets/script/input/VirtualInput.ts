import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 虚拟摇杆的输入
 * 避免和 `input` 重名使用 VirtualInput
 */
@ccclass('VirtualInput')
export class VirtualInput {

   
    static vertical: number = 0;
    static horizontal: number = 0;      
}

