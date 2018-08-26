// ==UserScript==
// @name           YouTube Auto-Liker
// @name:zh        YouTube自動點讚
// @name:ja        YouTubeのような自動
// @namespace      https://github.com/HatScripts/YouTubeAutoLiker
// @version        1.2.2
// @description    Automatically likes videos of channels you're subscribed to
// @description:zh 對您訂閲的頻道視頻自動點讚
// @description:ja 購読しているチャンネルの動画が自動的に好きです
// @description:ru Автоматически нравится видео каналов, на которые вы подписаны
// @description:es Le gustan automáticamente los videos de los canales a los que está suscrito
// @description:pt Gosta automaticamente de vídeos de canais nos quais você está inscrito
// @author         HatScripts
// @license        MIT
// @icon           https://cdn.rawgit.com/HatScripts/YouTubeAutoLiker/master/logo.svg
// @match          http://*.youtube.com/watch*
// @match          https://*.youtube.com/watch*
// @require        https://greasyfork.org/scripts/33864-debugger/code/Debugger.js
// @run-at         document-idle
// @noframes
// ==/UserScript==

(function () {
    'use strict'

    const DEBUG_ENABLED = GM_info.script.version === 'DEV_VERSION'
    const DEBUG = new Debugger(GM_info.script.name, DEBUG_ENABLED)
    const OPTIONS = {
        CHECK_FREQUENCY:        5000,
        WATCH_THRESHOLD:        0.5,
        HIDE_LIKE_NOTIFICATION: false,
    }
    const SELECTORS = {
        PLAYER:              '#movie_player',
        SUBSCRIPTION_BUTTON: '#subscribe-button paper-button, .yt-uix-subscription-button',
        LIKE_BUTTON:         'ytd-video-primary-info-renderer #top-level-buttons > ytd-toggle-button-renderer:nth-child(1), .like-button-renderer-like-button:not(.hid)',
        NOTIFICATION:        'ytd-popup-container',
    }
    const LIKE_BUTTON_CLICKED_CLASSES = ['style-default-active', 'like-button-renderer-like-button-clicked']

    let autoLikedVideoIds = []

    setTimeout(wait, OPTIONS.CHECK_FREQUENCY)

    function getVideoId() {
        let elem = document.querySelector('#page-manager > ytd-watch-flexy')
        if (elem && elem.hasAttribute('video-id')) {
            return elem.getAttribute('video-id')
        } else {
            let queryString = window.location.search
            return queryString.substr(queryString.indexOf('v=') + 2, 11)
        }
    }

    function watchThresholdReached() {
        let player = document.querySelector(SELECTORS.PLAYER)
        if (player) {
            return player.getCurrentTime() / player.getDuration() >= OPTIONS.WATCH_THRESHOLD
        }
        return true
    }

    function isSubscribed() {
        DEBUG.info('Checking whether subscribed...')
        let subscriptionButton = document.querySelector(SELECTORS.SUBSCRIPTION_BUTTON)
        if (!subscriptionButton) {
            throw 'Couldn\'t find sub button'
        }
        return subscriptionButton.hasAttribute('subscribed') || subscriptionButton.dataset.isSubscribed
    }

    function wait() {
        if (watchThresholdReached()) {
            try {
                if (isSubscribed()) {
                    DEBUG.info('We are subscribed')
                    like()
                } else {
                    DEBUG.info('We are not subscribed')
                }
            } catch (e) {
                DEBUG.info('Failed to like video: ' + e + '. Will try again in 5 seconds...')
            }
        }
        setTimeout(wait, OPTIONS.CHECK_FREQUENCY)
    }

    function hideLikeNotification() {
        DEBUG.info('Trying to hide notification...')
        let notification = document.querySelector(SELECTORS.NOTIFICATION)
        if (notification) {
            DEBUG.info('Found notification. Hiding it...')
            notification.style.display = 'none'
            setTimeout(() => {
                DEBUG.info('Un-hiding notification')
                notification.style.removeProperty('display')
            }, 5000)
        } else {
            DEBUG.info('Couldn\'t find notification')
        }
    }

    function like() {
        DEBUG.info('Trying to like video...')
        let likeButton = document.querySelector(SELECTORS.LIKE_BUTTON)
        if (!likeButton) {
            throw 'Couldn\'t find like button'
        }
        let videoId = getVideoId()
        if (LIKE_BUTTON_CLICKED_CLASSES.some(c => likeButton.classList.contains(c))) {
            DEBUG.info('Like button has already been clicked')
            autoLikedVideoIds.push(videoId)
        } else if (autoLikedVideoIds.includes(videoId)) {
            DEBUG.info('Video has already been auto-liked. User must ' +
                'have un-liked it, so we won\'t like it again')
        } else {
            DEBUG.info('Found like button')
            if (OPTIONS.HIDE_LIKE_NOTIFICATION) {
                hideLikeNotification()
            }
            DEBUG.info('It\'s unclicked. Clicking it...')
            likeButton.click()
            autoLikedVideoIds.push(videoId)
            DEBUG.info('Successfully liked video')
        }
    }
}())
