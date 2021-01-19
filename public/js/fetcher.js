const push = async (url, method, data, headers) => {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (e) {
    throw e;
  }
};

const request = () => {
  return {
    get: async (url) => {
      try {
        const res = await fetch(url);
        return await res.json();
      } catch (e) {
        throw e;
      }
    },
    push,
    post: async (url, data, headers) => push(url, "POST", data, headers),
    put: async (url, data, headers) => push(url, "PUT", data, headers),
    patch: async (url, data, headers) => push(url, "PATCH", data, headers),
    delete: async (url, data, headers) => push(url, "DELETE", data, headers),
  };
};

const fetcher = request();
