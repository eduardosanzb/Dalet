'use strict';

import mongoose from 'mongoose';

var ProvidersSchema = new mongoose.Schema({
  name: String,
  requestor_id: String,
  customer_id: String,
  customer_name: String,
  requestor_email: String,
  report_release: Number,
  url: String,
  active: Boolean
});

export default mongoose.model('Providers', ProvidersSchema);
