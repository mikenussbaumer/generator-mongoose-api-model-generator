'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './<%= modelName %>.events';

var Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

registerEvents(Schema);
export default mongoose.model('<%= modelName %>', Schema);
