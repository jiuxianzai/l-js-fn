/**
 * 主应用往子应用发送消息
 */
export class AppToSubRPC {
  constructor(private win: Window) {}

  /**
   * 调用子应用的方法
   * @param eventName - 事件名称
   * @param data - 参数(可选)
   */
  call(eventName:string, data?:any){
    
  }
}
