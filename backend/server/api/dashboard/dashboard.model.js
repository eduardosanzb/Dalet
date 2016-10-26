'use strict';

import mongoose from 'mongoose';

var DashboardSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Dashboard', DashboardSchema);
