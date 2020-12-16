export interface UserNewsObject {
  usernews_id: string;
  users_news_title: string;
  usernews_text: string;
  usermedia_type: string;
  usernews_image: string;
  usernews_video: string;
  usernews_date: string;
  usernews_createdate?: any;
  usernews_status: string;
  usernews_uid: string;
}

export interface categoryNewsObject {
  news_id: string;
  news_title: string;
  news_cid: string;
  news_tid: string;
  news_text: string;
  media_type: string;
  news_image: string;
  news_video?: any;
  news_url: string;
  news_date: string;
  news_createdate: string;
  news_aid: string;
  news_refid?: any;
  news_status: string;
  news_update: string;
  news_posttype: string;
  news_trending: string;
  news_topstories: string;
  news_linkurl: string;
  news_postdate: string;
  news_factcheck: string;
  news_flipads: string;
  news_flipimg: string;
}
