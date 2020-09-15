# YouTube Auto-Liker <img src="https://raw.githubusercontent.com/HatScripts/youtube-auto-liker/master/logo.svg" alt="YouTube Auto-Liker logo" height="48" align="right">

This userscript automatically likes videos of channels you're subscribed to on [YouTube](https://www.youtube.com/), after you've watched at least half of the video.

## Download

1. This is a userscript. To use it you'll first need one of the following browser extensions/add-ons:

   |                    | Tampermonkey                     | Greasemonkey | Violentmonkey
   | ------------------ | -------------------------------- | ------------ | -------------
   | ![Chrome][c-logo]  | [Link][c-tm] ([Beta][c-tm-beta]) | -            | [Link][c-vm]
   | ![Firefox][f-logo] | [Link][f-tm]                     | [Link][f-gm] | -
   | ![Edge][e-logo]    | [Link][e-tm]                     | -            | -
   | ![Safari][s-logo]  | [Link][s-tm]                     | -            | -
   | ![Opera][o-logo]   | [Link][o-tm]                     | -            | [Link][o-vm]

[c-logo]: https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_24x24.png   "Chrome"
[f-logo]: https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_24x24.png "Firefox"
[e-logo]: https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_24x24.png       "Edge"
[s-logo]: https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_24x24.png   "Safari"
[o-logo]: https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_24x24.png     "Opera"
[c-tm]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
[c-tm-beta]: https://chrome.google.com/webstore/detail/tampermonkey-beta/gcalenpjmijncebpfijmoaglllgpjagf
[c-vm]: https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag
[f-tm]: https://addons.mozilla.org/firefox/addon/tampermonkey/
[f-gm]: https://addons.mozilla.org/firefox/addon/greasemonkey/
[e-tm]: https://www.microsoft.com/store/apps/9NBLGGH5162S
[s-tm]: https://safari.tampermonkey.net/tampermonkey.safariextz
[o-tm]: https://addons.opera.com/extensions/details/tampermonkey-beta/
[o-vm]: https://addons.opera.com/extensions/details/violent-monkey/

2. Then install this script from one of the following links:
* [GitHub](https://github.com/HatScripts/YouTubeAutoLiker/raw/master/youtube-auto-liker.user.js) (Recommended)
* [Greasy Fork](https://greasyfork.org/en/scripts/33865-youtube-auto-liker)
* [OpenUserJS](https://openuserjs.org/scripts/HatScripts/YouTube_Auto-Liker)

## Options

You can configure the following options by editing `OPTIONS` within the script.

Option                 | Description                                                       | Default setting 
---------------------- | ----------------------------------------------------------------- | ---------------
CHECK_FREQUENCY        | How often to attempt liking the video.                            | `5000`          
WATCH_THRESHOLD        | <p>The percentage of the video watched before liking.</p>![][im1] | `0.5`
HIDE_LIKE_NOTIFICATION | <p>Hide like notifications.</p>![][im2]                           | `false`
LIKE_IF_NOT_SUBSCRIBED | Whether to like videos when you are not subscribed.               | `false`

[im1]: readme-images/video-half-watched.png
[im2]: readme-images/like-notification.png

## TODO

* Add options:
  * Retries - How many times to retry liking upon failure.
  * Specific channels - A list of channels to like the videos of, regardless of whether you're subscribed to them.
* Add a UI so that the user can configure the options without needing to manually edit the script.

## Acknowledgements

- The userscript itself was inspired by [this one](https://greasyfork.org/en/scripts/4948-youtube-auto-like-videos) by JoeSimmons, which hasn't worked since 2015
- [Debugger code](https://github.com/HatScripts/YouTubeAutoLiker/blob/master/debugger.js) was adapted from [this Stack Overflow answer](http://stackoverflow.com/a/32928812/2203482) by arctelix
