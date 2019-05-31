module.exports = {
  dragonTreasure: (req, res) => {
    const db = req.app.get("db");
    db.get_dragon_treasure(1).then(response => {
      res.status(200).send(response);
    });
  },
  getUserTreasure: (req, res) => {
    const db = req.app.get("db");
    db.get_user_treasure(req.session.user.id).then(treasure => {
      res.status(200).send(treasure);
    });
  }
};
