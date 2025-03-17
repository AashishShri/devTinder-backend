const validator = require("validator");
const validationSignUpInput = (req) => {
  const { firstName, lastName, emailId, password } = req?.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "about",
    "gender",
    "age",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((k) => {
    return allowEditFields.includes(k);
  });

  return isEditAllowed;
};

const validateEditProfilePasswordData = (req) => {
  const allowEditPasswordFields = ["oldPassword", "newPassword"];

  const isEditPasswordAllowed = Object.keys(req.body).every((k) => {
    return allowEditPasswordFields.includes(k);
  });

  return isEditPasswordAllowed;
};

module.exports = {
  validationSignUpInput,
  validateEditProfileData,
  validateEditProfilePasswordData,
};
