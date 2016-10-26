/**
 * Providers model events
 */

'use strict';

import {EventEmitter} from 'events';
import Providers from './providers.model';
var ProvidersEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProvidersEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Providers.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ProvidersEvents.emit(event + ':' + doc._id, doc);
    ProvidersEvents.emit(event, doc);
  };
}

export default ProvidersEvents;
