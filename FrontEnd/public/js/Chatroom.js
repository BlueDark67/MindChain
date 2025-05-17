const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

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
