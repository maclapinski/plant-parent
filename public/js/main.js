const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
const validationDelay = 1500;
let editedInput;
let typingTimer;

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

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validatePassword = (password) => {
  console.log(password);
  return password.match(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
  );
};

const validateConfirmPassword = () => {
  return password.value === confirmPassword.value;
};

const validate = () => {
  if (editedInput === "email" && email.value !== "") {
    if (validateEmail(email.value)) {
      document.querySelector(".email-pass").style.display = "block";
    } else {
      document.querySelector(".email-fail").style.display = "block";
    }
    return false;
  }

  if (editedInput === "password" && password.value !== "") {
    if (validatePassword(password.value)) {
      document.querySelector(".password-pass").style.display = "block";
    } else {
      document.querySelector(".password-fail").style.display = "block";
    }
  }

  if ((editedInput === "confirmPassword" || editedInput === "password") && confirmPassword.value !== "") {
    if (validateConfirmPassword()) {
      document.querySelector(".confirmPassword-fail").removeAttribute("style");
      document.querySelector(".confirmPassword-pass").style.display = "block";
    } else {
      document.querySelector(".confirmPassword-pass").removeAttribute("style");
      document.querySelector(".confirmPassword-fail").style.display = "block";
    }
  }
};

const inputEventHandler = (event) => {
  console.log(event.currentTarget.name);
  editedInput = event.currentTarget.name;
  document.querySelector(`.${editedInput}-pass`).removeAttribute("style");
  document.querySelector(`.${editedInput}-fail`).removeAttribute("style");
  clearTimeout(typingTimer);
  typingTimer = setTimeout(validate, validationDelay);
};

const togglePassword = (btn) => {
  console.log(btn)
  const input = btn.parentNode.querySelector(".password")
  btn.classList.toggle('fa-eye-slash')
  btn.classList.toggle('fa-eye')
  if (input.type === "password") {
        input.type = "text";
      } else {
        input.type = "password";
      }
};

const toggleSpinner = () => {
  console.log('toggle')
  const loader = document.querySelector(".backdrop-loader")
loader.classList.toggle('active')
};

const googleClicked = (btn) => {
  console.log(btn)
  const spinner = btn.querySelector(".spinner")
spinner.classList.add('active')
};

const facebookClicked = (btn) => {
  console.log(btn)
  const spinner = btn.querySelector(".spinner")
spinner.classList.add('active')
};

backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);

if (email) {
  email.addEventListener("input", inputEventHandler);
}
if (password) {
  password.addEventListener("input", inputEventHandler);
}
if (confirmPassword) {
  confirmPassword.addEventListener("input", inputEventHandler);
}
