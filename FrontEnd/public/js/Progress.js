//Função que trata os erros
const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

//API para buscar o progresso do utilizador
export const fetchUserProgress = async (userId) => {
  try {
    const res = await fetch("http://localhost:3000/fetch-user-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userId }),
    });

    handleErros(res);
    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return null;
  }
};
