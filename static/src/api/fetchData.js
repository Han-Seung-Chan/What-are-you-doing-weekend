export const requestGET = async (url, data = {}) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: `/api${url}`,
      data: data,
      success(res) {
        if (res['result'] === 'success') {
          resolve(res.data);
        } else {
          reject(new Error('Request failed with result: ' + res['result']));
        }
      },
      error(err) {
        reject(err);
      },
    });
  });
};

export const requestPOST = async (url, data = {}) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'POST',
      url: `/api${url}`,
      data: data,
      success(res) {
        if (res['result'] === 'success') {
          resolve(res.data);
        } else {
          reject(new Error('Request failed with result: ' + res['result']));
        }
      },
      error(err) {
        reject(err);
      },
    });
  });
};
