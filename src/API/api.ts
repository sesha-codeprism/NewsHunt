import axios from 'axios';
import {Log} from 'src/utils/helper';

// const URL_API = 'www.google.co.in';
const URL_API = 'http://167.71.239.21';
export const AxiosWithToken = axios.create();

AxiosWithToken.interceptors.request.use((request) => requestHandler(request));
AxiosWithToken.interceptors.response.use(
  (response) => response,
  (error) => errorResponseHandler(error),
);

const requestHandler = (request: any) => {
  return request;
};

const errorResponseHandler = (error: any) => {
  const errorResponse = error.response;
  if (errorResponse.status !== 401) {
    return Promise.reject(error);
  }
  return Promise.reject(error);
};
export interface UserLoginPayload {
  uname: string;
  upass: string;
}

export interface UserSignupPayload {
  ufname: string;
  uname: string;
  upass: string;
  uphone: string;
}

const API = {
  userLogin: (payload: UserLoginPayload) =>
    axios.post(`${URL_API}/News2/api/userlogin.php`, payload),
  userSignUp: (payload: UserSignupPayload) =>
    axios.post(`${URL_API}/News2/api/usersave.php`, payload),
  getNews: () => axios.get(`${URL_API}/News2/api/allnews.php`),
};

export default API;
