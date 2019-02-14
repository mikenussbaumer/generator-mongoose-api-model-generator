/**
 * <%= modelName %> model events
 */

'use strict';

import {EventEmitter} from 'events';
var Events = new EventEmitter();

// Set max event listeners (0 == unlimited)
Events.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(<%= modelNameUp %>) {
  for(var e in events) {
    let event = events[e];
    <%= modelNameUp %>.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    Events.emit(`${event}:${doc._id}`, doc);
    Events.emit(event, doc);
  };
}

export {registerEvents};
export default Events;
