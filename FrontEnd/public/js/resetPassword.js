export const validateNewPassword = (newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    return "Password does not match";
  }
  return null;
};

export const validatePassword = (password) => {
  let errors = [];

  if (password.length < 6) {
    errors.push("At least 6 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("At least one uppercase");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("At least one lowercase");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("At least one number");
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("At least one symbol");
  }
  return errors;
};

//Codigo paraver se a se o criterio de palavra passe foi obtido
export const isPasswordCriterionMet = (criterion, password) => {
  if (!password) return false;

  switch (criterion) {
    case "length":
      return password.length >= 6;
    case "uppercase":
      return /[A-Z]/.test(password);
    case "lowercase":
      return /[a-z]/.test(password);
    case "number":
      return /[0-9]/.test(password);
    case "symbol":
      return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    default:
      return false;
  }
};