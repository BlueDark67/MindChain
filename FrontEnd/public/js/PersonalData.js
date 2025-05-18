//Função que trata os erros
const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

//API para ir buscar os dados do utilizador
export const fetchUserInfo = async (userId) => {
  try {
    const res = await fetch("http://localhost:3000/fetch-user-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userId: userId }),
    });
    handleErros(res);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//API para alterar os dados do utilizador
export const changeUserInfo = async (
  userId,
  username,
  email,
  birthdate,
  nationality
) => {
  try {
    const res = await fetch("http://localhost:3000/change-user-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userId: userId,
        username: username,
        email: email,
        birthdate: birthdate,
        nationality: nationality,
      }),
    });
    handleErros(res);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
};
