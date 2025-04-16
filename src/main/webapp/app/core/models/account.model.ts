
export interface Account {
  fullname: string | null,
  username: string,
  email: string,
  status: boolean,
  authorities: string[],
  deviceId: string | null
}
