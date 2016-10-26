'use strict';

import mongoose from 'mongoose';

var BooksSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Books', BooksSchema);
