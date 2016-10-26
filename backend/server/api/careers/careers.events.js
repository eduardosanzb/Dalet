/**
 * Careers model events
 */

'use strict';

import {EventEmitter} from 'events';
import Careers from './careers.model';
var CareersEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CareersEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Careers.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    CareersEvents.emit(event + ':' + doc._id, doc);
    CareersEvents.emit(event, doc);
  };
}

export default CareersEvents;
