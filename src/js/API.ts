import axios from "axios";
import { BloggerInfo } from "../components/BloggerEntry/BloggerEntry";

const baseURL = "http://localhost:3000";

export function fetchBloggers(page: number, perPage = 5) {
  return axios.get(`${baseURL}/bloggers?_page=${page}&_limit=${perPage}`);
}


export function postBlogger(newBlogger: BloggerInfo) {
  
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(`${baseURL}/bloggers`, newBlogger, config);
}
