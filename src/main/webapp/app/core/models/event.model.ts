export interface EventCustom<T> {
  name: string;
  content: T;
}

export interface SocketSpringMessageCus {
  status: boolean;
  message: string;
}
