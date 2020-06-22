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

export interface uploadStoryPayload {
  posting_images: string[];
  ntitle: string;
  ntext: string;
  nmtype: string;
  nuid: number;
  videoFiles?: string;
}

const API = {
  userLogin: (payload: UserLoginPayload) =>
    axios.post(`${URL_API}/News2/api/userlogin.php`, payload),
  userSignUp: (payload: UserSignupPayload) =>
    axios.post(`${URL_API}/News2/api/usersave.php`, payload),
  getNews: () => axios.get(`${URL_API}/News2/api/allnews.php`),
  getCategories: () => axios.get(`${URL_API}/News2/api/catp.php`),
  getNewsByCategory: (category: string) =>
    axios.get(`${URL_API}/News2/api/news.php?cat=${category}`),
  userStoryUpload: (file: FormData) =>
    axios({
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      url: `${URL_API}/News2/api/usernewssave.php`,
      data: file,
    }),
  userReportStory: (file: uploadStoryPayload) =>
    axios.post(`${URL_API}/News2/api/usernewssave.php`, file),
};

export default API;
