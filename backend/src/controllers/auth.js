const argon2 = require("argon2");
const {
  authenticateUser,
  signJWT,
  updateTask,
} = require("../services/authService");
const {
  createManager,
  createlabeller,
  addObjectDetails,
  getUserPics,
  markCompleted,
} = require("../services/userService");
const Labeller = require("../models/labeller");
const Manager = require("../models/manager");
const { validationResult } = require("express-validator");
const utils = require("../utils/utils");
const Object = require("../models/object");

exports.Login = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const test = await authenticateUser({ email, password });
    if (test[1] == 0) {
      const labeller = test[0];
      const token = await signJWT(labeller.email);
      // console.log(labeller.obj_assigned);
      if (labeller.obj_assigned == "") {
        const label = await updateTask(labeller);
        // console.log(label)
        const labellerObj = utils.getCleanLabeller(label);
        // console.log(labellerObj)
        return res.json({ labeller: labellerObj, flag: test[1], token });
      } else {
        const labellerObj = utils.getCleanLabeller(labeller);
        // console.log(labellerObj)
        return res.json({ labeller: labellerObj, flag: test[1], token });
      }
    } else {
      const manager = test[0];
      const token = await signJWT(manager.email);
      // console.log(token);
      const managerObj = utils.getCleanManager(manager);
      return res.json({ manager: managerObj, flag: test[1], token });
    }
  } catch (error) {
    return res.status(401).json({ error });
  }
};

exports.RegisterLabeller = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, name, phone, obj_assigned, obj_submitted } =
    req.body;
  try {
    const createdLabeller = await createlabeller({
      email,
      password,
      name,
      phone,
      obj_assigned,
      obj_submitted,
    });
    // console.log(createdUser);
    delete createdLabeller.password;
    return res.send(createdLabeller);
  } catch (error) {
    res.status(402).json({ errors: error });
  }
};

exports.GetMyProfile = async function (req, res) {
  return res.status(200).json({ message: "WIP" });
};
exports.RegisterManager = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, name, phone } = req.body;
  try {
    const createdManager = await createManager({
      email,
      password,
      name,
      phone,
    });
    // console.log(createdManager);
    delete createdManager.password;
    const manager = utils.getCleanManager(createdManager);
    return res.send(manager);
  } catch (error) {
    res.status(402).json({ errors: error });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const img = req.files.image[0].location;
    console.log(req.body, req.files);
    const { email } = req.body;

    const updateResponse = await Labeller.findOneAndUpdate(
      { email: email },
      { $addToSet: { images: img }, $inc: { obj_submitted: 1 } },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json({ result: "Successfully added" });
  } catch (error) {
    res.status(402).json({ errors: error });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const img = req.file.location;
    const { email } = req.body;
    console.log(email);
    const updateResponse = await Labeller.updateOne(
      { email: email },
      { $set: { file: img } }
    );
    res.status(200).json({ result: "Successfully added" });
  } catch (error) {
    res.status(402).json({ errors: error });
  }
};

exports.addObject = async (req, res) => {
  try {
    let { objectName, assignedTo, status } = req.body;
    objectName = objectName.toLowerCase();
    const object = await addObjectDetails({
      objectName,
      assignedTo,
      status,
    });
    // console.log(object);
    res.json({ object: object });
  } catch (error) {
    res.status(402).json({ errors: error });
  }
};

exports.getPics = async (req, res) => {
  try {
    const { objectName } = req.body;
    const images = await getUserPics({ objectName });
    res.status(200).json({ images });
  } catch (error) {
    res.status(402).json({ errors: error });
  }
};

exports.getObject = async (req, res) => {
  try {
    const object = await Object.find();
    res.status(200).json({ objects: object });
  } catch (error) {
    res.status(402).json({ errors: error });
  }
};

