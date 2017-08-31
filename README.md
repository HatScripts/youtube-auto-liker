# YouTube Auto-Liker <img src="https://cdn.rawgit.com/HatScripts/YouTubeAutoLiker/master/logo.svg" alt="YouTube Auto-Liker logo" height="48" align="right">

This userscript automatically likes videos of channels you're subscribed to on [YouTube](https://www.youtube.com/), after you've watched at least half of the video.

## Download

1. This is a userscript. To use it you'll first need one of the following browser extensions/add-ons:

   |   | Tampermonkey | Greasemonkey | Violentmonkey |
   |---|--------------|--------------|---------------|
   ![Chrome](https://hatscripts.com/a.svg?i=chrome&w=24 "Chrome") | [Link](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) ([Beta](https://chrome.google.com/webstore/detail/tampermonkey-beta/gcalenpjmijncebpfijmoaglllgpjagf)) | - | [Link](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)
   ![Firefox](https://hatscripts.com/a.svg?i=firefox&w=24 "Firefox") | [Link](https://addons.mozilla.org/firefox/addon/tampermonkey/) | [Link](https://addons.mozilla.org/firefox/addon/greasemonkey/) | - |
   ![Edge](https://hatscripts.com/a.svg?i=microsoft-edge&w=24 "Edge") | [Link](https://www.microsoft.com/store/apps/9NBLGGH5162S) | - | - |
   ![Safari](https://hatscripts.com/a.svg?i=safari&w=24 "Safari") | [Link](https://safari.tampermonkey.net/tampermonkey.safariextz) | - | - |
   ![Opera](https://hatscripts.com/a.svg?i=opera&w=24 "Opera") | [Link](https://addons.opera.com/extensions/details/tampermonkey-beta/) | - | [Link](https://addons.opera.com/extensions/details/violent-monkey/)

2. Then install this script from one of the following links:
* [GitHub](https://github.com/HatScripts/YouTubeAutoLiker/raw/master/youtube-auto-liker.user.js)
* [OpenUserJS](https://openuserjs.org/install/HatScripts/YouTube_Auto-Liker.user.js)

## Todo

- [ ] Hide "Added to Liked videos" notifications
- [ ] Add user options:

    Option                        | Default     | Description/image
    ----------------------------- | ----------- | -----------------
    Like if subscribed            | `true`      | Whether to like videos by any of your subscriptions.
    Specific channels             | `[]`        | A list of channels to like the videos of.
    Like after % of video watched | `0.5`       | <p>The percentage of the video watched before liking:</p>![](readme-images/video-half-watched.png)
    Hide like notifications       | `false`     | <p>Hide "Added to Liked videos" notifications:</p>![](readme-images/like-notification.png)
    Retries                       | `5`         | How many times to retry liking upon failure.
    Retry frequency               | `5000`      | The frequency of the retries, in milliseconds.

## Acknowledgements

- The userscript itself was based on [this one](https://greasyfork.org/en/scripts/4948-youtube-auto-like-videos), which hasn't worked since 2015
- Debugger code was adapted from [this Stack Overflow answer](http://stackoverflow.com/a/32928812/2203482)
- Icons by [Icons8](https://icons8.com/)