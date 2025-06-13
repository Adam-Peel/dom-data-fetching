const loadUsersButton = document.getElementById("load-users");
const resultList = document.getElementById("results-list");
const statusMessage = document.getElementById("status-message");

function getUsers(event) {
  event.preventDefault();
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((body) =>
      body.forEach((user) => {
        const { name } = user;
        const userItem = document.createElement("li");
        userItem.classList.add("user-card");
        const userName = document.createElement("h2");
        userName.classList.add("username");
        userName.innerHTML = name;

        userItem.append(userName);
        resultList.append(userItem);
      })
    )
    .catch((err) => {
      statusMessage.innerHTML = err;
      statusMessage.classList.add("error-message");
    });
}

loadUsersButton.addEventListener("click", getUsers);

/*
loading...

no response (network issue etc.)
no users in response







address
: 
{street: 'Kulas Light', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998-3874', geo: {…}}
company
: 
{name: 'Romaguera-Crona', catchPhrase: 'Multi-layered client-server neural-net', bs: 'harness real-time e-markets'}
email
: 
"Sincere@april.biz"
id
: 
1
name
: 
"Leanne Graham"
phone
: 
"1-770-736-8031 x56442"
username
: 
"Bret"
website
: 
"hildegard.org"

*/
