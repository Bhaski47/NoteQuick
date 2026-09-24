export type failedResponse = {
    status_code: number;
    message: string;
};

export type loginAuthRespnse = {
    status_code: number;
    message: string;
    other_message: string;
    data: null;
};

export type loginResponse = failedResponse | loginAuthRespnse;

