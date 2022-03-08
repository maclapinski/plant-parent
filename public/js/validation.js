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

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validatePassword = (password) => {
  let errorMessage = [];
  const hasEightChar = password.length;
  const hasLowerCaseLetter = password.match(/[a-z]/);
  const hasUpperCaseLetter = password.match(/[A-Z]/);
  const hasSpecialChar = password.match(/[@$!%*?&]/);
  const hasNumber = password.match(/[0-9]/);

  if (hasEightChar < 8) {
    errorMessage.push("<li>Password must contain at least 8 characters</li>");
  }
  if (!hasLowerCaseLetter) {
    errorMessage.push("<li>Password must contain a lower case letter</li>");
  }
  if (!hasUpperCaseLetter) {
    errorMessage.push("<li>Password must contain an upper case letter</li>");
  }
  if (!hasSpecialChar) {
    errorMessage.push("<li>Password must contain a special character e.g., @, $, !, %, *, ?, &</li>");
  }
  if (!hasNumber) {
    errorMessage.push("<li>Password must contain a number</li>");
  }
  console.log(errorMessage);
  return errorMessage;
};

const validateConfirmPassword = () => {
  return password.value === confirmPassword.value;
};

const validateName = (input) => {
  console.log(input.match(/[a-zA-Z]*/));
  console.log(input.match(/[a-zA-Z]*/)[0]);
  if (input.match(/[a-zA-Z]*/)[0].length > 1 && !input.match(/[@$!%*?&]/) && !input.match(/[0-9]/)) {
    return true;
  }
  return false;
};
const setInputChange = (inputName) => {};

const setValidationPass = (element) => {
  document.querySelector(`.${element}-fail`).removeAttribute("style");
  document.querySelector(`.${element}-pass`).style.display = "block";
  document.querySelector(`.${element}-popover`).classList.remove("slidedown");
  eval(`${element}Validated = true`);
};
const setValidationFail = (element, errorMessage) => {
  document.querySelector(`.${element}-pass`).removeAttribute("style");
  document.querySelector(`.${element}-fail`).style.display = "block";
  document.querySelector(
    `.${element}-popover`
  ).innerHTML = `<div class='popover__content'>${errorMessage}</div>`;
  document.querySelector(`.${element}-popover`).classList.add("slidedown");
  eval(`${element}Validated = true`);
};

const validate = () => {
  if (!emailValidated && email.value !== "") {
    const emailValidation = validateEmail(email.value);
    if (emailValidation) {
      setValidationPass("email");
    } else {
      setValidationFail("email", "<p>Invalid e-mail address.</p>");
    }
  }

  if (
    (!confirmPasswordValidated && confirmPassword.value !== "") ||
    (confirmPasswordEdited && !passwordValidated && password.value !== "")
  ) {
    if (validateConfirmPassword()) {
      setValidationPass("confirmPassword");
    } else {
      setValidationFail("confirmPassword", `<p>Passwords don't match.</p>`);
    }
  }

  if (!passwordValidated && password.value !== "") {
    const passwordValidation = validatePassword(password.value);
    const errorMessage = passwordValidation.join("");
    if (passwordValidation.length === 0) {
      setValidationPass("password");
    } else {
      setValidationFail("password", `<ul>${errorMessage}</ul>`);
    }
  }

  if (!lastNameValidated && lastName.value !== "") {
    if (validateName(lastName.value)) {
      setValidationPass("lastName");
    } else {
      setValidationFail("lastName", "<p>Last name must be at least 2 characters long and must consist of letters only.</p>");
    }
  }

  if (!firstNameValidated && firstName.value !== "") {
    if (validateName(firstName.value)) {
      setValidationPass("firstName");
    } else {
      setValidationFail("firstName", "<p>First name must be at least 2 characters long and must consist of letters only.</p>");
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
