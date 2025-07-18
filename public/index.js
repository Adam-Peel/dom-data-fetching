const loadUsersButton = document.getElementById("load-users");
let showPostButtons;
const resultList = document.getElementById("results-list");
const filterBox = document.getElementById("filter-area-box");
const filterAreaButton = document.getElementById("filter-area-button");
const statusMessage = document.getElementById("status-message");
const namesLookup = {};

function getUsers(event) {
  resultList.innerHTML = "";
  filterBox.innerHTML = "";
  statusMessage.classList.add("loading-message");
  statusMessage.innerHTML = "Loading...";

  event.preventDefault();
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => {
      statusMessage.innerHTML = "";
      statusMessage.classList.remove("error-message", "loading-message");
      return response.json();
    })
    .then((body) =>
      body.forEach((user) => {
        const { id, name } = user;
        namesLookup[id] = name.toLowerCase();
        const userItem = document.createElement("li");
        userItem.classList.add("user-card");
        userItem.setAttribute("id", `card-${id}`);
        const userName = document.createElement("h2");
        userName.classList.add("username");
        userName.innerHTML = name;
        const userButton = document.createElement("button");
        userButton.classList.add("show-user-post-button");
        userButton.setAttribute("id", `button-${id}`);
        userButton.innerHTML = "Show Posts";
        const postContainer = document.createElement("ul");
        postContainer.classList.add("user-post-container");
        postContainer.setAttribute("id", `post-container-${id}`);
        userItem.append(userName, userButton, postContainer);
        resultList.append(userItem);
      })
    )
    .then(() => {
      const filterInputBox = document.createElement("input");
      const filterButton = document.createElement("button");
      filterButton.setAttribute("id", "filter-button");
      filterButton.innerHTML = "Clear Filter";
      filterAreaButton.append(filterButton);
      filterButton.addEventListener("click", resetFilterInput);
      filterInputBox.setAttribute("id", "filter-box");
      filterInputBox.setAttribute("placeholder", "Type here to filter by user");
      filterBox.append(filterInputBox);
      filterInputBox.addEventListener("input", filterPosts);
      showPostButtons = document.getElementsByClassName(
        "show-user-post-button"
      );
      const userButtons = [...showPostButtons];
      userButtons.forEach((button) => {
        button.addEventListener("click", getPosts);
      });
      document.getElementById("load-users").classList.add("hidden-card");
    })
    .catch((err) => {
      statusMessage.innerHTML = err;
      statusMessage.classList.add("error-message");
    });
}

function filterPosts(event) {
  let hideCount = Object.keys(namesLookup).length;
  console.log(this.value);
  for (const key in namesLookup) {
    if (!namesLookup[key].includes(this.value.toLowerCase())) {
      document.getElementById(`card-${key}`).classList.add("hidden-card");
      hideCount--;
    } else {
      document.getElementById(`card-${key}`).classList.remove("hidden-card");
      hideCount++;
    }
  }
  if (hideCount === 0) {
    statusMessage.innerHTML = "No users found";
    statusMessage.classList.add("error-message");
  } else {
    statusMessage.innerHTML = "";
    statusMessage.classList.remove("error-message");
  }
}

function getPosts(event) {
  event.preventDefault();
  const id = event.srcElement.attributes.id.value.slice(7);
  if (document.getElementById(`button-${id}`).innerHTML === "Show Posts") {
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`)
      .then((response) => {
        return response.json();
      })
      .then((posts) => {
        posts.forEach((post) => {
          const { title, body } = post;
          const displayedPost = document.createElement("li");
          displayedPost.classList.add("displayed-post");
          const postTitle = document.createElement("h3");
          postTitle.classList.add("displayed-post-title");
          postTitle.innerHTML = title;
          const postBody = document.createElement("p");
          postBody.classList.add("displayed-post-body");
          postBody.innerHTML = body;
          displayedPost.append(postTitle, postBody);
          const userPostContainer = document.getElementById(
            `post-container-${id}`
          );
          userPostContainer.append(displayedPost);
          const activeButton = document.getElementById(`button-${id}`);
          activeButton.innerHTML = "Hide Posts";
        });
      });
  } else {
    document.getElementById(`button-${id}`).innerHTML = "Show Posts";
    document.getElementById(`post-container-${id}`).innerHTML = "";
  }
}

function resetFilterInput() {
  if (document.getElementById("filter-box").value !== "") {
    document.getElementById("filter-box").value = " ";
    const cards = document.getElementsByClassName("hidden-card");
    Array.from(cards).forEach((card) => {
      card.classList.remove("hidden-card");
    });
    for (const key in namesLookup) {
      document.getElementById(`post-container-${key}`).innerHTML = "";
      document.getElementById(`button-${key}`).innerHTML = "Show Posts";
    }
    statusMessage.innerHTML = "";
    statusMessage.classList.remove("error-message");
  }
  document.getElementById("load-users").classList.add("hidden-card");
}

loadUsersButton.addEventListener("click", getUsers);
