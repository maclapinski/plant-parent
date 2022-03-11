const root = document.documentElement;
const currentURL = window.location.href;
const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");
const dropDown = document.querySelectorAll("._16takj0");
const headerProfileMenu = document.querySelector(".header-profile-menu");
const footer = document.querySelector("footer");
const year = (document.getElementById("year").innerHTML = new Date().getFullYear());
const searchBar = document.getElementById("plant-search__form");
let searchTabOpen = false;
let profileMenuOpen = false;
let difficulty;

if (searchBar) {
  const difficultyCard = document.getElementById('difficulty__card');
  difficultyCard.addEventListener("click", (e) => {
    console.log("click");
    const difficultyBeginner = document.getElementById('difficulty-easy').checked;
    const difficultyIntermediate = document.getElementById('difficulty-medium').checked;
    const difficultyValue = document.querySelector('._uh2dzp');
    
    if (difficultyBeginner) {
      difficultyValue.innerHTML = 'Beginner'
    } else if (difficultyIntermediate){
      difficultyValue.innerHTML = 'Intermediate'
    } else {
      difficultyValue.innerHTML = 'Experienced'
    }

    console.log(difficultyValue)
  });
}

document.onclick = function (e) {
  if (searchTabOpen || profileMenuOpen) {
    if (!e.target.closest(".search-tabpanel") && !e.target.closest(".profile-button_container")) {
      const elems = document.querySelectorAll(".active");
      [].forEach.call(elems, function (el) {
        el.className = el.className.replace(/\bactive\b/, "");
      });
      profileMenuOpen = false;
      searchTabOpen = false;
    }
  }
};

function mainHeightCalc() {
  const footerHeight = footer.offsetHeight;
  const intViewportHeight = window.innerHeight;
  const mainHeight = intViewportHeight - footerHeight;
  const homeHeight = mainHeight * 0.7;
  const subscribeHeight = mainHeight * 0.3;

  root.style.setProperty("--main-height", mainHeight + "px");
  root.style.setProperty("--home-height", homeHeight + "px");
  root.style.setProperty("--subscribe-height", subscribeHeight + "px");
}

const buttons = document.querySelectorAll(".btn");
[].forEach.call(buttons, function (el) {
  el.addEventListener("click", (e) => {
    e.preventDefault();
  });
});

const addToMyPlants = (btn) => {
  const actions = btn.parentNode;
  const plantId = btn.parentNode.querySelector("[name=plantId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  fetch("/add-to-plant-list/" + plantId, {
    method: "POST",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      const deletePlantBtn = btn.cloneNode(true);
      const newBtnLabel = deletePlantBtn.innerHTML.replace("Add to My Plants", "Delete from My Plants");

      deletePlantBtn.setAttribute("onClick", "deletePlantHandler(this)");
      deletePlantBtn.classList.add("danger__btn");
      deletePlantBtn.classList.remove("primary__btn");
      deletePlantBtn.innerHTML = newBtnLabel;
      deletePlantBtn.addEventListener("click", (e) => {
        e.preventDefault();
      });

      actions.removeChild(btn);
      actions.appendChild(deletePlantBtn);
    })
    .catch((err) => {
      console.log(err);
    });
};

