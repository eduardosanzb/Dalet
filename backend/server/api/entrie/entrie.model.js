'use strict';

import mongoose from 'mongoose';

var EntrieSchema = new mongoose.Schema({
  day: Date,
  visits: Number
});

export default mongoose.model('Entrie', EntrieSchema);
