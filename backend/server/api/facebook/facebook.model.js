'use strict';

import mongoose from 'mongoose';

var FacebookSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Facebook', FacebookSchema);
