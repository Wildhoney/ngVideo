ngVideo
===================

![Travis](https://api.travis-ci.org/Wildhoney/ngVideo.png)
&nbsp;
![npm](https://badge.fury.io/js/ng-video.png)

* **Heroku**: [http://ng-video.herokuapp.com/](http://ng-video.herokuapp.com/)
* **Bower:** `bower install ngvideo`

---

`ngVideo` is a [HTML5 video player](http://www.html5rocks.com/en/tutorials/video/basics/) written in [Angular.js](https://angularjs.org/).

![ngVideo 0.2.0](http://i.imgur.com/dTJDd3u.png)

`ngVideo` utilises [Angular.js directives](https://docs.angularjs.org/guide/directive) extensively which compartmentalises the various components that make-up the overall `ngVideo` experience &ndash; meaning you get to pick and choose which you components you wish to utilise.

Directive Requirements
-------------------

When using `ngVideo`, the **only** required directive is the main `ng-video` directive which handles all of the core logic, as well as the `vi-screen` directive which is the player itself. All other directives **are** *optional*.

Getting Started
-------------------

Starting to use `ngVideo` is a breeze! Firstly you **must** define the container which will contain your *video* node.

```html
<section class="video" ng-video>
```

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

Directives
-------------------

### Buffer ######

With the buffer directive you can display a bar similar to the timeline which displays the buffered segments of the video &ndash; using the `canvas` element.

```html
<section vi-buffer></section>
```

Use the `ngVideoOptions` for modifying the necessary values pertaining to the `vi-buffer` directive: `BUFFER_COLOUR`, `BUFFER_HEIGHT`, `BUFFER_WIDTH`.

**Note:** `ngVideoOptions` can be injected into your controllers in the same way as services.

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
Currently the `vi-feedback` supports the following properties &ndash; as of `ngVideo@0.2.1`:

 * `currentTime`;
 * `duration`;
 * `volume`;
 * `buffered`;
 * `loading`;
 * `playing`;
 
### Playlist #####

With the `vi-playlist` directive you can manage your list of videos &ndash; by applying the `vi-playlist` directive, it overrides the `videos` array, which now contains valid models that can be passed into the `open` method:

```html
<section vi-playlist>

    <ul>
        <li ng-repeat="video in videos" ng-click="open(video)">
            {{video}}
        </li>
    </ul>

</section>
```

As well as listing the videos in the current playlist, the `vi-playlist` contains useful methods for traversing the playlist:

 * `next()`;
 * `previous()`;
 * `first()`;
 * `last()`;
 
### Screen #####

The `vi-screen` directive is the **only** mandatory directive &ndash; along with the core `ng-video` directive for managing the core logic. It is also one of the simplest directives, because it simply outputs the `video` note &ndash; with a little behaviour thrown in.

```html
<video vi-screen></video>
```

### Timeline #####

Keeping with the simplicity of the `vi-screen` directive, the `vi-timeline` is equally as simple, and contains the `input` &ndash; with type `range` for notifying the user of which position they're at in the current video/audio.

```html
<input vi-timeline />
```

### Volume #####

Directive has the ability of modifying the volume and bundles with three useful directives for common tasks: `vi-volume-decrease` for decreasing the volume, `vi-volume-increase` for increasing, and the `vi-volume-mute` directive for muting the audio. However, the `vi-volume` directive has access to the `setVolume` method which allows you to specify the audio level.

```html
<section vi-volume>

    <a vi-volume-decrease>Decrease</a>
    <a vi-volume-increase>Increase</a>
    <a vi-volume-mute>Mute</a>

</section>
```

**Note:** For access to the `volume` property, it is necessary for the `vi-volume` directive to be a child of the `vi-feedback` directive.