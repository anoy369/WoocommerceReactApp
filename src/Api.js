import axios from "axios"
import CryptoJS from "crypto-js"

const CONSUMER_KEY = "ck_df4124a049211dff8e20f4c83c157aade2811133"
const CONSUMER_SECRET = "cs_7d5d6987333d91fdc1b186b16e39e9f4394e7722"

const PROJECT_URL = "https://woocommerceapp.anoy369.com/"
const API_URL = PROJECT_URL + "wp-json/wc/v3"

const WP_USER_API_URL = `${PROJECT_URL}wp-json/wp/v2/users`
const username = 'admin';
const appPassword = '-6s3HKr2v8Lucqc';

let loadingCount = 0;
const LOADER_EVENT_NAME = 'api_loading_change';
const listeners = [];

// Function to notify all listeners of loader state change
function notifyLoadingStateChange() {
  const isLoading = loadingCount > 0;
  listeners.forEach((callback) => callback(isLoading));
}

// Function to add listener
export function onLoadingChange(callback) {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

// Function to generate OAuth signature
const generateOAuthSignature = (url, method = 'GET', params = {}) => {
  const nonce = Math.random().toString(36).substring(2);
  const timestamp = Math.floor(Date.now() / 1000);

  const oauthParams = {
    oauth_consumer_key: CONSUMER_KEY,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_version: '1.0',
  };

  const allParams = { ...oauthParams, ...params };

  const paramString = Object.keys(allParams)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
    .join('&');

  const baseUrl = url.split('?')[0]; // Ensure no query params in the base URL
  const baseString = `${method.toUpperCase()}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(CONSUMER_SECRET)}&`;

  const signature = CryptoJS.HmacSHA1(baseString, signingKey).toString(CryptoJS.enc.Base64);

  return { ...oauthParams, oauth_signature: encodeURIComponent(signature) };
};

const api = axios.create({
    baseURL : API_URL
})

// Add interceptors to manage loader state
api.interceptors.request.use(
  (config) => {
    loadingCount++;
    notifyLoadingStateChange();
    return config;
  },
  (error) => {
    loadingCount--;
    notifyLoadingStateChange();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    loadingCount--;
    notifyLoadingStateChange();
    return response;
  },
  (error) => {
    loadingCount--;
    notifyLoadingStateChange();
    return Promise.reject(error);
  }
);

// Get all products from woocomerce store
export const getAllProducts = async() => {
    try{
        const url = `${API_URL}/products`
        const oauthParams = generateOAuthSignature(url)
        const response = await api.get("/products", {
            params: oauthParams
        })

        return response.data

    }catch(error){
        console.log(error)
    }
}

// Get Single Product Data 
export const getSingleProductData = async(productID) => {
    try{
        const url = `${API_URL}/products/${productID}`
        const oauthParams = generateOAuthSignature(url)
        const response = await api.get(`/products/${productID}`, {
            params: oauthParams
        })

        return response.data

    } catch(error) {
        console.log(error)
    }
}

//Register user api
export const registerStoreUser = async(userInfo) => {

  try{
    const response = await api.post( WP_USER_API_URL, userInfo, {
      headers: {
        "Authorization": "Basic " + btoa("admin:-6s3HKr2v8Lucqc")
      }
    })

    return response.data

  } catch(error){
    console.log(error)
  }

}