'use strict';

import mongoose from 'mongoose';

var ProvidersSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Providers', ProvidersSchema);
