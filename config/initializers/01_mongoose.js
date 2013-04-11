var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/skylines');

var mongooseTypes = require("mongoose-3x-types");
mongooseTypes.loadTypes(mongoose);