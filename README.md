# youtube-auto-liker <img src="https://raw.githubusercontent.com/HatScripts/youtube-auto-liker/master/logo.svg" alt="youtube-auto-liker logo" height="48" align="right">

This userscript automatically likes videos of channels you're subscribed to on [YouTube](https://www.youtube.com/), after you've watched at least half of the video.

## Download

1. This is a userscript. To use it you'll first need one of the following browser extensions:

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
   * [GitHub](https://github.com/HatScripts/youtube-auto-liker/raw/master/youtube-auto-liker.user.js) (Recommended)
   * [Greasy Fork](https://greasyfork.org/en/scripts/33865-youtube-auto-liker)
   * [OpenUserJS](https://openuserjs.org/scripts/HatScripts/YouTube_Auto-Liker)

## Settings

You can configure the settings by clicking the 'Settings' button under 'YouTube Auto-Liker' in your userscript manager.

Option                 | Description                                         | Default
---------------------- | --------------------------------------------------- | -------
Debug mode             | Log debug messages to the console                   | off
Check frequency        | How often to attempt liking the video               | 5000 ms
Watch threshold        | The percentage of the video watched before liking   | 50%
Hide like notification | Hide like notification                              | off
Like if not subscribed | Like videos from channels you are not subscribed to | off

## TODO

* Add settings:
  * Retries - How many times to retry liking upon failure.
  * Whitelisted channels - A list of channels to *always* like the videos of, even if you are *not* subscribed to them.
  * Blacklisted channels - A list of channels to *never* like the videos of, even if you are subscribed to them.

## Acknowledgements

* The userscript itself was inspired by [this one](https://web.archive.org/web/20220405112705/https://greasyfork.org/en/scripts/4948-youtube-auto-like-videos/code) by JoeSimmons, which hasn't worked since 2015
* The debugger code was adapted from [this Stack Overflow answer](https://stackoverflow.com/a/32928812/2203482) by arctelix
* [GM_config](https://github.com/sizzlemctwizzle/GM_config) by sizzlemctwizzle is used for the settings interface
