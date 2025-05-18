//Função para tarta dos erros
const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

//API para ir buscar as informações da sala
export const fetchRoomInfo = async (roomId) => {
  try {
    const res = await fetch(`http://localhost:3000/fetch-room-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ roomId: roomId }),
    });
    handleErros(res);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
};
