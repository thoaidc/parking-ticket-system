
export interface Account {
  fullname: string | null,
  email: string | null,
  username: string,
  status: boolean,
  authorities: string[],
  deviceId: string | null
}
