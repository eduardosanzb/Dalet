/**
 * Journal model events
 */

'use strict';

import {EventEmitter} from 'events';
import Journal from './journal.model';
var JournalEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JournalEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Journal.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    JournalEvents.emit(event + ':' + doc._id, doc);
    JournalEvents.emit(event, doc);
  };
}

export default JournalEvents;
