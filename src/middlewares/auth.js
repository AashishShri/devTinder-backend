const adminAuth = (req, res, next) => {
  console.log("admin auth checked");
  const token = "xyz1";
  const authToken = token === "xyz";
  if (!authToken) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
