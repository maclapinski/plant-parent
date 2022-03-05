const currentURL = window.location.href;
const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");
const dropDown = document.querySelectorAll("._16takj0");
const headerProfileMenu = document.querySelector(".header-profile-menu");
const year = (document.getElementById("year").innerHTML = new Date().getFullYear());
let searchTabOpen = false;
let profileMenuOpen = false;

const buttons = document.querySelectorAll(".btn");
[].forEach.call(buttons, function (el) {
  el.addEventListener("click", (e) => {
    e.preventDefault();
  });
});

document.onclick = function (e) {
  if (searchTabOpen || profileMenuOpen) {
    
    if (!e.target.closest(".search-tabpanel") && !e.target.closest(".profile-button_container")) {
      console.log("close tab");
      const elems = document.querySelectorAll(".active");
      [].forEach.call(elems, function (el) {
        el.className = el.className.replace(/\bactive\b/, "");
      });
      profileMenuOpen = false;
      searchTabOpen = false;
    }
  }
};

const searchBtnExpand = () => {
  const searchBtn = document.querySelector(".search-btn");
};

const toggleWishList = (btn) => {
  const wishlistBtn = btn.parentNode.querySelector("svg");

  const plantId = btn.parentNode.querySelector("[name=plantId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  if (wishlistBtn.classList.contains("checked")) {
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
        wishlistBtn.classList.remove("checked");
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
        wishlistBtn.classList.add("checked");
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
    profileMenuOpen = false
  } else {
    profileMenuOpen = true
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

const deletePlant = (btn) => {
  let reqTarget = "";
  const plantId = btn.parentNode.querySelector("[name=plantId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  const plantElement = btn.closest("article");

  if (currentURL.includes("user-wish-list")) {
    reqTarget = "/delete-from-wish-list/";
  }
  if (currentURL.includes("admin")) {
    reqTarget = "/admin/delete-plant/";
  }
  if (currentURL.includes("user-plant-list")) {
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
      plantElement.parentNode.removeChild(plantElement);
    })
    .catch((err) => {
      console.log(err);
    });
};

// backdrop.addEventListener("click", backdropClickHandler);
// menuToggle.addEventListener("click", menuToggleClickHandler);
