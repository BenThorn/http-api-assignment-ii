const parseJSON = (xhr, content) => {
  //parse response (obj will be empty in a 204 updated)
  const obj = JSON.parse(xhr.response);
  console.dir(obj);
  
  //if message in response, add to screen
  if(obj.message) {
    const p = document.createElement('p');
    p.textContent = `Message: ${obj.message}`;
    content.appendChild(p);
  }
  
  //if users in response, add to screen
  if(obj.users) {
    const userList = document.createElement('p');
    const users = JSON.stringify(obj.users);
    userList.textContent = users;
    content.appendChild(userList);
  }
};

const handleResponse = (xhr, parseResponse) => {
  const content = document.querySelector('#content');
  
  switch(xhr.status) {
    case 200: //if success
      content.innerHTML = `<b>Success</b>`;
      break;
    case 201: //if created
      content.innerHTML = `<b>Create</b>`;
      break;
    case 204: //if updated
      content.innerHTML = '<b>Updated (No Content)</b>';
      break;
    case 400: //if bad request
      content.innerHTML = `<b>Bad Request</b>`;
      break;
    case 404: //if not found
      content.innerHTML = `<b>Resource Not Found</b>`;
      break;
    default: //any other status
      content.innerHTML = `Error code not implemented by client.`;
      break;
  }
  if(parseResponse && xhr.status !== 204) {
    parseJSON(xhr, content);
  }
};

const requestUpdate = (e, userForm) => {
  const url = userForm.querySelector('#urlField').value;
  const method = userForm.querySelector('#methodSelect').value;
  
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');
  if(method == 'get') {
    xhr.onload = () => handleResponse(xhr, true);
  } else {
    xhr.onload = () => handleResponse(xhr, false);
  }

  xhr.send();

  e.preventDefault();
  return false;
};

const requestAdd = (e, nameForm) => {
  const url = '/addUser';
  const method = 'post';
  const nameField = nameForm.querySelector("#nameField");
  const ageField = nameForm.querySelector("#ageField");

  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => handleResponse(xhr, true);

  const formData = `name=${nameField.value}&age=${ageField.value}`;
  
  xhr.send(formData);

  e.preventDefault();
  return false;
};

const requestSearch = (e, searchForm) => {
  const term = 'water'; //HARD CODED REMOVE
  const url = `/search?term=${term}`;
  const method = 'get';

  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => handleResponse(xhr, true);

  xhr.send();
  
  e.preventDefault();
  return false;
};

const init = () => {
  const userForm = document.querySelector("#userForm");
  const nameForm = document.querySelector("#nameForm");
  const searchForm = documetn.querySelector("#searchForm");

  const userRequest = (e) => requestUpdate(e, userForm);
  const addRequest = (e) => requestAdd(e, nameForm);
  const searchRequest = (e) => requestSearch(e, searchForm);

  userForm.addEventListener('submit', userRequest);
  nameForm.addEventListener('submit', addRequest);
  searchForm.addEventListener('submit', searchRequest);
};

window.onload = init;