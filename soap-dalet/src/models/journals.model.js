'use strict';
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var BooksSchema = new mongoose.Schema({
  _provider:{ type: Schema.Types.ObjectId, ref: 'Provider' },
  _career:{type: Schema.Types.ObjectId, ref: 'Career'},
  name: String,
  publisher: String,
  platform: String,
  print_ISNB: String,
  online_ISNB: String,
  attributes: {},
  stats:[Schema.Types.Mixed]
},{ strict: false });

export default mongoose.model('journals', BooksSchema);
