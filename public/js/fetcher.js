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
    console.log(res);
    return await res.json();
  } catch (e) {
    console.log(e);
    throw new Error("error occur");
  }
};

const request = () => {
  return {
    get: async (url) => {
      try {
        const res = await fetch(url);
        console.log(res);
        return await res.json();
      } catch (e) {
        console.log(e);
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
