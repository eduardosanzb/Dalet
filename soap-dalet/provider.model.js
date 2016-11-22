'use strict';
import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var ProvidersSchema = new mongoose.Schema({
  name: String,
  requestor_id: String,
  customer_id: String,
  customer_name: String,
  requestor_email: String,
  report_release: Number,
  url: String,
  stats:[{ type: Schema.Types.ObjectId, ref: 'Statistics' }],
  active: Boolean
},{collection:'providers'});

export default mongoose.model('Providers', ProvidersSchema);
