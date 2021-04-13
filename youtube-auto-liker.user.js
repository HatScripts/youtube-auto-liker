// ==UserScript==
// @name           YouTube Auto-Liker
// @name:zh        YouTube自動點讚
// @name:ja        YouTubeのような自動
// @namespace      https://github.com/HatScripts/youtube-auto-liker
// @version        1.3.1
// @description    Automatically likes videos of channels you're subscribed to
// @description:zh 對您訂閲的頻道視頻自動點讚
// @description:ja 購読しているチャンネルの動画が自動的に好きです
// @description:ru Автоматически нравится видео каналов, на которые вы подписаны
// @description:es Le gustan automáticamente los videos de los canales a los que está suscrito
// @description:pt Gosta automaticamente de vídeos de canais nos quais você está inscrito
// @author         HatScripts
// @license        MIT
// @icon           https://raw.githubusercontent.com/HatScripts/youtube-auto-liker/master/logo.svg
// @match          http://*.youtube.com/*
// @match          https://*.youtube.com/*
// @run-at         document-idle
// @noframes
// ==/UserScript==

/* global GM_info */

(() => {
  'use strict'

  function Debugger (name, enabled) {
    this.debug = {}
    if (!window.console) {
      return () => {}
    }
    for (let m in console) {
      if (typeof console[m] === 'function') {
        if (enabled) {
          this.debug[m] = console[m].bind(window.console, name + ': ')
        } else {
          this.debug[m] = () => {}
        }
      }
    }
    return this.debug
  }

  const DEBUG_ENABLED = GM_info.script.version === 'DEV_VERSION'
  const DEBUG = new Debugger(GM_info.script.name, DEBUG_ENABLED)
  const OPTIONS = {
    CHECK_FREQUENCY:        5000,
    WATCH_THRESHOLD:        0.5,
    HIDE_LIKE_NOTIFICATION: false,
    LIKE_IF_NOT_SUBSCRIBED: false,
  }
  const SELECTORS = {
    PLAYER:           '#movie_player',
    SUBSCRIBE_BUTTON: '#subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button',
    LIKE_BUTTON:      'ytd-video-primary-info-renderer #top-level-buttons > ytd-toggle-button-renderer:nth-child(1)',
    NOTIFICATION:     'ytd-popup-container',
  }
  const LIKE_BUTTON_CLICKED_CLASS = 'style-default-active'

  let autoLikedVideoIds = []

  setTimeout(wait, OPTIONS.CHECK_FREQUENCY)

  function getVideoId () {
    let elem = document.querySelector('#page-manager > ytd-watch-flexy')
    if (elem && elem.hasAttribute('video-id')) {
      return elem.getAttribute('video-id')
    } else {
      return new URLSearchParams(window.location.search).get('v')
    }
  }

  function watchThresholdReached () {
    let player = document.querySelector(SELECTORS.PLAYER)
    if (player) {
      return player.getCurrentTime() / player.getDuration() >= OPTIONS.WATCH_THRESHOLD
    }
    return true
  }

  function isSubscribed () {
    DEBUG.info('Checking whether subscribed...')
    let subscribeButton = document.querySelector(SELECTORS.SUBSCRIBE_BUTTON)
    if (!subscribeButton) {
      throw Error('Couldn\'t find sub button')
    }
    let subscribed = subscribeButton.hasAttribute('subscribed')
    DEBUG.info(subscribed ? 'We are subscribed' : 'We are not subscribed')
    return subscribed
  }

  function wait () {
    if (watchThresholdReached()) {
      try {
        if (OPTIONS.LIKE_IF_NOT_SUBSCRIBED || isSubscribed()) {
          like()
        }
      } catch (e) {
        DEBUG.info(`Failed to like video: ${e}. Will try again in ${OPTIONS.CHECK_FREQUENCY} ms...`)
      }
    }
    setTimeout(wait, OPTIONS.CHECK_FREQUENCY)
  }

  function hideLikeNotification () {
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

  function like () {
    DEBUG.info('Trying to like video...')
    let likeButton = document.querySelector(SELECTORS.LIKE_BUTTON)
    if (!likeButton) {
      throw Error('Couldn\'t find like button')
    }
    let videoId = getVideoId()
    if (likeButton.classList.contains(LIKE_BUTTON_CLICKED_CLASS)) {
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
})()
