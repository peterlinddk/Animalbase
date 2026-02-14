import http from "node:http";
import fs from "node:fs/promises";

// set the port for the server to listen to
const port = 8080;
const filepath = "data/animals.json";

// load file before starting the server
const data = await loadJSONfile();

async function loadJSONfile() {
  const file = await fs.open(filepath);
  const rawdata = await fs.readFile(file, { encoding: "UTF-8" });
  file.close();
  return JSON.parse(rawdata);
}

// create a server, and set the function to run when receiving requests
const app = http.createServer(async (request, response) => {
  console.log("URL   : " + request.url);
  console.log("METHOD: " + request.method);

  if (request.url === "/" && request.method === "GET") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");
    response.end("AnimalBase - simple REST API backend\nUse path /animals for CRUD operations!");
  } else if (request.url === "/animals" || request.url.startsWith("/animals/")) {
    // cut base-route from url to make it easier to deduce ids
    const url = request.url.substring("/animals/".length);
    // this means that "url" now contains anything AFTER /animals/ - so basically the id :) or an empty string ...

    // determine if we actually have an id, and in that case, get the number
    const id = url.length === 0 ? undefined : Number(url);
    // keep the id as "undefined" if no number is present.

    console.log("in the /animals route ...");

    if (request.method === "GET") {
      // if no id is given, return all, otherwise return only element with that id
      if (id === undefined) { // NOTE: Needs to check with === to avoid converting id=0 to 'undefined'
        sendJSONResponse(response, data);
      } else {
        // find element with that id
        const animal = data.find(a => a.id === id);
        if (animal) {
          sendJSONResponse(response, animal);
        } else {
          sendErrorResponse(response, { message: `No animal with id '${url}' found.` });
        }
      }
    } else if (request.method === "POST") {
      // get the object-data from the request-body
      let body = await receiveJSONbody(request);

      // find next available id
      const nextId = data.reduce((acc, cur) => (cur.id > acc ? cur.id : acc), 0) + 1;

      // store in object, and then store in data
      body.id = nextId;
      data.push(body);

      // and save the file
      fs.writeFile(filepath, JSON.stringify(data));

      // response with created - and the object
      response.statusCode = 201;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(body));
    } else if (request.method === "PUT") {
      if (id !== undefined) {
        // find element with that id
        const oldData = data.find(a => a.id === id);

        // and only continue if that element actually exists
        if (oldData) {
          // get the object-data from the request-body
          const newData = await receiveJSONbody(request);

          // update all properties
          oldData.name = newData.name;
          oldData.type = newData.type;
          oldData.desc = newData.desc;
          oldData.age = newData.age;
          oldData.winner = newData.winner;
          oldData.star = newData.star;

          // and re-write file
          fs.writeFile(filepath, JSON.stringify(data));

          // before sending the response
          sendJSONResponse(response, oldData);
        } else {
          sendErrorResponse(response, { message: `No animal with id '${url}' found.` });
        }
      }
    } else if (request.method === "PATCH") {
      if (id !== undefined) {
        // find element with that id
        const oldData = data.find(a => a.id === id);
        // and only continue if it exists
        if (oldData) {
          // get new object-data from the request-body
          const newData = await receiveJSONbody(request);
          // usually this would only be either 'winner' or 'star' but we'll just accept every property - except id
          for (const prop in newData) {
            if (prop != "id") {
              oldData[prop] = newData[prop];
            }
          }

          // and re-write file
          fs.writeFile(filepath, JSON.stringify(data));
          // before sending the response
          sendJSONResponse(response, oldData);
        } else {
          sendErrorResponse(response, { message: `No animal with id '${url}' found.` });
        }
      }
    } else if (request.method === "DELETE") {
      // find element with that id - but just the index, not the entire element
      const index = data.findIndex(a => a.id === id);

      if (index != -1) {
        // remove element with index from the list
        data.splice(index, 1);
        // and re-write the file
        fs.writeFile(filepath, JSON.stringify(data));

        // and respond with a 204 No Content
        response.statusCode = 204
        response.setHeader("Content-Type", "application/json");
        response.end();
      } else {
        sendErrorResponse(response, { message: `No animal with id '${url}' found.` });
      }
    }
  } else {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");
    response.end("AnimalBase - simple REST API backend\nUse path /animals for CRUD operations!");
  }
});

// helper-function to receive the body (expected to be a JSON encoded object) from a request
async function receiveJSONbody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", chunk => (body += chunk));
    request.on("end", () => resolve(JSON.parse(body)));
    request.on("error", reject);
  });
}

// helper-function to send a JSON object with a 200 OK message
function sendJSONResponse(response, object) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(object));
}

// helper-function to send a JSON object with a 404 NOT FOUND message
function sendErrorResponse(response, object) {
  response.statusCode = 404;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(object));
}

// Finally, actually start the server!
app.listen(port, () => {
  console.log(`Server is up and running at http://localhost:${port}`);
});
