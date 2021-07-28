import axios, { CancelTokenSource } from "axios";

export const fileRequestConfig = {
  headers: { "content-type": "multipart/form-data" },
};

export const createCancelToken = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return source;
};

export const cancelRequest = (source: CancelTokenSource, message?: string) => {
  source.cancel(message ?? "");
};
