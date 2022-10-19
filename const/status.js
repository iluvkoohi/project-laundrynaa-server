const throwError = (res, err) => {
    return res.status(400).json(err);
}


module.exports = {
    throwError,
}