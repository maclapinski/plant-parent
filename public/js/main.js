const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirmPassword');
const showPassword = document.querySelector('#show-password');
const showConfirmPassword = document.querySelector('#show-confirm-password');
const validationDelay = 1500;
let editedInput;
let typingTimer;

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
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
  console.log('validate confirm pass');
  return password.value === confirmPassword.value;
};

const validate = () => {
  if (editedInput === 'email' && email.value !== '') {
    if (validateEmail(email.value)) {
      document.querySelector('.email-pass').style.display = 'block';
    } else {
      document.querySelector('.email-fail').style.display = 'block';
    }
    return false;
  }

  if (editedInput === 'password' && password.value !== '') {
    if (validatePassword(password.value)) {
      document.querySelector('.password-pass').style.display = 'block';
    } else {
      document.querySelector('.password-fail').style.display = 'block';
    }
  }

  if (
    (editedInput === 'confirmPassword' || editedInput === 'password') &&
    confirmPassword.value !== ''
  ) {
    console.log(validateConfirmPassword());
    if (validateConfirmPassword()) {
      document.querySelector('.confirmPassword-fail').removeAttribute('style');
      document.querySelector('.confirmPassword-pass').style.display = 'block';
    } else {
      document.querySelector('.confirmPassword-pass').removeAttribute('style');
      document.querySelector('.confirmPassword-fail').style.display = 'block';
    }
  }
};

const inputEventHandler = (event) => {
  console.log(event.currentTarget.name);
  editedInput = event.currentTarget.name;
  document.querySelector(`.${editedInput}-pass`).removeAttribute('style');
  document.querySelector(`.${editedInput}-fail`).removeAttribute('style');
  clearTimeout(typingTimer);
  typingTimer = setTimeout(validate, validationDelay);
};

const togglePassword = (e) => {
  if (e.target.id === 'show-password') {
    if (password.type === 'password') {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  }
  else{
    if (confirmPassword.type === 'password') {
      confirmPassword.type = 'text';
    } else {
      confirmPassword.type = 'password';
    }
  }
};

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);

if (email) {
  email.addEventListener('input', inputEventHandler);
}
if (password) {
  password.addEventListener('input', inputEventHandler);
  showPassword.addEventListener('click', togglePassword);
}
if (confirmPassword) {
  confirmPassword.addEventListener('input', inputEventHandler);
  showConfirmPassword.addEventListener('click', togglePassword);
}
