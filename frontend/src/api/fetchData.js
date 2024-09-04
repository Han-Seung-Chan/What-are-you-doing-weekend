const requestGET = async (url) => {
  return;
  const res = await fetch(url);

  if (res.ok) {
    const json = await res.json();
    return json;
  }

  throw new Error('요청 실패');
};

const requestPOST = async (url, body) => {
  return;
  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      ...body,
    }),
  })
    .then((response) => response.json())
    .then((result) => console.log(result));
};

export const fetchContents = async (target, method, body = {}) => {
  if (method === 'GET') await requestGET(`http://localhost:5001/${target}`);
  else if (method === 'POST')
    await requestPOST(`http://localhost:5001/${target}`, body);
};
