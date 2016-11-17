'use strict';

import mongoose from 'mongoose';

var JournalSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Journal', JournalSchema);
