const loadingSpinner = document.querySelector("#loadingSpinner");
const mainContainer = document.querySelector("#mainContainer");

const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");

const usersTitle = document.querySelector("#users-title");
const usersContent = document.querySelector("#users-content");

const statisticsTitle = document.querySelector("#statistics-title");
const statisticsContent = document.querySelector("#statistics-content");

const finalData = [];

const loadAndFilterAllUsableData = async () => {
  const crudeData = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );

  const { results } = await crudeData.json();

  const mapToFinalData = results.map((user) => {
    finalData.push({
      name: `${user.name.first} ${user.name.last}`,
      age: user.dob.age,
      gender: user.gender,
      picture: user.picture.thumbnail,
    });
  });
  setListeners();
  loadingSpinner.className = "noDisplay";
  mainContainer.classList.remove("noDisplay");
};

const setListeners = () => {
  const enableOrDisableBtn = () => {
    if (searchInput.value.length > 0) {
      searchButton.disabled = false;
    } else {
      searchButton.disabled = true;
    }
  };

  searchInput.addEventListener("keyup", enableOrDisableBtn);

  searchInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
      if (searchInput.value.length > 0) {
        searchButton.click();
      }
    }
  });

  searchButton.addEventListener("click", showSearchedData);
};

const showSearchedData = () => {
  let totalFoundUsers = 0;
  let totalFoundMaleUsers = 0;
  let totalFoundFemaleUsers = 0;
  let totalFoundAge = 0;

  finalData.map((user) => {
    if (user.name.toLowerCase().includes(searchInput.value)) {
      usersContent.innerHTML =
        usersContent.innerHTML +
        `
           <div class="mt-3 mb-3">
            <img src="${user.picture}" alt="${user.name}" class="rounded-circle" />
            <span class="ml-2"> ${user.name}, ${user.age} anos </span>
          </div>
          `;
      if (user.gender === "male") {
        totalFoundMaleUsers++;
      } else if (user.gender === "female") {
        totalFoundFemaleUsers++;
      }
      totalFoundAge += user.age;
      totalFoundUsers++;
    }
  });

  if (totalFoundUsers > 0) {
    statisticsTitle.innerHTML = "Estatísticas";
    statisticsContent.innerHTML = `<span> Sexo masculino: <strong class="ml-1">${totalFoundMaleUsers}</strong> </span>
    <br />
    <span> Sexo feminino: <strong class="ml-1">${totalFoundFemaleUsers}</strong> </span>
    <br />
    <span> Soma das idades: <strong class="ml-1">${totalFoundAge}</strong> </span>
    <br />
    <span> Média das idades: <strong class="ml-1">${(
      totalFoundAge / totalFoundUsers
    ).toFixed(2)}</strong> </span>
    <br />`;
  } else {
    statisticsTitle.innerHTML = "Nada a ser exibido";
    statisticsContent.innerHTML = "";
  }

  if (totalFoundUsers === 1) {
    usersTitle.innerHTML = `${totalFoundUsers} usuário encontrado`;
  } else if (totalFoundUsers > 1) {
    usersTitle.innerHTML = `${totalFoundUsers} usuário(s) Encontrado(s)`;
  } else {
    usersTitle.innerHTML = "Nenhum usuário encontrado";
    usersContent.innerHTML = "";
  }
};

window.addEventListener("load", loadAndFilterAllUsableData);
