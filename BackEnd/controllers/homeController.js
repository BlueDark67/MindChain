function getHomePage(req, res) {
  return res.status(200).json({
    message: "Welcome to the home page!",
    description: "This is a simple message from the server.",
  });
}

export { getHomePage };
