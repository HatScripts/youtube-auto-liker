// ==UserScript==
// @name           YouTube Auto-Liker
// @name:zh        YouTube自動點讚
// @name:ja        YouTubeのような自動
// @namespace      https://github.com/HatScripts/youtube-auto-liker
// @version        1.3.27
// @description    Automatically likes videos of channels you're subscribed to
// @description:zh 對您訂閲的頻道視頻自動點讚
// @description:ja 購読しているチャンネルの動画が自動的に好きです
// @description:ru Автоматически нравится видео каналов, на которые вы подписаны
// @description:es Le gustan automáticamente los videos de los canales a los que está suscrito
// @description:pt Gosta automaticamente de vídeos de canais nos quais você está inscrito
// @author         HatScripts
// @license        MIT
// @icon           https://raw.githubusercontent.com/HatScripts/youtube-auto-liker/master/logo.svg
// @downloadurl    https://github.com/HatScripts/youtube-auto-liker/raw/master/youtube-auto-liker.user.js
// @updateurl      https://github.com/HatScripts/youtube-auto-liker/raw/master/youtube-auto-liker.user.js
// @match          http://*.youtube.com/*
// @match          https://*.youtube.com/*
// @require        https://raw.githubusercontent.com/sizzlemctwizzle/GM_config/master/gm_config.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @run-at         document-idle
// @noframes
// ==/UserScript==

/* global GM_config, GM_info, GM_registerMenuCommand */

(() => {
  'use strict'

  GM_config.init({
    id: 'ytal_config',
    title: GM_info.script.name + ' Settings',
    fields: {
      DEBUG_MODE: {
        label: 'Debug mode',
        type: 'checkbox',
        default: false,
        title: 'Log debug messages to the console'
      },
      CHECK_FREQUENCY: {
        label: 'Check frequency (ms)',
        type: 'number',
        min: 1,
        default: 5000,
        title: 'The number of milliseconds to wait between checking if video should be liked'
      },
      WATCH_THRESHOLD: {
        label: 'Watch threshold %',
        type: 'number',
        min: 0,
        max: 100,
        default: 50,
        title: 'The percentage watched to like the video at'
      },
      LIKE_IF_NOT_SUBSCRIBED: {
        label: 'Like if not subscribed',
        type: 'checkbox',
        default: false,
        title: 'Like videos from channels you are not subscribed to'
      },
      AUTO_LIKE_LIVE_STREAMS: {
        label: 'Auto-like live streams',
        type: 'checkbox',
        default: false,
        title: 'Automatically like live streams'
      }
    },
    events: {
      init: onInit
    }
  })

  GM_registerMenuCommand('Settings', () => {
    GM_config.open()
  })

  class Debugger {
    constructor (name, enabled) {
      this.debug = {}
      if (!window.console) {
        return () => { }
      }
      Object.getOwnPropertyNames(window.console).forEach(key => {
        if (typeof window.console[key] === 'function') {
          if (enabled) {
            this.debug[key] = window.console[key].bind(window.console, name + ': ')
          } else {
            this.debug[key] = () => { }
          }
        }
      })
      return this.debug
    }
  }

  var DEBUG

  const SELECTORS = {
    PLAYER: '#movie_player',
    SUBSCRIBE_BUTTON: ['#subscribe-button > ytd-subscribe-button-renderer'],
    LIKE_BUTTON: [
      '#top-level-buttons-computed like-button-view-model > button',
      '#segmented-like-button button'
    ],
    DISLIKE_BUTTON: [
      '#top-level-buttons-computed dislike-button-view-model > button',
      '#segmented-dislike-button button'
    ]
  }

  const autoLikedVideoIds = []

  function onInit() {
    DEBUG = new Debugger(GM_info.script.name, GM_config.get('DEBUG_MODE'))
    setInterval(wait, GM_config.get('CHECK_FREQUENCY'))
  }

  function getVideoId () {
    const elem = document.querySelector('#page-manager > ytd-watch-flexy')
    if (elem && elem.hasAttribute('video-id')) {
      return elem.getAttribute('video-id')
    } else {
      return new URLSearchParams(window.location.search).get('v')
    }
  }

  function watchThresholdReached () {
    const player = document.querySelector(SELECTORS.PLAYER)
    if (player) {
      const watched = player.getCurrentTime() / player.getDuration()
      const watchedTarget = GM_config.get('WATCH_THRESHOLD') / 100
      if (watched < watchedTarget) {
        DEBUG.info(`Waiting until watch threshold reached (${watched.toFixed(2)}/${watchedTarget})...`)
        return false
      }
    }
    return true
  }

  function isSubscribed () {
    DEBUG.info('Checking whether subscribed...')
    let subscribeButton
    for (const selector of SELECTORS.SUBSCRIBE_BUTTON) {
      subscribeButton = document.querySelector(selector)
      if (subscribeButton) { break }
    }
    if (!subscribeButton) {
      throw Error('Couldn\'t find sub button')
    }
    const subscribed = subscribeButton.hasAttribute('subscribe-button-invisible')
    DEBUG.info(subscribed ? 'We are subscribed' : 'We are not subscribed')
    return subscribed
  }

  function wait () {
    if (watchThresholdReached()) {
      try {
        if (GM_config.get('LIKE_IF_NOT_SUBSCRIBED') || isSubscribed()) {
          if (GM_config.get('AUTO_LIKE_LIVE_STREAMS') ||
            window.getComputedStyle(document.querySelector('.ytp-live-badge')).display === 'none') {
            like()
          }
        }
      } catch (e) {
        DEBUG.info(`Failed to like video: ${e}. Will try again in ${GM_config.get('CHECK_FREQUENCY')} ms...`)
      }
    }
  }

  function isButtonPressed (button) {
    return button.getAttribute('aria-pressed') === 'true'
  }

  function like () {
    DEBUG.info('Trying to like video...')

    let likeButton
    for (const selector of SELECTORS.LIKE_BUTTON) {
      likeButton = document.querySelector(selector)
      if (likeButton) { break }
    }
    if (!likeButton) {
      throw Error('Couldn\'t find like button')
    }

    let dislikeButton
    for (const selector of SELECTORS.DISLIKE_BUTTON) {
      dislikeButton = document.querySelector(selector)
      if (dislikeButton) { break }
    }
    if (!dislikeButton) {
      throw Error('Couldn\'t find dislike button')
    }

    const videoId = getVideoId()
    if (isButtonPressed(likeButton)) {
      DEBUG.info('Like button has already been clicked')
      autoLikedVideoIds.push(videoId)
    } else if (isButtonPressed(dislikeButton)) {
      DEBUG.info('Dislike button has already been clicked')
    } else if (autoLikedVideoIds.includes(videoId)) {
      DEBUG.info('Video has already been auto-liked. User must ' +
        'have un-liked it, so we won\'t like it again')
    } else {
      DEBUG.info('Found like button. It\'s unclicked. Clicking it...')
      likeButton.click()
      if (isButtonPressed(likeButton)) {
        autoLikedVideoIds.push(videoId)
        DEBUG.info('Successfully liked video')
      } else {
        DEBUG.info('Failed to like video')
      }
    }
  }
})()
