ngVideo
===================

![Travis](https://api.travis-ci.org/Wildhoney/ngVideo.png)
&nbsp;
![npm](https://badge.fury.io/js/ng-video.png)

**Heroku**: [http://ng-video.herokuapp.com/](http://ng-video.herokuapp.com/)

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

`ngVideo` ships with a simple service that can be injected into your controllers, directives, services, et cetera...

Since the `video` service is what's used for adding video sources, we'll inject `video` into one of our controllers:

```javascript
myApp.controller('VideoController', ['video', function(video) {

    /* Controller... */
    
}]);
```

We can then subsequently add video sources to be played. For this grab yourself a [valid video source](http://www.w3schools.com/html/mov_bbb.mp4) and add it:

```javascript
video.addSource('mp4', 'http://www.example.com/alice-in-wonderland.mp4');
```

At this point you *should* notice that the video is visible in the player, but not actually playing &ndash; unless you specify the `autoplay` attribute on the `video` node &ndash; for the user to begin playing the video, you need to add the `vi-controls` directive.

Controls Directive
-------------------

Coming soon...