export interface Cloud {
  uniIdCo: uniIdCo
  [key: string]: any,
  adminRouter: (action: string, data?: anyObj) => Promise<anyObj> 
}

export interface uniIdCo {
  login: (data: anyObj) => Promise<anyObj>
}

