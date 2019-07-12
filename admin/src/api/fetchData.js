import axios from 'axios';

import { getUserToken } from '../helpers/token';

const fetchData = async ({ needAuth, ...requestParams }) => {
  try {
    const { data } = await axios(
      needAuth
        ? { ...requestParams, headers: { ...requestParams.headers, Authorization: `Bearer ${getUserToken()}` } }
        : requestParams
    );

    return data;
  } catch (err) {
    if (err.response.status === 401) {
      return { data: null };
    }
    console.error('Error: unable to fetch data.', err);
    throw err;
  }
};

export default fetchData;
