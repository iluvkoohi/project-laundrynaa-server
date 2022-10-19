const { Profile, LaundryProfile } = require("../../models/profile");
const cloudinary = require("../../services/img-upload/cloundinary");
const mongoose = require('mongoose');
const distanceBetween = require("../../helpers/distanceBetween");

const createProfile = async (req, res) => {
  try {

    const accountId = req.body.accountId;
    const doesExist = await Profile.findOne({ accountId });
    if (doesExist)
      return res.status(400).json({ message: "accountId already exist" });

    if (req.body.role == "laundry") {
      return Promise.all([
        Profile(req.body).save(),
        LaundryProfile({ accountId }).save()
      ])
        .then(([profile, subProfile]) => res.status(200).json({ profile, subProfile }))
        .catch((err) => res.status(400).json(err));
    }
    return new Profile(req.body)
      .save()
      .then((value) => res.status(200).json(value))
      .catch((err) => res.status(400).json(err.errors));

  } catch (error) {
    console.error(error);

  }
};
const getAllProfiles = async (req, res) => {
  try {
    const { latitude, longitude, role, sortBy } = req.query;

    if (latitude == undefined || longitude == undefined) {
      return Profile.find({ role })
        .select({ _id: 0, __v: 0 })
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err));
    }

    return Profile.find({ role })
      .select({ _id: 0, __v: 0 })
      .then((value) => {
        const result = value
          .map((element, _) => {
            const fromLat = element.address.coordinates.latitude;
            const fromLon = element.address.coordinates.longitude;
            // if (distanceBetween(fromLat, fromLon, latitude, longitude, "K").toFixed(0) == "0") {
            //   distance = distanceBetween(fromLat, fromLon, latitude, longitude, "K").toFixed(1) * 1000 + "meters away";
            // }
            return { ...element._doc, distance: distanceBetween(fromLat, fromLon, latitude, longitude, "K").toFixed(1) + "km away" };
          })
          .sort((a, b) => {
            const value1 = parseFloat(a.distance.replace(/[^\d.-]/g, ''));
            const value2 = parseFloat(b.distance.replace(/[^\d.-]/g, ''));
            if (sortBy == "desc") return value2 - value1;
            return value1 - value2;
          });

        return res.status(200).json(result);
      })
      .catch((err) => res.status(400).json(err));
  } catch (error) {
    console.error(error);
  }
};
const getProfile = async (req, res) => {
  try {
    const accountId = req.params.id;
    const profile = await Profile.findOne({ accountId });

    if (profile == null) {
      return res.status(400).json({ message: "profile accountId not found" });
    }
    if (profile.role == "laundry") {
      const laundryProfile = await LaundryProfile.findOne({ accountId });
      return res.status(200).json({ ...profile._doc, laundryProfile: { ...laundryProfile?._doc } });
    }
    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
  }
};
const updateProfile = async (req, res) => {
  try {
    const { accountId, name, contact } = req.body;
    Profile.findOneAndUpdate(
      { accountId },
      {
        $set: {
          "name.first": name.first,
          "name.last": name.last,
          "contact.number": contact.number,
          "date.updatedAt": Date.now(),
        },
      },
      { new: true }
    )
      .then((value) => {
        if (!value)
          return res.status(400).json({ message: "accountId not found" });
        return res.status(200).json(value);
      })
      .catch((err) => res.status(400).json(err));
  } catch (error) {
    console.error(error);
  }
};
const updateSubProfile = async (req, res) => {
  try {
    const { accountId, pricePerKg, serviceHrs, deliveryFee } = req.body;
    LaundryProfile.findOneAndUpdate(
      { accountId },
      { $set: { pricePerKg, serviceHrs, deliveryFee, "date.updatedAt": Date.now() } },
      { new: true }
    )
      .then((value) => {
        if (!value)
          return res.status(400).json({ message: "accountId not found" });
        return res.status(200).json(value);
      })
      .catch((err) => res.status(400).json(err));
  } catch (e) {
    return res.status(400).json({ message: "Something went wrong" });
  }
}
const updateProfileVisibility = async (req, res) => {
  try {
    const { accountId, visibility } = req.body;
    Profile.findOneAndUpdate({ accountId }, { visibility }, { new: true })
      .then((value) => {
        if (!value)
          return res.status(400).json({ message: "accountId not found" });
        return res.status(200).json(value);
      })
      .catch((err) => res.status(400).json(err));
  } catch (error) {
    console.error(error);
  }
};
const updateProfileAddress = async (req, res) => {
  try {
    const { accountId, address } = req.body;
    Profile.findOneAndUpdate(
      { accountId },
      {
        $set: {
          "address.name": address.name,
          "address.coordinates.latitude": address.coordinates.latitude,
          "address.coordinates.longitude": address.coordinates.longitude,
          "date.updatedAt": Date.now(),
        },
      },
      { new: true }
    )
      .then((value) => {
        if (!value)
          return res.status(400).json({ message: "accountId not found" });
        return res.status(200).json(value);
      })
      .catch((err) => res.status(400).json(err));
  } catch (e) {
    return res.status(400).json({ message: "Something went wrong" });
  }
};

