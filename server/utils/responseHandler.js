const handleResponse = (result, nextCb, response, statusCode, statusMessage, message) => {
  if (result instanceof Error) {
    nextCb(result);
  } else {
    response.status(statusCode).json({ status: statusMessage, message, data: result });
  }
};

export default handleResponse;
