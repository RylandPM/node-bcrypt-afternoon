const bcrypt = require("bcrypt");

module.exports = {
  register: (req, res, next) => {
    const db = req.app.get("db");
    const { username, password, isAdmin } = req.body;
    db.get_user(username).then(user => {
      if (user.length) {
        res.status(409).send("Username taken");
      } else {
        const saltRounds = 12;
        bcrypt.genSalt(saltRounds).then(salt => {
          bcrypt.hash(password, salt).then(hash => {
            db.register_user([isAdmin, username, hash]).then(regUser => {
              req.session.user = {
                id: regUser[0].id,
                isAdmin: regUser[0].isAdmin,
                username: regUser[0].username
              };
              res.status(201).send(req.session.user);
            });
          });
        });
      }
    });
  },
  login: (req, res, next) => {
    const db = req.app.get("db");
    const { username, password } = req.body;
    db.get_user(username).then(user => {
      if (!user) {
        res.status(401).send("User not found");
      } else {
        bcrypt.compare(password, user[0].hash).then(result => {
          if (result) {
            req.session.user = {
              id: user[0].id,
              isAdmin: user[0].is_admin,
              username: user[0].username
            };
            res.status(200).send(req.session.user);
          } else {
            res.status(403).send("Incorrect password");
          }
        });
      }
    });
  },
  logout: (req, res, next) => {
    req.session.destroy();
    return res.sendStatus(200);
  }
};
