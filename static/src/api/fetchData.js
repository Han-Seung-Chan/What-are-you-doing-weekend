export const requestGET = async (url, data = {}) => {
  $.ajax({
    type: 'GET',
    url: `/api${url}`,
    data: data,
    success(response) {
      if (response['result'] === 'success') {
        console.log(response);
        return;
      } else {
      }
    },
  });
};

export const requestPOST = async (url, data = {}) => {
  $.ajax({
    type: 'POST',
    url: `/api${url}`,
    data: data,
    success(response) {
      if (response['result'] === 'success') {
        console.log(response);

        return;
      } else {
      }
    },
  });
};
