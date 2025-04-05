const statusMaps: { [key: number]: string } = {
  200: "OK",
  201: "Created",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

interface FetchDataInterface {
  url: string;
  method?: string;
  body?: string;
  headers?: any;
}
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const fetchData = async ({
  url,
  method,
  body,
  headers,
}: FetchDataInterface) => {
  var heads = {}
  if (method == "POST" || "PUT" || "PATCH") {
    heads = {
      ...heads,
      "Content-Type":"application/json"
    }
  }
  const res = await fetch(`${BACKEND_URL}${url}`, {
    method,
    headers:{
      ...heads,
      ...headers
    },
    body,
  });
  if (!res.ok) {
    const message = statusMaps[res.status];
    throw new Error(message);
  }
  const data = await res.json();
  return data;
};
