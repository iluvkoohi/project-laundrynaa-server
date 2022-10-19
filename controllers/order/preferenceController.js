const { throwError } = require("../../const/status");
const Preference = require("../../models/preferences");

const createPreference = async (req, res) => {
    Preference.create(req.body, function (err, data) {
        if (err) throwError(res, err);
        return res.status(200).json(data);
    });
};

const getPreferences = async (req, res) => {
    const { accountId, availability } = req.query;
    const query = { accountId, availability };
    Preference.find(query)
        .sort({ "date.createdAt": "desc" })
        .select({ __v: 0 })
        .exec(function (err, data) {
            if (err) throwError(res, err);
            return res.status(200).json(data);
        });
};

const updatePreferences = async (req, res) => {
    const options = { new: true, runValidators: true };
    const { _id, title, description, quantity, price, availability } = req.body;
    const update = {
        $set: { title, description, quantity, price, availability, "date.updatedAt": Date.now(), },
    };
    Preference.findByIdAndUpdate(_id, update, options, function (err, data) {
        if (data == null) throwError(res, err);
        return res.status(200).json(data);
    });
}

const deletePreferences = async (req, res) => {
    try {
        const _id = req.params.id;
        return Preference.findByIdAndDelete(_id)
            .then(() => res.status(200).json({ message: "success" }))
            .catch(() => res.status(400).json({ message: "failed" }));

    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    createPreference,
    getPreferences,
    updatePreferences,
    deletePreferences
}