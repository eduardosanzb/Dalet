/**
 * Facebook model events
 */

'use strict';

import {EventEmitter} from 'events';
import Facebook from './facebook.model';
var FacebookEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FacebookEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Facebook.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    FacebookEvents.emit(event + ':' + doc._id, doc);
    FacebookEvents.emit(event, doc);
  };
}

export default FacebookEvents;
