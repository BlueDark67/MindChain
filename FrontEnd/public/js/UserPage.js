//Função que trata os erros
const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

//API para ir buscar o nome do utilizador
export const fetchUserName = async (userId) => {
  try {
    const res = await fetch("http://localhost:3000/fetch-user-name", {
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
