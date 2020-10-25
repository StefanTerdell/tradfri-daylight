# TRADFRI-DAYLIGHT

Tradfri-Daylight is a node.js typescript application that controls all the dimmable lights in your Ikea Trådfri gateway by fading the dimmers between specified times. It also lowers the temperature of the lights before sunrise and sunsets, with given fade durations for morning and twilight.

## Setup

1. Run `npm i`,
2. Manipulate the `options.json` file if needed. See chart below for explanations. See a chart of the results by running `npm test`,
3. Check the back of your gateway for the security key and export it as env var IKEASECURITY. Bash: `export IKEASECURITY=code`, powershell: `$env:IKEASECURITY='code'`. _You only need to do this once; the resulting token is saved by the Conf package._
4. Run `npm start`,

## Options

| key                 | scalar  | explanation                                                       |
| ------------------- | ------- | ----------------------------------------------------------------- |
| dimmerMax           | percent | The maximum brightness to dim to.                                 |
| dimmerMin           | percent | The minimum brightness to dim to.                                 |
| fadeInAt            | hour    | Hour of the day to start fading in.                               |
| fullyLitAt          | hour    | Hour of the day where brightness reaches maximum.                 |
| fadeOutAt           | hour    | Hour of the day to start fading out brightness.                   |
| fullyDimmedAt       | hour    | Hour of the day where brightness reaches minimum.                 |
| temperatureMin      | percent | The coldest light temperature (typically midday).                 |
| temperatureMax      | percent | The warmest light temperature (early mornings and late evenings). |
| temperatureMaxBySun | percent | The warmest light temperature that is allowed to be set by twilight approaching. Setting this to something lower than `temperatureMax` creates a sort of shelf in the evening, where light doesnt get warmer even though the sun may have set - until the brightness dimmer brings it up in reverse to itself. |
| morningHours        | hour    | The fade in duration of cold light after sunrise.                 |
| twilightHours       | hour    | The fade in duration of warm light after sunset.                  |


