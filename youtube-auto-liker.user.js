// ==UserScript==
// @name            YouTube Auto-Liker
// @name:zh         YouTube自動點讚
// @name:ja         YouTubeのような自動
// @namespace       https://github.com/HatScripts/YouTubeAutoLiker
// @version         1.0.1
// @description     Automatically likes videos of channels you're subscribed to
// @description:zh  對您訂閲的頻道視頻自動點讚
// @description:ja  このスクリプトは、あなたが購読しているチャンネルの動画を自動的に好きです
// @description:ru  Этот сценарий автоматически нравится видео каналов, на которые вы подписаны
// @description:es  A este script le gustan los videos de los canales a los que está suscrito
// @description:pt  Este script gosta automaticamente dos vídeos dos canais aos quais está inscrito
// @description:fil Ang script na ito ay awtomatikong may gusto mga video ng channel kung saan ka naka-subscribe
// @author          HatScripts
// @icon            logo.svg
// @match           http://*.youtube.com/watch*
// @match           https://*.youtube.com/watch*
// @require         https://github.com/HatScripts/YouTubeAutoLiker/raw/master/debugger.min.js
// @run-at          document-idle
// @noframes
// ==/UserScript==

(function () {
    'use strict'

    const name = GM_info.script.name
    const version = GM_info.script.version
    const debugEnabled = version === 'DEV_VERSION'
    const debug = new Debugger(name, debugEnabled)
    const options = {
        checkFrequency: 5000,
        watchThreshold: 0.5,
        closeShareTab:  true,
    }

    setTimeout(wait, options.checkFrequency)

    function watchThresholdReached() {
        let player = document.querySelector("#movie_player")
        if (player) {
            return player.getCurrentTime() / player.getDuration() >= options.watchThreshold
        }
        return true
    }

    function isSubscribed() {
        debug.info('Checking whether subscribed...')
        let subBtn = document.querySelector('.yt-uix-subscription-button')
        if (!subBtn) {
            throw 'Couldn\'t find sub button'
        }
        return subBtn.dataset.isSubscribed
    }

    function wait() {
        if (watchThresholdReached()) {
            try {
                if (isSubscribed()) {
                    like()
                }
            } catch (e) {
                debug.info('Failed to like video: ' + e + '. Will try again in 5 seconds...')
                setTimeout(wait, options.checkFrequency)
            }
        } else {
            setTimeout(wait, options.checkFrequency)
        }
    }

    function like() {
        debug.info('Trying to like video...')
        let likeBtn = document.querySelector('.like-button-renderer-like-button:not(.hid)')
        if (!likeBtn) {
            throw 'Couldn\'t find like button'
        }
        if (likeBtn.classList.contains('like-button-renderer-like-button-clicked')) {
            debug.info('Like button has already been clicked')
        } else {
            debug.info('Found like button')
            debug.info('It\'s unclicked. Clicking it...')
            likeBtn.click()
            debug.info('Successfully liked video')
            if (options.closeShareTab) {
                setTimeout(closeShareTab, 100)
            }
        }
    }

    function closeShareTab() {
        let dismissBtn = document.querySelector('#watch-action-panels:not(.hid) #action-panel-dismiss')
        if (dismissBtn) {
            debug.info('Closing share tab...')
            dismissBtn.click()
        }
    }
}())