exports.getLabeller = async (req, res) => {
  try {
    const { email } = req.body;
    const labellerData = await Labeller.findOne({
      email,
    });
    if (!labellerData) throw "Labeller not found";
    const labeller = utils.getCleanLabeller(labellerData);
    res.status(200).json({ labeller });
  } catch (error) {
    res.status(402).json({ errors: error });
  }
};

exports.getManager = async (req, res) => {
  try {
    const { email } = req.body;
    const managerData = await Manager.findOne({
      email,
    });
    if (!managerData) throw "Manager not found";
    const manager = utils.getCleanManager(managerData);
    res.status(200).json({ manager });
  } catch (error) {
    res.status(402).json({ errors: error });
  }
};

exports.deleteObject = async (req, res) => {
  try {
    const { objectName } = req.body;
    const objectDeleted = await Object.findOneAndDelete({ objectName });
    if (!objectDeleted) throw new Error("Object not found");

    return res.json({ msg: "Object Deleted Successfully!!" });
  } catch (error) {
    return res.status(402).json({ errors: error });
  }
};

exports.completeObject = async (req, res) => {
  try {
    const { email } = req.body;
    const labellerObj = await markCompleted({ email });
    return res.json({ labellerObj });
  } catch (error) {
    return res.status(401).json({ error });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { object, status } = req.body;
    const objectChanged = await Object.findOneAndUpdate(
      { objectName: object },
      { status },
      { new: true, runValidators: true, useFindAndModify: false }
    );
    if (!objectChanged) throw "Object not found";
    // console.log(objectChanged);
    return res.json({ objectChanged });
  } catch (error) {
    return res.status(402).json({ error });
  }
};

exports.verifyManager = async (req, res) => {
  try {
    const { email } = req.body;
    const verifiedManager = await Manager.findOneAndUpdate(
      { email },
      { isVerified: "true" },
      { new: true, runValidators: true, useFindAndModify: false }
    );
    if (!verifiedManager) throw "Manager not found";
    const manager = await utils.getCleanManager(verifiedManager);
    return res.json({ manager });
  } catch (error) {
    return res.status(402).json({ error });
  }
};

exports.getOneObject = async (req, res) => {
  try {
    const { objectName } = req.body;
    const object = await Object.findOne({ objectName });
    if (!object) throw "Object Not found";
    return res.json({ object });
  } catch (error) {
    return res.status(404).json({ error });
  }
};

exports.getLabellerList = async (req, res) => {
  try {
    const labellers = await Labeller.find({}, { name: 1, phone: 1, _id: 0 });
    return res.json(labellers);
  } catch (error) {
    return res.status(404).json({ error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { oldEmail, userType } = req.query;
    const { email, name, phone } = req.body;
    const updateQuery = {
      labeller: async () =>
        Labeller.findOneAndUpdate(
          { email: oldEmail },
          { email, name, phone },
          { new: true, useFindAndModify: false, runValidators: true }
        ),
      manager: async () =>
        Manager.findOneAndUpdate(
          { email: oldEmail },
          { email, name, phone },
          { new: true, useFindAndModify: false, runValidators: true }
        ),
    };

    const result = await updateQuery[userType]?.();
    console.log(result);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userType, password, email } = req.query;
    const { newPassword } = req.body;

    const findQuery = {
      labeller: async () => Labeller.findOne({ email }),
      manager: async () => Manager.findOne({ email }),
    };
    const user = await findQuery[userType]?.();
    const oldPasswordHash = await argon2.hash(password);
    if (user.password !== oldPasswordHash) {
      return res
        .status(400)
        .json({ error: "Current Password is incorrect!!!" });
    }
    user.password = await argon2.hash(newPassword);
    const updateQuery = {
      labeller: async () =>
        Labeller.findOneAndUpdate(
          { email },
          { password: user.password },
          { new: true, useFindAndModify: false }
        ),
      manager: async () =>
        Manager.findOneAndUpdate(
          { email },
          { password: user.password },
          { new: true, useFindAndModify: false }
        ),
    };
    const updatedUser = await updateQuery[userType]?.();
    return res.json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
