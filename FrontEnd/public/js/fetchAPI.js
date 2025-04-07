"use strict";

console.log("connected");

import React from "react";

const defaultNames = ["Alice", "Bob", "Charlie", "David"];

function namesAsLis(names) {
  return names.map((n) => React.createElement("li", { key: n }, n));
}

const handleClick = async (setNames) => {
  try {
    const res = await fetch("http://localhost:3000/teste2");
    handleErros(res);
    const json = await res.json();
    setNames(json.names);
    console.log(json);
  } catch (err) {
    console.error(err);
  }
};

const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

export { defaultNames, namesAsLis, handleClick, handleErros };
