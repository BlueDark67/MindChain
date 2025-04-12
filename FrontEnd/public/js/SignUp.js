
export const isEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};



{/*Codigo para validar a palavra passe com todos os seu criterios*/}
export const validatePassword = (password) => {
    let errors = [];

    if (password.length < 6){
        errors.push("At least 6 characters");
    }
    if (!/[A-Z]/.test(password)){
        errors.push("At least one uppercase");
    }
    if (!/[a-z]/.test(password)){
        errors.push("At least one lowercase");
    }
    if (!/[0-9]/.test(password)){
        errors.push("At least one number");
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        errors.push("At least one symbol");
    }
    return errors;
}

//Codigo paraver se a se o criterio de palavra passe foi obtido
export const isPasswordCriterionMet = (criterion, password) => {
    if(!password) return false;

    switch (criterion) {
        case 'length': return password.length >= 6;
        case 'uppercase': return /[A-Z]/.test(password);
        case 'lowercase': return /[a-z]/.test(password);
        case 'number': return /[0-9]/.test(password);
        case 'symbol': return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
        default: return false;
    }
    
};    

export const validateForm = (username, email,password, confirmPassword) => {
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
        return ("Please confirm your password");  
    }
    //Para validar se a palavra passe abrangiu todos os criterios
    const passwordErrors = validatePassword(password);
    if(passwordErrors.length > 0) {
        return ("Password does not meet all the requirements"); 
    }
    //Para confirmar se o confirmPassword é igual ao password
    if(password !== confirmPassword) {
        return ("Password does not match");
    }
    return null;
}



export const handleErros = (res) => {
    if (!res.ok) {
        setIsSubmitting(false);
        throw Error(res.status + " - " + res.url);
    }
    return res;
};