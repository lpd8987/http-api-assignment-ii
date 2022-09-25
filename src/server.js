// Server information and variables
const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// POST - string together chunks of data as they are received by the server
const parseContent = (request, response, handlerFunction) => {
  const content = [];

  request.on('error', () => {
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (dataChunk) => {
    content.push(dataChunk);
  });

  request.on('end', () => {
    const contentString = Buffer.concat(content).toString();
    const params = query.parse(contentString);

    handlerFunction(request, response, params);
  });
};

const handlePOST = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/addUser') {
    parseContent(request, response, jsonHandler.jsonPOSTUser);
  }
};

// GET - redirect depending on the URL
const handleGET = (request, response, parsedURL) => {
  switch (parsedURL.pathname) {
    case '/style.css': // get the css styles
      htmlHandler.getStyle(request, response);
      break;
    case '/getUsers': // get user data
      jsonHandler.jsonGETUsers(request, response);
      break;
    case '/': // get the index page
      htmlHandler.getIndex(request, response);
      break;
    default: // data not found or going to undefined page
      jsonHandler.notFoundGET(request, response);
      break;
  }
};

// HEAD - redirect depending on URL, not as many URLs for HEAD
const handleHEAD = (request, response, parsedURL) => {
  switch (parsedURL.pathname) {
    case '/getUsers': // return users head data
      jsonHandler.jsonHEADUsers(request, response);
      break;
    default: // head data not found
      jsonHandler.notFoundHEAD(request, response);
      break;
  }
};

// Route requests to the server depending on the method requested
const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  switch (request.method) {
    case 'POST':
      handlePOST(request, response, parsedURL);
      break;
    case 'HEAD':
      handleHEAD(request, response, parsedURL);
      break;
    case 'GET':
    default:
      handleGET(request, response, parsedURL);
      break;
  }
};

// Startup server
http.createServer(onRequest).listen(port, () => {
  // console.log(`Listening on port 127.0.0.1:${port}`);
});
