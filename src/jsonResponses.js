const users = {};

// GET Methods
const jsonGETData = (request, response, status, jsonObj) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(jsonObj));
  response.end();
};

const jsonGETUsers = (request, response) => {
  const responseObj = {
    users,
  };

  return jsonGETData(request, response, 200, responseObj);
};

const notFoundGET = (request, response) => {
  const responseObj = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  jsonGETData(request, response, 404, responseObj);
};

// HEAD Methods
const jsonHEADData = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const jsonHEADUsers = (request, response) => {
  const responseObj = {
    users,
  };

  return jsonHEADData(request, response, 200, responseObj);
};

const notFoundHEAD = (request, response) => jsonHEADData(request, response, 404);

// POST Method
const jsonPOSTUser = (request, response, body) => {
  // default response assumes user has not passed in one or both of the correct parameters
  const responseObj = {
    message: 'Missing required params.',
  };

  // if one or both params are missing, return out of method with Bad Request error
  if (!body.name || !body.age) {
    responseObj.id = 'missingParams';
    return jsonGETData(request, response, 400, responseObj);
  }

  // if the method gets to this point, it assumes the user has provided both correct params
  let status = 204;

  // if the user does not already exist, create a new one
  if (!users[body.name]) {
    status = 201; // change the status to 201 since new data is being added
    users[body.name] = {};
  }

  // assign data to new object if it did not already exist, or update it
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  // add a message if the user was just added, as 204 messages do not have a body
  if (status === 201) {
    responseObj.message = 'Created Successfully';
    return jsonGETData(request, response, status, responseObj);
  }

  return jsonHEADData(request, response, status);
};

module.exports = {
  jsonGETUsers,
  jsonHEADUsers,
  notFoundGET,
  notFoundHEAD,
  jsonPOSTUser,
};