const deletePlantHandler = (btn) => {
  const plantId = btn.parentNode.querySelector("[name=plantId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  let overlay = document.createElement("div");

  overlay.id = "overlay";
  overlay.innerHTML = `<div class="alert__card card">
  <p class="message">Are you sure you want to delete this plant from your plant list?</p>
  <div class="alert__actions">
    <button class="btn secondary__btn action__btn" type="button" onclick="removeOverlay()">Cancel</button>
    <button class="btn danger__btn action__btn" type="button" onclick="deletePlant(this)">Delete
    <input type="hidden" name="_csrf" value="${csrf}" />
      <input type="hidden" value="${plantId}" name="plantId" /></button>
  </div>
</div> `;
  document.querySelector("main").appendChild(overlay);
};

const removeOverlay = () => {
  document.querySelector("main").removeChild(document.querySelector("#overlay"));
};

const deletePlant = (btn) => {
  let reqTarget = "";
  const plantId = btn.parentNode.querySelector("[name=plantId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  const plantElement = document.getElementById(plantId);
  const addPlantBtn = btn.cloneNode(true);
  const btnLabel = addPlantBtn.innerHTML.replace("Delete", "Add to My Plants");

  addPlantBtn.setAttribute("onClick", "addToMyPlants(this)");
  addPlantBtn.classList.remove("danger__btn");
  addPlantBtn.classList.add("primary__btn");
  addPlantBtn.innerHTML = btnLabel;
  addPlantBtn.addEventListener("click", (e) => {
    e.preventDefault();
  });

  if (currentURL.includes("user-wish-list")) {
    reqTarget = "/delete-from-wish-list/";
  } else if (currentURL.includes("admin")) {
    reqTarget = "/admin/delete-plant/";
  } else {
    reqTarget = "/delete-from-plant-list/";
  }

  fetch(reqTarget + plantId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      removeOverlay();
      if (currentURL.includes("user-plant-list")) {
        document.querySelector(".grid").removeChild(plantElement);
      } else {
        if (currentURL.includes("plant-details")) {
          document.querySelector(".actions").removeChild(document.querySelector(".danger__btn"));
          document.querySelector(".actions").appendChild(addPlantBtn);
        } else {
          const deleteBtn = plantElement.querySelector(".danger__btn");
          plantElement.querySelector(".actions").removeChild(deleteBtn);
          plantElement.querySelector(".actions").appendChild(addPlantBtn);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const toggleWishList = (btn) => {
  const wishListBtn = btn.parentNode.querySelector("svg");
  const plantId = btn.parentNode.querySelector("[name=plantId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  if (wishListBtn.classList.contains("checked")) {
    fetch("/delete-from-wish-list/" + plantId, {
      method: "DELETE",
      headers: {
        "csrf-token": csrf,
      },
    })
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        wishListBtn.classList.remove("checked");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    fetch("/add-to-wish-list/" + plantId, {
      method: "POST",
      headers: {
        "csrf-token": csrf,
      },
    })
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        wishListBtn.classList.add("checked");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const toggleInputBox = (btn) => {
  const inputBox = btn.parentNode.querySelector("._16takj0");
  console.log(inputBox);
  if (inputBox.classList.contains("active")) {
    inputBox.classList.remove("active");
    searchTabOpen = false;
  } else {
    searchTabOpen = false;
    const elems = document.querySelectorAll(".active");
    [].forEach.call(elems, function (el) {
      el.className = el.className.replace(/\bactive\b/, "");
    });
    inputBox.classList.toggle("active");
    searchTabOpen = true;
  }
};

const toggleProfileMenu = () => {
  if (headerProfileMenu.classList.contains("active")) {
    headerProfileMenu.classList.remove("active");
    profileMenuOpen = false;
  } else {
    profileMenuOpen = true;
    headerProfileMenu.classList.add("active");
  }
};

function backdropClickHandler() {
  backdrop.style.display = "none";
  sideDrawer.classList.remove("open");
}

function menuToggleClickHandler() {
  backdrop.style.display = "block";
  sideDrawer.classList.add("open");
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("User signed out.");
  });
}

const togglePassword = (btn) => {
  const input = btn.parentNode.querySelector(".password");

  if (input.type === "password") {
    input.type = "text";
    btn.setAttribute("aria-label", "hide password");
    btn.className = "far fa-eye togglePassword";
  } else {
    input.type = "password";
    btn.setAttribute("aria-label", "show password");
    btn.className = "far fa-eye-slash togglePassword";
  }
};

const toggleSpinner = () => {
  const spinner = document.querySelector(".backdrop-loader");
  spinner.classList.toggle("active");
};

const googleClicked = (btn) => {
  const spinner = btn.querySelector(".spinner");
  spinner.classList.add("active");
};

const facebookClicked = (btn) => {
  const spinner = btn.querySelector(".spinner");
  spinner.classList.add("active");
};

mainHeightCalc();
$(window).resize(function () {
  mainHeightCalc();
});
