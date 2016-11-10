'use strict';

import mongoose from 'mongoose';

var EntrieSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Entrie', EntrieSchema);
