const adminAuth = (req, res, next) => {
  // logic for  admin
  const token = "sdjkvb";
  const isAdminAuthorized = token === "sdjkvb";
  if (!isAdminAuthorized) {
    res.status(401).send("unauthorised request");
  } else {
    next();
  }
};

module.exports={
    adminAuth
}