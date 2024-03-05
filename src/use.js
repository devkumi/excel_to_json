import axios from 'axios';

function postRequest(apiUrl, requestData, callback) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    }
  };
  axios.post(`https://szsssz2r-3000.euw.devtunnels.ms/Api/${apiUrl}`, requestData, config)
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}


export { postRequest};
