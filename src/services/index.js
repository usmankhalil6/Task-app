import axios from "axios";
const url = "http://192.168.16.106:3000/api"; // ADD IPV4 ADDRESS
axios.defaults.baseURL = url;

class Api {
  async getBooks(payload) {
    const { data } = await axios.get(`/books${payload}`);
    return data;
  }
}

export const api = new Api();
