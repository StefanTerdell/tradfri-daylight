# TRADFRI-DAYLIGHT

Tradfri-Daylight is a node.js typescript application that controls your Ikea Trådfri lights to keep the temperature in sync with the sun and also dim them up in the mornings and down in the evenings.

There are 4 programs (wakeup, sunrise, sunset and sleep) which follow these simple rules:
- The wakeup program will always start dimming up at a set time but only transition the color temperature if the transition starts before the sunrise program.
- The sunrise program will always start transitioning the color but start dimming up only if the transition starts before the wakeup program.
- The sunset program will only dim down the lights and set the temperature if it starts before the sleep program.
- The sleep program will always dim down the lights and temperature.

All times in `option.json` are treated as hours, ie: 13.5 corresponds to 1:30 PM.