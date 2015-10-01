'use strict';

declare function require(x: string): any;

var mongoose = require('mongoose');
var mongooseFS = require('mongoose-fs');

var fileSchema = mongoose.Schema({
    name: String,
    size: Number,
    creation_date: Date
});

fileSchema.plugin(mongooseFS, {keys: ['content', 'complement'], mongoose: mongoose});

module.exports =  mongoose.model('FileModel', fileSchema);