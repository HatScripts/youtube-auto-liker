# YouTube Auto-Liker <img src="https://raw.githubusercontent.com/HatScripts/youtube-auto-liker/master/logo.svg" alt="YouTube Auto-Liker logo" height="48" align="right">

This userscript automatically likes videos of channels you're subscribed to on [YouTube](https://www.youtube.com/), after you've watched at least half of the video.

## Download

1. This is a userscript. To use it you'll first need one of the following browser extensions:

   |                    | Tampermonkey                     | Greasemonkey | Violentmonkey
   | ------------------ | -------------------------------- | ------------ | -------------
   | ![Chrome][c-logo]  | [Link][c-tm] ([Beta][c-tm-beta]) | -            | [Link][c-vm] ([Beta][c-vm-beta])
   | ![Firefox][f-logo] | [Link][f-tm]                     | [Link][f-gm] | [Link][f-vm]
   | ![Edge][e-logo]    | [Link][e-tm] ([Beta][e-tm-beta]) | -            | [Link][e-vm]
   | ![Safari][s-logo]  | [Link][s-tm]                     | -            | -
   | ![Opera][o-logo]   | [Link][o-tm]                     | -            | -

[c-logo]: https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_24x24.png   "Chrome"
[f-logo]: https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_24x24.png "Firefox"
[e-logo]: https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_24x24.png       "Edge"
[s-logo]: https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_24x24.png   "Safari"
[o-logo]: https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_24x24.png     "Opera"
[c-tm]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
[c-tm-beta]: https://chrome.google.com/webstore/detail/tampermonkey-beta/gcalenpjmijncebpfijmoaglllgpjagf
[c-vm]: https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag
[c-vm-beta]: https://chrome.google.com/webstore/detail/violentmonkey-beta/opokoaglpekkimldnlggpoagmjegichg
[f-tm]: https://addons.mozilla.org/firefox/addon/tampermonkey/
[f-gm]: https://addons.mozilla.org/firefox/addon/greasemonkey/
[f-vm]: https://addons.mozilla.org/firefox/addon/violentmonkey/
[e-tm]: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd
[e-tm-beta]: https://microsoftedge.microsoft.com/addons/detail/tampermonkey-beta/fcmfnpggmnlmfebfghbfnillijihnkoh
[e-vm]: https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao
[s-tm]: https://safari.tampermonkey.net/tampermonkey.safariextz
[o-tm]: https://addons.opera.com/en/extensions/details/tampermonkey-beta/

2. Then install this script from one of the following links:
   * [GitHub](https://github.com/HatScripts/youtube-auto-liker/raw/master/youtube-auto-liker.user.js) (Recommended)
   * [Greasy Fork](https://greasyfork.org/en/scripts/33865-youtube-auto-liker)
   * [OpenUserJS](https://openuserjs.org/scripts/HatScripts/YouTube_Auto-Liker)

## Settings

You can configure the settings by clicking the 'Settings' button under 'YouTube Auto-Liker' in your userscript manager.

Setting                | Description                                         | Default
---------------------- | --------------------------------------------------- | -------
Debug mode             | Log debug messages to the console                   | off
Check frequency        | How often to attempt liking the video               | 5000 ms
Watch threshold        | The percentage of the video watched before liking   | 50%
Like if not subscribed | Like videos from channels you are not subscribed to | off

## TODO

* Add settings:
  * Retries - How many times to retry liking upon failure.
  * Whitelisted channels - A list of channels to *always* like the videos of, even if you are *not* subscribed to them.
  * Blacklisted channels - A list of channels to *never* like the videos of, even if you are subscribed to them.

## Acknowledgements

* The userscript itself was inspired by [this one](https://web.archive.org/web/20220405112705/https://greasyfork.org/en/scripts/4948-youtube-auto-like-videos/code) by JoeSimmons, which hasn't worked since 2015
* The debugger code was adapted from [this Stack Overflow answer](https://stackoverflow.com/a/32928812/2203482) by arctelix
* The settings interface uses [GM_config](https://github.com/sizzlemctwizzle/GM_config) by sizzlemctwizzle
