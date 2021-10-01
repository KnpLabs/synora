export const createToken = params => window.btoa(JSON.stringify(params))
export const decodeToken = token => JSON.parse(window.atob(token))
