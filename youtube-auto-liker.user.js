// ==UserScript==
// @name           YouTube Auto-Liker
// @name:zh        YouTube自動點讚
// @name:ja        YouTubeのような自動
// @namespace      https://github.com/HatScripts/YouTubeAutoLiker
// @version        1.1.4
// @description    Automatically likes videos of channels you're subscribed to
// @description:zh 對您訂閲的頻道視頻自動點讚
// @description:ja このスクリプトは、あなたが購読しているチャンネルの動画を自動的に好きです
// @description:ru Этот сценарий автоматически нравится видео каналов, на которые вы подписаны
// @description:es A este script le gustan los videos de los canales a los que está suscrito
// @description:pt Este script gosta automaticamente dos vídeos dos canais aos quais está inscrito
// @author         HatScripts
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
        CHECK_FREQUENCY: 5000,
        WATCH_THRESHOLD: 0.5,
    }
    const SELECTORS = {
        PLAYER:              '#movie_player',
        SUBSCRIPTION_BUTTON: '#subscribe-button paper-button, .yt-uix-subscription-button',
        LIKE_BUTTON:         'ytd-video-primary-info-renderer #top-level-buttons > ytd-toggle-button-renderer:nth-child(1), .like-button-renderer-like-button:not(.hid)',
    }
    const LIKE_BUTTON_CLICKED_CLASSES = ['style-default-active', 'like-button-renderer-like-button-clicked']

    setTimeout(wait, OPTIONS.CHECK_FREQUENCY)

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
                setTimeout(wait, OPTIONS.CHECK_FREQUENCY)
            }
        } else {
            setTimeout(wait, OPTIONS.CHECK_FREQUENCY)
        }
    }

    function like() {
        DEBUG.info('Trying to like video...')
        let likeButton = document.querySelector(SELECTORS.LIKE_BUTTON)
        if (!likeButton) {
            throw 'Couldn\'t find like button'
        }
        if (LIKE_BUTTON_CLICKED_CLASSES.some(function (c) {
                return likeButton.classList.contains(c)
            })) {
            DEBUG.info('Like button has already been clicked')
        } else {
            DEBUG.info('Found like button')
            DEBUG.info('It\'s unclicked. Clicking it...')
            likeButton.click()
            DEBUG.info('Successfully liked video')
        }
    }
}())
