const Order = require("../../models/order");
const { v4: uuidv4 } = require("uuid");
const { throwError } = require("../../const/status");

const createOrder = async (req, res) => {
    req.body.refNumber = uuidv4();
    Order.create(req.body, function (err, data) {
        if (err) throwError(res, err);
        return res.status(200).json(data);
    });
};

const getOrderById = async (req, res) => {
    const _id = req.params.id;
    Order.findById(_id)
        .select({ __v: 0 })
        .exec(function (err, data) {
            if (err) throwError(res, err);
            return res.status(200).json(data);
        });
};

const getOrdersByCustomer = async (req, res) => {
    const { accountId, status } = req.query;
    const query = { "header.customer.accountId": accountId, "content.orderStatus": status };
    Order.find(query)
        .sort({ "date.createdAt": "desc" })
        .select({ __v: 0 })
        .exec(function (err, data) {
            if (err) throwError(res, err);
            return res.status(200).json(data);
        });
};

const getOrdersByLaundry = async (req, res) => {
    const { accountId, status } = req.query;
    const query = { "header.laundry.accountId": accountId, "content.orderStatus": status };
    Order.find(query)
        .sort({ "date.createdAt": "desc" })
        .select({ __v: 0 })
        .exec(function (err, data) {
            if (err) throwError(res, err);
            return res.status(200).json(data);
        });
};

const updateOrderStatus = async (req, res) => {
    const { _id, status } = req.body;
    const options = { new: true, runValidators: true };
    const update = {
        $set: {
            "content.orderStatus": status,
            "date.updatedAt": Date.now(),
        },
    };
    Order.findByIdAndUpdate(_id, update, options, function (err, data) {
        if (data == null) throwError(res, err);
        return res.status(200).json(data);
    });
}

const updateOrderPaymentStatus = async (req, res) => {
    const { _id, status } = req.body;
    const options = { new: true, runValidators: true };
    const update = {
        $set: {
            "content.paymentStatus": status,
            "date.updatedAt": Date.now(),
        },
    };
    Order.findByIdAndUpdate(_id, update, options, function (err, data) {
        if (data == null) throwError(res, err);
        return res.status(200).json(data);
    });
};

module.exports = {
    createOrder,
    getOrdersByCustomer,
    getOrdersByLaundry,
    getOrderById,
    updateOrderStatus,
    updateOrderPaymentStatus
}
