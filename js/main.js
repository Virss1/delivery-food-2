"use strict";

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");
const menuHeading = document.querySelector(".menu-heading");

let login = localStorage.getItem("deliveryFood");

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url},
    статус ошибки ${response.status}!`);
  }

  return await response.json();
};

const resetLoginInput = function () {
  loginInput.style.backgroundColor = "";
  loginInput.placeholder = "";
};

const toggleModal = function () {
  modal.classList.toggle("is-open");
};

const toggleModalAuth = function () {
  modalAuth.classList.toggle("is-open");
  resetLoginInput();
  logInForm.reset();
};

function returnMain() {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
}

function authorized() {
  function logOut() {
    login = null;
    localStorage.removeItem("deliveryFood");

    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    returnMain();
    checkAuth();
  }

  console.log("Авторизован");

  userName.textContent = login;

  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "block";

  buttonOut.addEventListener("click", logOut);
}

function notAuthorized() {
  console.log("Не авторизован");

  function logIn(event) {
    event.preventDefault();

    if (loginInput.value) {
      login = loginInput.value;

      localStorage.setItem("deliveryFood", login);

      toggleModalAuth();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.backgroundColor = "red";
      loginInput.placeholder = "Введите логин!";
    }
  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn);
  loginInput.addEventListener("input", resetLoginInput);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant({
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery,
}) {
  const card = `
  <a class="card card-restaurant" data-products="${products}" data-name="${name}" data-stars="${stars}" data-price="${price}" data-kitchen="${kitchen}">
    <img src="${image}" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  </a>
  `;

  cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

function createCardGood({ name, description, price, image }) {
  const card = document.createElement("div");
  card.className = "card";
  card.insertAdjacentHTML(
    "beforeend",
    `
    <img src="${image}" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `
  );

  cardsMenu.insertAdjacentElement("beforeend", card);
}

function createRestaurantInfo(name, stars, price, kitchen) {
  const heading = `
    <h2 class="section-title restaurant-title">${name}</h2>
    <div class="card-info">
      <div class="rating">
        ${stars}
      </div>
      <div class="price">От ${price} ₽</div>
      <div class="category">${kitchen}</div>
    </div>
  `;
  menuHeading.insertAdjacentHTML("beforeend", heading);
}

function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest(".card-restaurant");

  if (login) {
    if (restaurant) {
      menuHeading.textContent = "";
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");

      createRestaurantInfo(
        `${restaurant.dataset.name}`,
        `${restaurant.dataset.stars}`,
        `${restaurant.dataset.price}`,
        `${restaurant.dataset.kitchen}`
      );

      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    }
  } else if (restaurant) {
    toggleModalAuth();
  }
}

function init() {
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener("click", openGoods);

  logo.addEventListener("click", returnMain);

  checkAuth();
}

init();