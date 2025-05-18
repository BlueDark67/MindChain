//Função que trata os erros
const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

//API para trocar a password
export const changePassword = async (userId, password) => {
  try {
    const res = await fetch("http://localhost:3000/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userId: userId, newPassword: password }),
    });
    handleErros(res);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//Função que valida a nova password
export const validateNewPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "Password does not match";
  }
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    return "Password does not meet all the requirements";
  }
  return null;
};

//Função que valida a password
export const validatePassword = (newPassword) => {
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

//Codigo par aver se a se o criterio de palavra passe foi obtido
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