const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

export const fetchHistory = async (userId) => {
  try {
    const res = await fetch("http://localhost:3000/fetch-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userId: userId }),
    });
    handleErros(res);
    const json = await res.json();
    console.log("History response:", json); // depois eliminar
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
};
