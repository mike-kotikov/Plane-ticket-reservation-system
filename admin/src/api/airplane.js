import * as axios from 'axios';

import * as config from '../config/config.json';
import { getUserToken } from '../helpers/token';

export default {
  getAirplanes: async params => {
    try {
      const token = getUserToken();
      const airplanes = await axios.get(`${config.adminUrl}/airplanes`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      return airplanes.data;
    } catch (err) {
      console.error('Error: unable to get airplanes.', err);
      throw err;
    }
  },

  addAirplane: async airplane => {
    try {
      const token = getUserToken();
      return await axios.post(`${config.adminUrl}/airplanes`, {
        headers: { Authorization: `Bearer ${token}` },
        data: airplane
      });
    } catch (err) {
      console.error('Error: unable to add new airplane.', err);
      throw err;
    }
  }
};