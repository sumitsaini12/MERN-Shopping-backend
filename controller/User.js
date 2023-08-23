const { User } = require("../model/User");

exports.fetchUserById = async (req, res) => {
  console.log("user id ", req.user);
  const { id } = req.user;
  console.log("id", id);

  try {
    const user = await User.findById(id);
 
    res.status(200).json({id:user.id, addresses:user.addresses, email:user.email, role:user.role});
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).exec();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};
