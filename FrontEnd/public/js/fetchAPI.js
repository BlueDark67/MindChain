"strict mode";
console.log("connected");

document.addEventListener("DOMContentLoaded", function () {
  getDadosServidor("");
});

const getDadosServidor = async (page) => {
  try {
    const res = await fetch(`${page}`);
    handleErrors(res);
    const json = await res.json();
    addTeste(json);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

function addTeste(json) {
  console.info(json);
}

const handleErrors = (res) => {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};
