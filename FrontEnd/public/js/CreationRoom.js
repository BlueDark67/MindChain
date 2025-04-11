export function validateRoomForm({
  isThemeChosen,
  themeValue,
  isPrivate,
  passwordValue,
  sessionTime,
}) {
  if (isThemeChosen && (!themeValue || themeValue.trim() === "")) {
    return { valid: false, message: "Please fill in the theme field!" };
  }
  if (isPrivate && (!passwordValue || passwordValue.trim() === "")) {
    return { valid: false, message: "Please fill in the password field!" };
  }
  if (!sessionTime) {
    return { valid: false, message: "Please select a session time!" };
  }
  return { valid: true, message: "" };
}

export function handleErros(res) {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
}

export async function getRandomTheme() {
  try {
    const res = await fetch("http://localhost:3000/file-txt");
    handleErros(res);
    const themesArray = await res.json();
    const randomIndex = Math.floor(Math.random() * themesArray.length);
    return themesArray[randomIndex];
  } catch (err) {
    console.error("Erro ao ler o ficheiro Themes.thx: ", err);
    return null;
  }
}
