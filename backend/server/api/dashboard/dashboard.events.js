/**
 * Dashboard model events
 */

'use strict';

import {EventEmitter} from 'events';
import Dashboard from './dashboard.model';
var DashboardEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DashboardEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Dashboard.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    DashboardEvents.emit(event + ':' + doc._id, doc);
    DashboardEvents.emit(event, doc);
  };
}

export default DashboardEvents;
