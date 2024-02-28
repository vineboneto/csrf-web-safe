import axios, { AxiosError } from "axios";
import { history } from "./history";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface FailedRequests {
  onSuccess: (token: string) => void;
  onFailure: (err: unknown) => void;
}

let isRefreshing = false;
let failedRequestsQueue: FailedRequests[] = [];

const isTokenExpired = (error: AxiosError<{ err?: string }>) =>
  error?.response?.status === 403 &&
  error?.response?.data?.err === "token.expired";

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ err?: string }>) => {
    const tokenExpired = isTokenExpired(error);

    const originalConfig = error.config;
    if (tokenExpired) {
      if (!isRefreshing) {
        isRefreshing = true;

        api
          .post("/refresh-token")
          .then(({ data: { token } }) => {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            failedRequestsQueue.forEach((request) => request.onSuccess(token));
            failedRequestsQueue = [];
          })
          .catch((err) => {
            failedRequestsQueue?.forEach((request) => request.onFailure(err));
            failedRequestsQueue = [];
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (token: string) => {
            originalConfig!.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalConfig!));
          },
          onFailure: (err) => {
            reject(err);
          },
        });
      });
    }

    if (!tokenExpired) {
      history.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default api;
