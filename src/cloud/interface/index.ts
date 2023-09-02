export interface Cloud {
  uniIdCo: uniIdCo
  [key: string]: any,
}

export interface uniIdCo {
  login: (data: anyObj) => Promise<anyObj>
}

