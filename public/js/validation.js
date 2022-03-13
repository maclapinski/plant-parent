const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
let firstNameValidated = true;
let lastNameValidated = true;
let emailValidated = true;
let passwordValidated = true;
let confirmPasswordValidated = true;
let confirmPasswordEdited = false;
const validationDelay = 1500;
let editedInput;
let typingTimer;
let initialPasswordCheck = true;

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validatePassword = (password) => {
  let passwordValid = true;
  const hasEightChar = password.length;
  const hasLowerCaseLetter = password.match(/[a-z]/);
  const hasUpperCaseLetter = password.match(/[A-Z]/);
  const hasSpecialChar = password.match(/[@$#!%*?&]/);
  const hasNumber = password.match(/[0-9]/);
  const eightChar = document.getElementById("eight-char");
  const upperCase = document.getElementById("upper-case");
  const lowerCase = document.getElementById("lower-case");
  const specialChar = document.getElementById("special-char");
  const oneNumber = document.getElementById("one-number");

  if (hasEightChar < 8) {
    eightChar.innerHTML = '<i class="fas fa-times-circle"></i>';
    passwordValid = false;
  } else {
    eightChar.innerHTML = '<i class="fas fa-check-circle"></i>';
  }

  if (!hasLowerCaseLetter) {
    lowerCase.innerHTML = '<i class="fas fa-times-circle"></i>';
    passwordValid = false;
  } else {
    lowerCase.innerHTML = '<i class="fas fa-check-circle"></i>';
  }

  if (!hasUpperCaseLetter) {
    upperCase.innerHTML = '<i class="fas fa-times-circle"></i>';
    passwordValid = false;
  } else {
    upperCase.innerHTML = '<i class="fas fa-check-circle"></i>';
  }

  if (!hasSpecialChar) {
    specialChar.innerHTML = '<i class="fas fa-times-circle"></i>';
    passwordValid = false;
  } else {
    specialChar.innerHTML = '<i class="fas fa-check-circle"></i>';
  }

  if (!hasNumber) {
    oneNumber.innerHTML = '<i class="fas fa-times-circle"></i>';
    passwordValid = false;
  } else {
    oneNumber.innerHTML = '<i class="fas fa-check-circle"></i>';
  }
  return passwordValid;
};

const validateName = (input) => {
  console.log(input.match(/[a-zA-Z]*/));
  console.log(input.match(/[a-zA-Z]*/)[0]);
  if (input.match(/[a-zA-Z]*/)[0].length > 1 && !input.match(/[@$#!%*?&]/) && !input.match(/[0-9]/)) {
    return true;
  }
  return false;
};

const setValidationPass = (element) => {
  document.querySelector(`.${element}`).classList.remove("fail");
  document.querySelector(`.${element}-fail`).removeAttribute("style");
  document.querySelector(`.${element}-pass`).style.display = "block";
  document.querySelector(`.${element}-popover`).classList.remove("slidedown");
  eval(`${element}Validated = true`);
};
const setValidationFail = (element, errorMessage) => {
  document.querySelector(`.${element}`).classList.add("fail");
  document.querySelector(`.${element}-pass`).removeAttribute("style");
  document.querySelector(`.${element}-fail`).style.display = "block";
  document.querySelector(`.${element}-popover`).innerHTML = `<div class='popover__content'>${errorMessage}</div>`;
  document.querySelector(`.${element}-popover`).classList.add("slidedown");
  eval(`${element}Validated = true`);
};

const validate = () => {
  if (!emailValidated && email.value !== "") {
    const emailValidation = validateEmail(email.value);
    if (emailValidation) {
      setValidationPass("email");
    } else {
      setValidationFail("email", "<p>Invalid email address.</p>");
    }
  }

  if (!lastNameValidated && lastName.value !== "") {
    if (validateName(lastName.value)) {
      setValidationPass("lastName");
    } else {
      setValidationFail(
        "lastName",
        "<p>Last name must be at least 2 characters long and must consist of letters only.</p>"
      );
    }
  }

  if (!firstNameValidated && firstName.value !== "") {
    if (validateName(firstName.value)) {
      setValidationPass("firstName");
    } else {
      setValidationFail(
        "firstName",
        "<p>First name must be at least 2 characters long and must consist of letters only.</p>"
      );
    }
  }
};

const inputEventHandler = (event) => {
  editedInput = event.currentTarget.name;

  if (editedInput === "confirmPassword") {
    confirmPasswordEdited = true;
  }

  eval(`${event.currentTarget.name}Validated = false`);

  document.querySelector(`.${editedInput}-pass`).removeAttribute("style");
  document.querySelector(`.${editedInput}-fail`).removeAttribute("style");

  if (
    (!confirmPasswordValidated && confirmPassword.value !== "") ||
    (confirmPasswordEdited && !passwordValidated && password.value !== "")
  ) {
    if (password.value === confirmPassword.value) {
      setValidationPass("confirmPassword");
    } else {
      setValidationFail("confirmPassword", `<p>Passwords don't match.</p>`);
    }
  }

  if (!passwordValidated) {
    const passwordValidation = validatePassword(password.value);
    if (passwordValidation) {
      setValidationPass("password");
    } else {
      setValidationFail("password", "");
    }
  }

  if (editedInput === event.currentTarget.name) {
    clearTimeout(typingTimer);
  }

  typingTimer = setTimeout(validate, validationDelay);
};

if (email) {
  email.addEventListener("input", inputEventHandler);
}
if (password) {
  password.addEventListener("input", inputEventHandler);
}

if (firstName) {
  firstName.addEventListener("input", inputEventHandler);
}

if (lastName) {
  lastName.addEventListener("input", inputEventHandler);
}

if (confirmPassword) {
  confirmPassword.addEventListener("input", inputEventHandler);
}
