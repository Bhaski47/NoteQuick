export type failedResponse = {
    status:number,
    message:string
}

export type loginAuthRespnse = {
    status_code:number,
    message:string,
    other_message:string,
    data:null
}

export type loginResponse =  failedResponse | loginAuthRespnse;

