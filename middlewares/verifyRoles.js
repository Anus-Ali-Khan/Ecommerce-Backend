const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.sendStatus(401);
    }
    const rolesArray = [...allowedRoles];
    const result = req.user.roles
      .map((role) => rolesArray.includes(role)) // includes return [true,false]
      .find((val) => val === true); // find return the value that satify the condition
    if (!result) {
      return res.sendStatus(401);
    }
    next();
  };
};
