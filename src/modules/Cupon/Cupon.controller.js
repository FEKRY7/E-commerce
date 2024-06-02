const cuponModel = require("../../../Database/models/cupon.model");
const voucher_codes = require("voucher-code-generator");
const http = require("../../folderS,F,E/S,F,E.JS");
const { Firest, Schand, Thered } = require("../../utils/httperespons.js");

const createCupon = async (req, res) => {
  try {
    const code = voucher_codes.generate({ length: 3 });

    const cupon = await cuponModel.create({
      name: code[0],
      createdBy: req.user._id,
      discount: req.body.discount,
      expiredAt: new Date(req.body.expiredAt).getTime(),
    });
    return Schand(
      res,
      "Cupon is created",
      { results: cupon },
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Thered(res, "Internal Server Error", 500, http.ERROR);
  }
};

const updateCupon = async (req, res) => {
  try {
    const cupon = await cuponModel.findOne({
      name: req.params.code,
      expiredAt: { $gt: Date.now() },
    });

    if (!cupon) {
      return Firest(res, "Cupon dosent exist", 404, http.FAIL);
    }
    console.log(cupon);
    if (req.user._id.toString() != cupon.createdBy.toString()) {
      return Firest(res, "not authorized user", 403, http.FAIL);
    }

    cupon.discount = req.body.discount ? req.body.discount : cupon.discount;
    cupon.expiredAt = req.body.expiredAt
      ? new Date(req.body.expiredAt).getTime()
      : cupon.expiredAt;

    await cupon.save();
    return Schand(res, "Cupon updated", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Thered(res, "Internal Server Error", 500, http.ERROR);
  }
};

const deleteCupon = async (req, res) => {
  try {
    const cupon = await cuponModel.findOne({ name: req.params.code });
    if (!cupon) {
      return Firest(res, "Invalid Cupon", 404, http.FAIL);
    }

    if (req.user._id.toString() != cupon.createdBy.toString()) {
      return Firest(res, "Not autorized user", 403, http.FAIL);
    }

    await cupon.deleteOne();

    Schand(res, "Cupon deleted", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Thered(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getAllCupons = async (req, res) => {
  try {
    if (req.user.role == "admin") {
      const cupons = await cuponModel.find();
      return Schand(res,cupons,200,http.SUCCESS)
    }
    if (req.user.role == "user") {
      const cupons = await cuponModel.find({ createdBy: req.user._id });
      return Schand(res,cupons,200,http.SUCCESS)
    }
  }catch (error) {
    console.error(error);
    return Thered(res, 'Internal Server Error', 500, http.ERROR);    
  }
};

module.exports = {
  createCupon,
  updateCupon,
  deleteCupon,
  getAllCupons,
};
