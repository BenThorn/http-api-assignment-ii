const users = {};

const respondJSON = (requestAnimationFrame, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};

module.exports = {
  getUsers
};