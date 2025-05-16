const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

export const deleteAccount = async (userId) => {
  try {
    const res = await fetch("http://localhost:3000/delete-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userId: userId }),
    });
    handleErros(res);
  } catch (err) {
    console.error(err);
    return null;
  }
};
