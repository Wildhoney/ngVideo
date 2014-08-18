ngVideo
===================

![Travis](http://img.shields.io/travis/Wildhoney/ngVideo.svg?style=flat)
&nbsp;
![npm](http://img.shields.io/npm/v/ng-video.svg?style=flat)
&nbsp;
![License MIT](http://img.shields.io/badge/License-MIT-lightgrey.svg?style=flat)

* **Heroku**: [http://ng-video.herokuapp.com/](http://ng-video.herokuapp.com/)
* **Bower:** `bower install ngvideo`

---

`ngVideo` is a [HTML5 video player](http://www.html5rocks.com/en/tutorials/video/basics/) written in [Angular.js](https://angularjs.org/).

![ngVideo 0.3.2](http://i.imgur.com/PoF8j70.png)

`ngVideo` utilises [Angular.js directives](https://docs.angularjs.org/guide/directive) extensively which compartmentalises the various components that make-up the overall `ngVideo` experience &ndash; meaning you get to [pick and choose](#custom-build) which components you wish to utilise.

Directive Requirements
-------------------

When using `ngVideo`, the **only** required directive is the main `ng-video` directive which handles all of the core logic, as well as the `vi-screen` directive which is the player itself. All other directives **are** *optional*.

Getting Started
-------------------

**Terminology:** When we mention `videoModel` we mean the `object` that is returned from `addSource`/`save`.

Starting to use `ngVideo` is a breeze! Firstly you **must** define the container which will contain your *video* node.

```html
<section class="video" ng-video>
```

**Note:** You can load multi-sources for each video for fallback purposes with [`multiSource`](#multi-source).

You then need to fulfill the only other requirement for `ngVideo` &ndash; the `video` node:

```html
<video vi-screen></video>
```

After that you have all that's necessary to begin playing videos &ndash; albeit without any user control.

`ngVideo` ships with a simple service that can be injected into your controllers, directives, services, et cetera... Since the `video` service is what's used for adding video sources, we'll inject `video` into one of our controllers:

```javascript
myApp.controller('VideoController', ['$scope', 'video', function($scope, video) {

    /* Controller... */
    
}]);
```

We can then subsequently add video sources to be played. For this grab yourself a [valid video source](http://www.w3schools.com/html/mov_bbb.mp4) and add it:

```javascript
video.addSource('mp4', 'http://www.example.com/alice-in-wonderland.mp4');
```

At this point you *should* notice that the video is visible in the player, but not actually playing &ndash; unless you specify the `autoplay` attribute on the `video` node &ndash; for the user to begin playing the video, you need to add the [`vi-controls` directive](#controls).

---

Multi Source
-------------------

Not all browsers support the same media types, and therefore `ngVideo` comes bundled with a way to load multiple source types for each of your videos &ndash; `ngVideo` will attempt to play the first video in the source collection, and if unsupported, move to the next one, and so on.

```javascript
var source = video.multiSource();
source.addSource('mp4', 'http://www.example.com/master-and-margarita.mp4');
source.addSource('ogg', 'http://www.example.com/master-and-margarita.ogg');
source.save();
```

Once you invoke the `save` method, the video will be either played, or added to the playlist for later.

---

Directives
-------------------

 * [Buffer](#buffer): Buffered segments of video;
 * [Controls](#controls): Play and pause buttons;
 * [Feedback](#feedback): Real-time video data;
 * [Full Screen](#full-screen): Open player in full screen;
 * [Meta](#meta): Reading meta data from videos;
 * [Messages](#messages): Subscribes to various `video` callbacks;
 * [Playback Rate](#playback-rate): Adjusting the playback;
 * [Playlist](#playlist): Managing a video/audio playlist;
 * [Seekable](#seekable): Update the player's current time;
 * [Screen](#screen): Appending the `screen` element;
 * [Timeline](#timeline): `input` representing current time;
 * [Volume](#volume): Managing the volume control;

### Buffer ######

With the buffer directive you can display a bar similar to the timeline which displays the buffered segments of the video &ndash; using the `canvas` element.

```html
<section vi-buffer></section>
```

Use the `ngVideoOptions` for modifying the necessary values pertaining to the `vi-buffer` directive: `BUFFER_COLOUR`, `BUFFER_HEIGHT`, `BUFFER_WIDTH`.

**Note:** `ngVideoOptions` can be injected into your controllers in the same way as services: see [`ngVideoOptions`](#configuration).

Example of two buffering segments from Safari with `ngVideo@0.2.2` &ndash; notice the two red lines:

![ngVideo 0.2.2](http://i.imgur.com/uyNp5Xc.png)

### Controls ######

The `vi-controls` directive allows you to add a play button and a pause button to your player &ndash; `vi-controls-play` and `vi-controls-pause` respectively, where `vi-controls` serves as the parent which contains the logic.

```html
<section vi-controls>
    <a vi-controls-play>Play</a>
    <a vi-controls-pause>Pause</a>
</section>
```

### Feedback #####

Provides information relating to the video itself &ndash; such as the `duration`, `loading`, et cetera... By adding the `vi-feedback` directive to a node, your node will inherit **lots** of useful properties for the end user.

```html
<section vi-feedback>

    <ul>
        <li>Time: {{currentTime}}s / {{duration}}s</li>
        <li>Volume: {{volume}}</li>
        <li>Buffered: {{buffered}}%</li>
        <li>Loading: {{loading}}</li>
        <li>Playing: {{playing}}</li>
    </ul>

</section>
```
Currently the `vi-feedback` supports the following properties &ndash; as of `ngVideo@0.3.0`:

 * `buffering`;
 * `currentTime`;
 * `duration`;
 * `volume`;
 * `buffered`;
 * `loading`;
 * `playing`;
 * `playbackRate`;
 
 
### Full Screen ###

With the `vi-full-screen` directive you can open the player into full-screen mode depending on [browser support](http://caniuse.com/#search=full%20screen).

```html
<a vi-full-screen-toggle>Toggle Full-Screen!</a>
```

With the `vi-full-screen-toggle` directive, `ngVideo` whether it should open or close the full screen mode. If you wish to force either the open and close, or have two different buttons for each action, then you can use `vi-full-screen-open` and `vi-full-screen-close` in place of vi-full-screen-toggle.
 
### Meta #####

In some cases you may wish to read the meta data of a video **without** actually playing it. For example, you may wish to know the duration of a video for the playlist &ndash; just so the user knows!

Simply wrap the `videoModel` in the `vi-meta` directive and you will have access to the video's meta data:

```html
<span vi-meta ng-model="video">
    {{duration}} seconds.
</span>
```

### Messages #####

With the `vi-messages` directive you can subscribe to all of the native `video` events and filter them depending on whether they're informational or a more serious error.

```html
<section vi-messages>

    <ul>
        <li ng-repeat="message in messages">
            
            Date: {{message.date}}
            Text: {{message.text}}
            Type: {{message.type}}
            
        </li>
            
    </ul>

</section>
```

### Playback Rate ###

By adjusting the playback rate you can increase of decrease the speed of the video &ndash; you can achieve this with the `vi-playback-rate` directive which sets the playback rate in absolute terms. You also have `vi-playback-rate-increment`, `vi-playback-rate-decrement` and `vi-playback-rate-normalise`.

```html
<section>
    <span vi-playback-rate="2">Double Speed</span>
    <span vi-playback-rate-increment="1">Increment by 1</span>
    <span vi-playback-rate-decrement="1">Decrement by 1</span>
    <span vi-playback-rate-normalise>Normalise</span>
</section>
```
 
### Playlist #####

With the `vi-playlist` directive you can manage your list of videos &ndash; by applying the `vi-playlist` directive; it overrides the `videos` array. With your `videoModel` you should attach it to the directive using the `ng-model` attribute.

```html
<section vi-playlist>

    <ul>
        <li vi-playlist-video ng-repeat="video in videos" ng-model="video">
            Play: {{video.src}}
        </li>   
    </ul>

</section>
```

As well as listing the videos in the current playlist, the `vi-playlist` contains useful methods for traversing the playlist:

 * `next()`;
 * `previous()`;
 * `first()`;
 * `last()`;
 
**Note:** You don't need to use the `ng-model` approach; `vi-playlist` has access to the `open` method which requires the passing in of the `videoModel`.

### Seekable #####

Using the `vi-seekable` directive you can update the player's current time either absolutely or relative to the current time. For this `ngVideo` has three directives: `vi-seekable`, `vi-seekable-increment`, and `vi-seekable-decrement`.

Each of the three directive accepts a parameter which is used to either set the time in seconds absolutely &ndash; as in the case of `vi-seekable`, or relatively, in the case of both `vi-seekable-increment` and `vi-seekable-decrement`

```html
<section>
    <span vi-seekable="20">20 Seconds</span>
    <span vi-seekable-decrement="10">Minus 10 Seconds</span>
    <span vi-seekable-increment="10">Plus 10 Seconds</span>
</section>
```

### Screen #####

The `vi-screen` directive is the **only** mandatory directive &ndash; along with the core `ng-video` directive for managing the core logic. It is also one of the simplest directives, because it simply outputs the `video` node &ndash; with a little behaviour thrown in.

```html
<video vi-screen></video>
```

### Timeline #####

Keeping with the simplicity of the `vi-screen` directive, the `vi-timeline` is equally as simple, and contains the `input` &ndash; with type `range` for notifying the user of which position they're at in the current video/audio.

```html
<input vi-timeline />
```

### Volume #####

Directive has the ability of modifying the volume and bundles with four useful directives for common tasks: `vi-volume-decrease` for decreasing the volume, `vi-volume-increase` for increasing, `vi-volume-loudest` for the maximum volume, and the `vi-volume-mute` directive for muting the audio. However, the `vi-volume` directive has access to the `setVolume` method which allows you to specify the audio level.

```html
<section vi-volume>

    <a vi-volume-decrease>Decrease</a>
    <a vi-volume-increase>Increase</a>
    <a vi-volume-mute>Mute</a>
    <a vi-volume-loudest>Loudest</a>

</section>
```

**Note:** For access to the `volume` property, it is necessary for the `vi-volume` directive to be a child of the `vi-feedback` directive.

---

Configuration
-------------------

`ngVideo` uses `ngVideoOptions` for its configuration parameters &ndash; `ngVideoOptions` is injectable into a controller in the same way as a service is.

```javascript
myApp.controller('VideoController', ['$scope', 'ngVideoOptions',

function($scope, ngVideoOptions) {

    // Change the colour of the buffer bar to blue.
    ngVideoOptions.BUFFER_COLOUR = '#00f';
    
}]);
```

You can inspect the `ngVideoOptions` object using your favourite debugger.

Below are a few of the parameters you may wish to play with:

 * `REFRESH`: Properties refresh `interval` in milliseconds &ndash; default being 50 milliseconds;
 * `VOLUME_STEPS`: Incremental and decremental steps of the volume &ndash; default 0.1;
 * `VOLUME_MAXIMUM`: Maximum volume that can be set &ndash; default is 1;
 * `VOLUME_MINIMUM`: Minimum volume that can be set &ndash; default is 0;
 * `BUFFER_COLOUR`: Colour of the `canvas` element in the `vi-buffer` directive;
 * `BUFFER_HEIGHT`: Height of the `canvas` node in the aforementioned directive;
 * `BUFFER_WIDTH`: Width of the `canvas` node in the aforementioned directive;
 * `SCREEN_CHANGE`: Whether clicking on `video` toggles video state;
 * `TIMELINE_CHANGE`: Whether changing `range` reflects in seeking;
 
---
 
Custom Build
-------------------

As `ng-video` has a modular design, you can compile your own version of `ng-video` depending on the directives you wish to use.

For example if you want a simple player with the play and pause buttons, and a volume control, then including the entire `ng-video` module would be wasteful. Instead you could compile your own `ng-video.custom.min.js` using the following `grunt` command:

```
grunt custom --modules=Controls,Volume
```

Each of the modules are separated by a comma &ndash; and three essential modules are included no matter what: `Service.js`, `Bootstrap.js`, and `Screen.js`.

Once you've issued the `grunt custom` command your custom builds &ndash; development and minified, will be present in the **dist/custom** directory.

---

Contributing
-------------------

![Karma.js](http://karma-runner.github.io/assets/img/banner.png)

`ngVideo` uses Jasmine with the Karma runner. All contributions to `ngVideo` are welcome!

Please add a unit-test for your addition &ndash; or removal, and then run all of the tests using `karma start KarmaUnit.js`, or with Grunt: `grunt test`.

Once you've committed your changes to your branch and all tests are passing, please open a [pull request](https://github.com/Wildhoney/ngVideo/pulls) for review.