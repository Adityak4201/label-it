const Labeller = require("../models/labeller");
const Manager = require("../models/manager");
const Object = require("../models/object");
const { updateTask } = require("./authService");
const argon2 = require("argon2");
const utils = require("../utils/utils");
exports.createlabeller = async (labellerData) => {
  try {
    const hashedPassword = await argon2.hash(labellerData.password);
    labellerData.password = hashedPassword;
    const labeller = new Labeller(labellerData);
    var createdLabeller = await labeller.save();
    delete createdLabeller.password;
    return createdLabeller;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

exports.createManager = async (managerData) => {
  try {
    const hashedPassword = await argon2.hash(managerData.password);
    managerData.password = hashedPassword;
    const manager = new Manager(managerData);
    const createdManager = await manager.save();
    delete createdManager.password;
    return createdManager;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

exports.findUserByEmail = async (userData) => {
  try {
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      throw "User Not Found";
    }
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
};

exports.addObjectDetails = async (userData) => {
  try {
    const objects = await Object.find();
    if (objects) {
      const seq = objects[objects.length - 1].seq + 1;
      userData.seq = seq;
      // console.log(userData);
    }
    const obj = new Object(userData);
    const object = await obj.save();
    if (!object) {
      throw "Object could not be saved";
    }
    return object;
  } catch (error) {
    throw error;
  }
};

exports.getUserPics = async (userData) => {
  try {
    const object = await Object.findOne(userData);
    if (!object) throw "Object not found";
    return object.images;
  } catch (error) {
    throw error;
  }
};

exports.markCompleted = async ({ email }) => {
  try {
    const labeller = await Labeller.findOne({ email });
    if (!labeller) throw "Labeller not found";
    const { images, obj_assigned } = labeller;
    if (images.length < 200) throw "Label at least 200 images first";
    const updatedObject = await Object.findOneAndUpdate(
      { objectName: obj_assigned },
      { $set: { images, status: "Labelled" } },
      { new: true, useFindAndModify: false }
    );
    // console.log("1", updatedObject);
    const updatedLabeller = await Labeller.findOneAndUpdate(
      { email },
      { $set: { images: [], obj_assigned: "" } },
      { new: true, useFindAndModify: false }
    );

    // console.log("2", updatedLabeller);
    const label = await updateTask(labeller);
    const labellerObj = utils.getCleanLabeller(label);
    // console.log("3", label);
    // console.log("4", labellerObj);
    return labellerObj;
  } catch (error) {
    throw error;
  }
};
