'use strict';

import mongoose from 'mongoose';

var EntrieSchema = new mongoose.Schema({
  title: Number,
  start: String,
  color: String
});

export default mongoose.model('Entrie', EntrieSchema);
