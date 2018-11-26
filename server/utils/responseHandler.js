const handleResponse = (result, nextCb, response, statusCode, message) => {
  if (result instanceof Error) {
    nextCb(result);
  } else {
    response.status(statusCode).json({ status: 'success', message, data: result });
  }
};

export default handleResponse;
