import axios from 'axios';
import {Log} from 'src/utils/helper';
var qs = require('qs');

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
  user_type: number;
}

export interface UserSignupPayload {
  uname: string;
  upass: string;
  user_type: number;
  ufname: string;
  uphone: string;
  uemail: string;
}

export interface uploadStoryPayload {
  posting_images: string[];
  ntitle: string;
  ntext: string;
  nmtype: string;
  nuid: number;
  videoFiles?: string;
}

export interface newsByCategory {
  nuid?: number;
  ncate: Array<number>;
  posttype: number;
  startindex: number;
  size: number;
}

export interface getConstituenciesPayload {
  stateId: number;
  districtId: number;
}
export interface getDistrictsPayload {
  state_id: string;
}

export interface userComplaintsPayload {
  posting_images: string[];
  title: string;
  description: string;
  stateId: number;
  nuid: number;
  videoFiles?: string[];
  districtId: number;
  constituencyId: number;
}
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};
const API = {
  userLogin: (payload: UserLoginPayload) =>
    axios.post(
      `${URL_API}/News2/api/userlogin.php`,
      qs.stringify(payload),
      config,
    ),
  userSignUp: (payload: UserSignupPayload) =>
    axios.post(
      `${URL_API}/News2/api/usersave.php`,
      qs.stringify(payload),
      config,
    ),
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

  newsByCategory: (payload: newsByCategory) =>
    axios.post(`${URL_API}/News2/api/news.php`, payload),

  getConstituencies: (payload: getConstituenciesPayload) =>
    axios.post(
      `${URL_API}/News2/api/getconstituency.php`,
      qs.stringify(payload),
      config,
    ),

  postUserComplaints: (file: FormData) =>
    axios({
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      url: `${URL_API}/News2/api/complains.php`,
      data: file,
    }),

  getStates: () => axios.get(`${URL_API}/News2/api/getstates.php`),
  getDistricts: (payload: getDistrictsPayload) =>
    axios.post(
      `${URL_API}/News2/api/getdistricts.php`,
      qs.stringify(payload),
      config,
    ),
};

export default API;
