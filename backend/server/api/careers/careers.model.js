'use strict';

import mongoose from 'mongoose';

var CareersSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
},{ strict: false });

export default mongoose.model('Careers', CareersSchema);