const updateProfilePhoto = async (req, res) => {
  try {
    const { accountId, type } = req.body;
    const filePath = req.file.path;
    const options = {
      folder: process.env.CLOUDINARY_FOLDER + "/user/avatar",
      unique_filename: true,
    };
    const uploadedImg = await cloudinary.uploader.upload(filePath, options);
    if (type == "avatar") {
      Profile.findOneAndUpdate(
        { accountId },
        {
          $set: {
            avatar: uploadedImg.url,
            "date.updatedAt": Date.now(),
          },
        },
        { new: true }
      )
        .then((value) => {
          if (!value) return res.status(400).json({ message: "_id not found" });
          return res.status(200).json(value);
        })
        .catch((err) => res.status(400).json(err));
    }
    if (type == "qr") {
      LaundryProfile.findOneAndUpdate(
        { accountId },
        {
          $set: {
            paymentQrCode: uploadedImg.url,
            "date.updatedAt": Date.now(),
          },
        },
        { new: true }
      )
        .then((value) => {
          if (!value) return res.status(400).json({ message: "_id not found" });
          return res.status(200).json(value);
        })
        .catch((err) => res.status(400).json(err));
    }
  } catch (error) {
    console.log(error);
  }
};
const updateProfileGallery = async (req, res) => {
  try {
    const { accountId, description } = req.body;
    const filePath = req.file.path;
    const options = {
      folder: process.env.CLOUDINARY_FOLDER + "/user/gallery",
      unique_filename: true,
    };
    const uploadedImg = await cloudinary.uploader.upload(filePath, options);
    const content = {
      id: mongoose.Types.ObjectId(),
      url: uploadedImg.url,
      description,
      date: {
        createdAt: new Date().toISOString(),
        updatedAt: null,
      }
    }
    Profile.findOneAndUpdate(
      { accountId },
      { $push: { gallery: content } },
      { new: true, upsert: true },
    )
      .then((value) => {
        if (!value) return res.status(400).json({ message: "_id not found" });
        return res.status(200).json(value);
      })
      .catch((err) => res.status(400).json(err));
  } catch (error) {
    console.log(error);
  }
};
const deleteInProfileGallery = async (req, res) => {
  try {
    const { accountId, _id } = req.body;
    return Profile.findOneAndUpdate(
      { accountId },
      { $pull: { gallery: { id: mongoose.Types.ObjectId(_id) } } },
      { new: true },
    )
      .then((value) => res.status(200).json(value))
      .catch((err) => res.status(400).json(err.errors));
  } catch (error) {
    console.error(error);
  }
}
const updateProfileLink = async (req, res) => {
  const { accountId, content } = req.body;
  content.id = mongoose.Types.ObjectId();

  Profile.findOneAndUpdate({ accountId },
    { $push: { links: content } },
    { new: true, upsert: true },
  )
    .then((value) => {
      if (!value) return res.status(400).json({ message: "accountId not found" });
      return res.status(200).json(value);
    })
    .catch((err) => res.status(400).json(err));

}
const deleteProfileLink = async (req, res) => {
  try {
    const { accountId, _id } = req.body;
    return Profile.findOneAndUpdate(
      { accountId },
      { $pull: { links: { id: mongoose.Types.ObjectId(_id) } } },
      { new: true },
    )
      .then((value) => res.status(200).json(value))
      .catch((err) => res.status(400).json(err.errors));
  } catch (error) {
    console.error(error);
  }
};
const deleteProfile = async (req, res) => {
  try {
    const accountId = req.params.id;
    return Profile.findOneAndRemove({ accountId })
      .then(() => res.status(200).json({ message: "success" }))
      .catch(() => res.status(400).json({ message: "failed" }));

  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfile,
  updateProfile,
  updateProfileVisibility,
  updateProfileAddress,
  updateProfilePhoto,
  updateProfileGallery,
  updateProfileLink,
  deleteProfile,
  deleteProfileLink,
  deleteInProfileGallery,
  updateSubProfile
};
