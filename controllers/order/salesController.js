const Order = require("../../models/order");

const getSalesByLaundry = async (req, res) => {
    const { accountId, from, to } = req.query;
    const query = {
        "header.laundry.accountId": accountId,
        "content.orderStatus": "completed",
        "date.updatedAt": {
            $gte: new Date(from),
            $lte: new Date(to)
        }
    };
    Order.find(query)
        .select({ __v: 0 })
        .exec(function (err, data) {
            if (err) throwError(res, err);
            return res.status(200).json(data);
        });
};

const getSalesByCustomer = async (req, res) => {
    const { accountId, from, to } = req.query;
    const query = {
        "header.customer.accountId": accountId,
        "content.orderStatus": "completed",
        "date.updatedAt": {
            $gte: new Date(from),
            $lte: new Date(to)
        }
    };
    Order.find(query)
        .select({ __v: 0 })
        .exec(function (err, data) {
            if (err) throwError(res, err);
            return res.status(200).json(data);
        });
};

module.exports = {
    getSalesByLaundry,
    getSalesByCustomer
}