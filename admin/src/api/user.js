import fetchData from './fetchData';
import * as config from '../config/config.json';

export default {
  getUserInfo: () => fetchData({ method: 'GET', needAuth: true, url: `${config.baseUrl}/users/info` })
};