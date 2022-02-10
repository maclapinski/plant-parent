const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");

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
  var currentURL = window.location.href;
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

backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);
