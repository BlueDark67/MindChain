export const isEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

//Codigo para meter os erros no array para depois usar no validateForm
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

//Codigo para ver se o criterio de palavra passe foi obtido
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

export const validateForm = (username, email, password, confirmPassword) => {
  //Para ver se tem campos nao preenchidos
  if (!username) {
    return "Username is required";
  }
  if (!email) {
    return "Email is required";
  }
  if (email && !isEmail(email)) {
    return "Please enter a valid email format";
  }
  if (!password) {
    return "Password is required";
  }
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  //Para validar se a palavra passe abrangiu todos os criterios
  const passwordErrors = validatePassword(password);
  //se tiver algum erro no array a password nao tem todos os criterios
  if (passwordErrors.length > 0) {
    return "Password does not meet all the requirements";
  }
  //Para confirmar se o confirmPassword é igual ao password
  if (password !== confirmPassword) {
    return "Password does not match";
  }
  return null;
};

// Função para tratamento de erros HTTP
export const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

// Função para requisição de cadastro
export const signupUser = async (username, email, password) => {
  const requestBody = {username, email, password};
  
  try {
    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    
    handleErros(res);
    return await res.json();
  } catch (err) {
    console.error("Register error:", err);
    throw err;
  }
};
