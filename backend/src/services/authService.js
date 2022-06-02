const Labeller = require("../models/labeller");
const Manager = require("../models/manager");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const Object = require("../models/object");

exports.authenticateUser = async (credentials) => {
  try {
    let flag = 0;
    const labeller = await Labeller.findOne({ email: credentials.email });
    if (!labeller) {
      const manager = await Manager.findOne({ email: credentials.email });
      if (!manager) {
        throw "Invalid Credentials";
      }
      if (manager.isVerified === "false")
        throw "Contact your administrator to verify you as manager";
      flag = 1;
      if (await argon2.verify(manager.password, credentials.password)) {
        delete manager.password;
        const result = [manager, flag];
        return result;
      } else {
        throw "Invalid Credentials";
      }
    }
    if (await argon2.verify(labeller.password, credentials.password)) {
      delete labeller.password;
      const result = [labeller, flag];
      return result;
    } else {
      throw "Invalid Credentials";
    }
  } catch (error) {
    throw error;
  }
};

exports.signJWT = async (email) => {
  const payload = {
    user: {
      email,
    },
  };

  const jwtoken = jwt.sign(payload, process.env.COOKIE_SECRET, {
    expiresIn: 10000,
  });
  if (jwtoken) return jwtoken;
  throw "Error signing JWT";
};

exports.updateTask = async (userData) => {
  try {
    const status = "Unassigned";
    const object = await Object.findOne({ status: status });
    if (!object) {
      userData.obj_assigned = "";
    } else {
      const labeller = await Labeller.updateOne(
        { email: userData.email },
        {
          $set: { obj_assigned: object.objectName },
        }
      );
      const stat = "Assigned";
      const obj = await Object.updateOne(
        { objectName: object.objectName },
        {
          $set: { assignedTo: userData.name, status: stat },
        }
      );
      userData.obj_assigned = object.objectName;
    }
    return userData;
  } catch (error) {
    throw error;
  }
};
