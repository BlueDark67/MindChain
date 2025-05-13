const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

export const changePassword = async (userId, password) => {
  try {
    const res = await fetch("http://localhost:3000/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userId: userId, newPassword: password }),
    });
    handleErros(res);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
};
