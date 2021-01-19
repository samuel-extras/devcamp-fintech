const Support = require("./../models/SupportModel");

const factory = require("./../factory/DBFactory");

exports.supportRequest = factory.createOne(Support);
exports.getSupports = factory.getAll(Support);

exports.resolveSupport = factory.updateOne(Support)
