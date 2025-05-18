//Função que trata os erros
const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

//API que busca as informações do usuário
export const fetchRoomInfo = async (roomId) => {
  try {
    const res = await fetch("http://localhost:3000/fetch-room-info", {
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

//API que busca as mensagens do chat
export const fetchMessages = async (roomId) => {
  try {
    const res = await fetch(`http://localhost:3000/get-messages/${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    handleErros(res);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//API para dar restart a sala
export const restartRoom = async (roomId) => {
  try {
    const res = await fetch("http://localhost:3000/restart-room", {
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

//API para gerar a resposta da AI
export const generateChatResponse = async (roomId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/generate-chat-response/${roomId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ roomId: roomId }),
      }
    );
    handleErros(res);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
};
