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

// Nova função para gerenciar a autenticação
export const loginUser = async (loginIdentifier, password, rememberMe) => {
    const requestBody = { 
        username: loginIdentifier, 
        password: password, 
        rememberMe: rememberMe
    };

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
            body: JSON.stringify(requestBody),
        });
        handleErros(res);
        return await res.json();
    } catch (err) {
        console.error("Login error:", err);
        throw err;
    }
};

// Funções para gerenciar "Remember Me"
export const saveRememberMeData = (isAuthenticated, rememberMe, loginIdentifier) => {
    if (isAuthenticated) {
        if (rememberMe) {
            // Salva apenas o identificador de login, NUNCA a senha
            localStorage.setItem('login_rememberedUser', JSON.stringify({
                loginIdentifier: loginIdentifier
            }));
        } else {
            // Remove os dados caso "lembrar-me" não esteja marcado
            localStorage.removeItem('login_rememberedUser');
        }
        // Define a autenticação para a sessão atual
        sessionStorage.setItem('authenticated', 'true');
    }
};

export const loadRememberMeData = () => {
    const savedUser = localStorage.getItem('login_rememberedUser');
    if (savedUser) {
        try {
            return JSON.parse(savedUser);
        } catch (error) {
            console.error("Erro ao carregar dados salvos:", error);
            localStorage.removeItem('login_rememberedUser');
            return null;
        }
    }
    return null;
};

// Função para detectar o autopreenchimento do navegador
export const detectBrowserAutofill = (callback) => {
    // Primeiro ativa o foco/desfoco para "provocar" o preenchimento
    const usernameInput = document.getElementById('loginIdentifier');
    const passwordInput = document.getElementById('password');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Sequência de foco e desfoco
            if (usernameInput) usernameInput.focus();
            setTimeout(() => {
                if (usernameInput) usernameInput.blur();
                if (passwordInput) passwordInput.focus();
                setTimeout(() => {
                    if (passwordInput) passwordInput.blur();
                    
                    // Verificação de autopreenchimento
                    setTimeout(() => {
                        const hasAutofill = 
                            document.querySelector('input:-webkit-autofill') || 
                            (usernameInput && usernameInput.value && 
                             callback && callback(usernameInput.value));
                        resolve(hasAutofill);
                    }, 500);
                }, 10);
            }, 10);
        }, 100);
    });
};


