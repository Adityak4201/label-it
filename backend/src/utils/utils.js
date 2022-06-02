function getCleanLabeller(labeller) {
  // console.log(labeller)
  if (!labeller) return null;

  return {
    email: labeller.email,
    name: labeller.name,
    phone: labeller.phone,
    obj_assigned: labeller.obj_assigned,
    obj_submitted: labeller.obj_submitted,
    images: labeller.images,
  };
}

function getCleanManager(manager) {
  if (!manager) return null;

  return {
    email: manager.email,
    name: manager.name,
    phone: manager.phone,
    isVerified: manager.isVerified,
  };
}

module.exports = { getCleanManager, getCleanLabeller };
