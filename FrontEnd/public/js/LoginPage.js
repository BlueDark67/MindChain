
// Função para identificar se é email ou username
export const isEmail = (value) => {
    // Esta expressão verifica se há caracteres antes e depois do @, e pelo menos um ponto após o @
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};




// Função para verificar se o input parece ser uma tentativa de email (contém @)
export const containsAtSymbol = (value) => {
    return value.includes('@');
};

export const handleErros = (res) => {
    if (!res.ok) {
        throw Error(res.status + " - " + res.url);
    }
    return res;
};

//Função para validar se os campos foram todos preenchidos corretamente
export const validateForm = (loginIdentifier, password) => {
    if (!loginIdentifier && !password) {
        return("Please fill all the fields");
    }
    if(!loginIdentifier){
        return("Username or Email is required");
    }
    if(!password){
        return("Password is required");
    }

    // Se o input contém @ mas não é um email válido
    if (containsAtSymbol(loginIdentifier) && !isEmail(loginIdentifier)) {
        return("Please enter a valid email format");
    }
    return null;
}

