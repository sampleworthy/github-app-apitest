// Function to switch between tabs and highlight active tab
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tabcontent");
    for (const content of tabContents) {
      content.style.display = "none";
    }
  
    const tabLinks = document.getElementsByClassName("tablinks");
    for (const link of tabLinks) {
      link.classList.remove("active");
    }
  
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
  }
  
  // Function to save user configuration (username and token) to local storage
  function saveConfig() {
    const username = document.getElementById("configUsername").value;
    const token = document.getElementById("configToken").value;
    
    if (!username || !token) {
      console.log("Username and token are required.");
      return;
    }
  
    const config = { username, token };
    localStorage.setItem("githubConfig", JSON.stringify(config));
  
    console.log("Configuration saved.");
  }
  
  // Function to load saved user configuration from local storage
  function loadConfig() {
    const config = localStorage.getItem("githubConfig");
    if (config) {
      const { username, token } = JSON.parse(config);
      document.getElementById("configUsername").value = username;
      document.getElementById("configToken").value = token;
    }
  }
  
  // Function to fetch user repositories from GitHub API
  function fetchRepositories() {
    const username = document.getElementById("configUsername").value;
    const token = document.getElementById("configToken").value;
    
    if (!token) {
      console.log("Token not provided.");
      return;
    }
  
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
  
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
  
    fetch(`https://api.github.com/user/repos?type=all`, requestOptions)
      .then(response => response.json())
      .then(data => {
        displayRepositories(data);
        fetchUserInfo(username);
      })
      .catch(error => console.log('error', error));
  }
  
  // Function to display user repositories in the UI
  function displayRepositories(repositories) {
    const repoList = document.getElementById("repoList");
    const repoCount = document.getElementById("repoCount");
  
    repoList.innerHTML = "";
    repoCount.textContent = repositories.length;
  
    repositories.forEach(repo => {
      const listItem = document.createElement("li");
      listItem.textContent = repo.name;
      repoList.appendChild(listItem);
    });
  }
  
  // Function to fetch additional user information from GitHub API
  function fetchUserInfo(username) {
    const myHeaders = new Headers();
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
  
    fetch(`https://api.github.com/users/${username}`, requestOptions)
      .then(response => response.json())
      .then(user => displayUserInfo(user))
      .catch(error => console.log('error', error));
  }
  
  // Function to display user information in the UI
  function displayUserInfo(user) {
    const userInfo = document.getElementById("userInfo");
    userInfo.innerHTML = `
      <h2>User Details</h2>
      <img src="${user.avatar_url}" alt="Profile Picture" width="100">
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Username:</strong> ${user.login}</p>
      <p><strong>Location:</strong> ${user.location}</p>
      <!-- Add more user details as needed -->
    `;
  }
  
  // Load saved configuration when the page loads
  window.addEventListener("load", loadConfig);
  
