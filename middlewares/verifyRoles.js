const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user.roles) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to make changes",
      });
    }

    const rolesArray = [...allowedRoles];
    const result = req.user.roles
      .map((role) => rolesArray.includes(role)) // includes return [true,false]
      .find((val) => val === true); // find return the value that satify the condition
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to make changes",
      });
    }
    next();
  };
};

module.exports = verifyRoles;
