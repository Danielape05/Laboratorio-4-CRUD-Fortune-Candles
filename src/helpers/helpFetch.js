
export const helpFetch = () => {
  const customFetch = async (endpoint, options = {}) => {
    const response = await fetch(endpoint, options);

    if (!response.ok) {
      throw new Error(
        `Error en la petición: ${response.status}`
      );
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  };

  return {
    get: (url) => customFetch(url),

    post: (url, data) =>
      customFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }),

    put: (url, data) =>
      customFetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }),

    del: (url) =>
      customFetch(url, {
        method: 'DELETE'
      })
  };
};
