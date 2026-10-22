import axios from 'axios';

const baseURL = (
  process.env.NOTEHUB_API_URL || 'https://notehub-api.goit.study'
).replace(/\/$/, '');

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
