//Função que valida a nova palavra passe
export const validateNewPassword = (newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    return "Password does not match";
  }
  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    return "Password does not meet all the requirements";
  }
  return null;
};

//Função que valida a palavra passe
export const validatePassword = (newPassword) => {
  let errors = [];

  if (newPassword.length < 6) {
    errors.push("At least 6 characters");
  }
  if (!/[A-Z]/.test(newPassword)) {
    errors.push("At least one uppercase");
  }
  if (!/[a-z]/.test(newPassword)) {
    errors.push("At least one lowercase");
  }
  if (!/[0-9]/.test(newPassword)) {
    errors.push("At least one number");
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)) {
    errors.push("At least one symbol");
  }
  return errors;
};

//Codigo para ver se a se o criterio de palavra passe foi obtido
export const isPasswordCriterionMet = (criterion, newPassword) => {
  if (!newPassword) return false;

  switch (criterion) {
    case "length":
      return newPassword.length >= 6;
    case "uppercase":
      return /[A-Z]/.test(newPassword);
    case "lowercase":
      return /[a-z]/.test(newPassword);
    case "number":
      return /[0-9]/.test(newPassword);
    case "symbol":
      return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
    default:
      return false;
  }
};



