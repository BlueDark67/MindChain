function getHomePage(req, res) {
  return res.json({
    names: [
      "Anna",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Heidi",
      "Ivan",
      "Judy",
      "Kathy",
      "Liam",
      "Mia",
      "Noah",
      "Olivia",
      "Paul",
      "Quinn",
      "Ryan",
      "Sophia",
      "Tina",
    ],
  });
}

function getHomePage2(req, res) {
  return res.json({
    names: [
      "Anna",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Heidi",
      "Ivan",
      "Judy",
      "Kathy",
      "Liam",
      "Mia",
      "Noah",
      "Olivia",
      "Paul",
      "Quinn",
      "Ryan",
      "Sophia",
      "Tina",
    ],
    numbers: [
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
    ],
  });
}

export { getHomePage, getHomePage2 };
