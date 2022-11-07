import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.1.109:3333", //android tem que ser o ip
  // baseURL: "http://localhost:3333", //ios aceita localhost
});
