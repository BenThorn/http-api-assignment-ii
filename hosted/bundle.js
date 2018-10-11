'use strict';

var parseJSON = function parseJSON(xhr, content) {
  //parse response (obj will be empty in a 204 updated)
  var obj = JSON.parse(xhr.response);
  console.dir(obj);

  //if message in response, add to screen
  if (obj.message) {
    var p = document.createElement('p');
    p.textContent = 'Message: ' + obj.message;
    content.appendChild(p);
  }

  //if users in response, add to screen
  if (obj.users) {
    var userList = document.createElement('p');
    var users = JSON.stringify(obj.users);
    userList.textContent = users;
    content.appendChild(userList);
  }
};

var handleResponse = function handleResponse(xhr, parseResponse) {
  var content = document.querySelector('#content');

  switch (xhr.status) {
    case 200:
      //if success
      content.innerHTML = '<b>Success</b>';
      break;
    case 201:
      //if created
      content.innerHTML = '<b>Create</b>';
      break;
    case 204:
      //if updated
      content.innerHTML = '<b>Updated (No Content)</b>';
      break;
    case 400:
      //if bad request
      content.innerHTML = '<b>Bad Request</b>';
      break;
    case 404:
      //if not found
      content.innerHTML = '<b>Resource Not Found</b>';
      break;
    default:
      //any other status
      content.innerHTML = 'Error code not implemented by client.';
      break;
  }
  if (parseResponse && xhr.status !== 204) {
    parseJSON(xhr, content);
  }
};

var requestUpdate = function requestUpdate(e, userForm) {
  var url = userForm.querySelector('#urlField').value;
  var method = userForm.querySelector('#methodSelect').value;

  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');
  if (method == 'get') {
    xhr.onload = function () {
      return handleResponse(xhr, true);
    };
  } else {
    xhr.onload = function () {
      return handleResponse(xhr, false);
    };
  }

  xhr.send();

  e.preventDefault();
  return false;
};

var requestAdd = function requestAdd(e, nameForm) {
  var url = '/addUser';
  var method = 'post';
  var nameField = nameForm.querySelector("#nameField");
  var ageField = nameForm.querySelector("#ageField");

  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr, true);
  };

  var formData = 'name=' + nameField.value + '&age=' + ageField.value;

  xhr.send(formData);

  e.preventDefault();
  return false;
};

var requestSearch = function requestSearch(e, searchForm) {
  var term = 'water'; //HARD CODED REMOVE
  var url = '/search?term=' + term;
  var method = 'get';

  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr, true);
  };

  xhr.send();

  e.preventDefault();
  return false;
};

var init = function init() {
  var userForm = document.querySelector("#userForm");
  var nameForm = document.querySelector("#nameForm");
  var searchForm = documetn.querySelector("#searchForm");

  var userRequest = function userRequest(e) {
    return requestUpdate(e, userForm);
  };
  var addRequest = function addRequest(e) {
    return requestAdd(e, nameForm);
  };
  var searchRequest = function searchRequest(e) {
    return requestSearch(e, searchForm);
  };

  userForm.addEventListener('submit', userRequest);
  nameForm.addEventListener('submit', addRequest);
  searchForm.addEventListener('submit', searchRequest);
};

window.onload = init;
