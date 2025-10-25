// ==UserScript==
// @name           YouTube Auto-Liker
// @name:zh        YouTube自動點讚
// @name:ja        YouTubeのような自動
// @namespace      https://github.com/HatScripts/youtube-auto-liker
// @version        1.3.28
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
      },
      WHITELISTED_CHANNELS: {
        label: 'Whitelisted channels (one per line)',
        type: 'textarea',
        default: '',
        title: 'Channel IDs to always like (one per line)\nFormat: UCxxxxxxxxxxxxxxx Optional Name\nExample: UCnCmb1vpv90EeSX5g7K4UYQ @TheLibrarianYT\n\nHow to find Channel ID:\n1. Go to channel page\n2. Click "..." (more) button\n3. Click "Share channel"\n4. Click "Copy Channel ID"'
      },
      BLACKLISTED_CHANNELS: {
        label: 'Blacklisted channels (one per line)',
        type: 'textarea',
        default: '',
        title: 'Channel IDs to never like (one per line)\nSame format as whitelist\nBlacklist overrides whitelist if a channel appears in both'
      }
    },
    events: {
      init: onInit,
      save: refreshChannelLists
    }
  })

  GM_registerMenuCommand('Settings', () => {
    GM_config.open()
  })

  // Listen for settings changes to refresh channel lists
  function refreshChannelLists () {
    whitelistedChannels = parseChannelList(GM_config.get('WHITELISTED_CHANNELS'))
    blacklistedChannels = parseChannelList(GM_config.get('BLACKLISTED_CHANNELS'))
    
    DEBUG.info(`Refreshed channel lists: ${Object.keys(whitelistedChannels).length} whitelisted, ${Object.keys(blacklistedChannels).length} blacklisted`)
  }

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
    SUBSCRIBE_BUTTON: '#subscribe-button > ytd-subscribe-button-renderer, ytd-reel-player-overlay-renderer #subscribe-button',
    LIKE_BUTTON: 'like-button-view-model button, #menu .YtLikeButtonViewModelHost button, #segmented-like-button button, #like-button button',
    DISLIKE_BUTTON: 'dislike-button-view-model button, #menu .YtDislikeButtonViewModelHost button, #segmented-dislike-button button, #dislike-button button'
  }

  const autoLikedVideoIds = []
  let whitelistedChannels = {}
  let blacklistedChannels = {}

  function parseChannelList (textareaContent) {
    const channels = {}
    if (!textareaContent || !textareaContent.trim()) {
      return channels
    }

    const lines = textareaContent.split('\n').filter(line => line.trim())
    
    lines.forEach(line => {
      const trimmedLine = line.trim()
      // Match Channel ID format: UC followed by 22 characters (letters, numbers, hyphens, underscores)
      const match = trimmedLine.match(/^(UC[\w-]{22})\s*(.*)$/)
      if (match) {
        const [, channelId, displayName] = match
        channels[channelId] = displayName.trim() || channelId
        DEBUG.info(`Parsed channel: ${channelId} (${channels[channelId]})`)
      } else if (trimmedLine) {
        DEBUG.warn(`Invalid channel format: ${trimmedLine}`)
      }
    })
    
    return channels
  }

  function getCurrentChannelId () {
    DEBUG.info('Detecting current channel ID...')
    const currentVideoId = new URLSearchParams(window.location.search).get('v')
    
    try {
      // Method 1: Try to get from page data (ytInitialData) - most reliable for current video
      if (window.ytInitialData) {
        try {
          // Try multiple paths in ytInitialData for better coverage
          const contents = window.ytInitialData.contents?.twoColumnWatchNextResults?.results?.results?.contents
          if (contents) {
            // Look for video owner in primary info
            const primaryInfo = contents.find(c => c.videoPrimaryInfoRenderer)?.videoPrimaryInfoRenderer
            const secondaryInfo = contents.find(c => c.videoSecondaryInfoRenderer)?.videoSecondaryInfoRenderer
            
            let channelId = primaryInfo?.videoOwner?.videoOwnerRenderer?.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId
            if (!channelId) {
              channelId = secondaryInfo?.owner?.videoOwnerRenderer?.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId
            }
            if (!channelId) {
              channelId = secondaryInfo?.owner?.videoOwnerRenderer?.navigationEndpoint?.browseEndpoint?.browseId
            }
            
            if (channelId && channelId.startsWith('UC')) {
              DEBUG.info(`Channel ID found via ytInitialData: ${channelId}`)
              return channelId
            }
          }
        } catch (e) {
          DEBUG.debug('ytInitialData parsing failed:', e.message)
        }
      }

      // Method 2: Try to get from DOM elements (more current than script tags)
      const channelLink = document.querySelector('ytd-video-owner-renderer a[href*="/channel/"], ytd-video-owner-renderer a[href*="/@"], #owner a[href*="/channel/"], #owner a[href*="/@"]')
      if (channelLink) {
        const match = channelLink.href.match(/\/channel\/(UC[\w-]{22})/)
        if (match) {
          DEBUG.info(`Channel ID found via channel link: ${match[1]}`)
          return match[1]
        }
      }

      // Method 3: Try to get from ytd-watch-flexy element
      const watchFlexy = document.querySelector('#page-manager > ytd-watch-flexy')
      if (watchFlexy && watchFlexy.hasAttribute('video-owner-id')) {
        const channelId = watchFlexy.getAttribute('video-owner-id')
        if (channelId && channelId.startsWith('UC')) {
          DEBUG.info(`Channel ID found via watch-flexy: ${channelId}`)
          return channelId
        }
      }

      // Method 4: Try to get from subscribe button
      const subscribeButton = document.querySelector(SELECTORS.SUBSCRIBE_BUTTON)
      if (subscribeButton) {
        const channelId = subscribeButton.getAttribute('channel-id') || subscribeButton.getAttribute('data-channel-id')
        if (channelId && channelId.startsWith('UC')) {
          DEBUG.info(`Channel ID found via subscribe button: ${channelId}`)
          return channelId
        }
      }

      // Method 5: Try to get from canonical link
      const canonicalLink = document.querySelector('link[rel="canonical"]')
      if (canonicalLink) {
        const canonicalMatch = canonicalLink.href.match(/\/channel\/(UC[\w-]{22})/)
        if (canonicalMatch) {
          DEBUG.info(`Channel ID found via canonical link: ${canonicalMatch[1]}`)
          return canonicalMatch[1]
        }
      }

      // Method 6: Try to get from page source JSON data (with video context validation)
      const scriptTags = document.querySelectorAll('script')
      for (const script of scriptTags) {
        const content = script.textContent || ''
        // Only check scripts that contain current video ID to avoid stale data
        if (currentVideoId && content.includes(currentVideoId)) {
          const scriptMatch = content.match(/"channelId":"(UC[\w-]{22})"/)
          if (scriptMatch) {
            DEBUG.info(`Channel ID found via script content (with video context): ${scriptMatch[1]}`)
            return scriptMatch[1]
          }
        }
      }

      // Method 7: Try to get from meta tags
      const metaTags = document.querySelectorAll('meta[property], meta[name]')
      for (const meta of metaTags) {
        const metaContent = meta.getAttribute('content') || ''
        const metaMatch = metaContent.match(/UC[\w-]{22}/)
        if (metaMatch) {
          DEBUG.info(`Channel ID found via meta tag: ${metaMatch[0]}`)
          return metaMatch[0]
        }
      }

      DEBUG.warn('Could not detect channel ID from any source')
      DEBUG.debug('Current URL:', window.location.href)
      DEBUG.debug('Page title:', document.title)
      return null
    } catch (error) {
      DEBUG.error(`Error detecting channel ID: ${error.message}`)
      return null
    }
  }

  function onInit() {
    DEBUG = new Debugger(GM_info.script.name, GM_config.get('DEBUG_MODE'))
    
    // Parse channel lists
    whitelistedChannels = parseChannelList(GM_config.get('WHITELISTED_CHANNELS'))
    blacklistedChannels = parseChannelList(GM_config.get('BLACKLISTED_CHANNELS'))
    
    DEBUG.info(`Loaded ${Object.keys(whitelistedChannels).length} whitelisted channels`)
    DEBUG.info(`Loaded ${Object.keys(blacklistedChannels).length} blacklisted channels`)
    
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
    const subscribeButton = document.querySelector(SELECTORS.SUBSCRIBE_BUTTON)
    if (!subscribeButton) {
      throw Error('Couldn\'t find sub button')
    }
    const subscribed = subscribeButton.hasAttribute('subscribe-button-invisible') ||
      subscribeButton.hasAttribute('subscribed')
    DEBUG.info(subscribed ? 'We are subscribed' : 'We are not subscribed')
    return subscribed
  }

  function shouldLikeVideo () {
    DEBUG.info('=== Evaluating whether to like video ===')
    DEBUG.debug(`Current URL: ${window.location.href}`)
    DEBUG.debug(`Current video ID: ${new URLSearchParams(window.location.search).get('v')}`)
    
    const channelId = getCurrentChannelId()
    
    if (!channelId) {
      DEBUG.info('Could not detect channel ID, falling back to subscription logic')
      return GM_config.get('LIKE_IF_NOT_SUBSCRIBED') || isSubscribed()
    }

    DEBUG.info(`Detected channel ID: ${channelId}`)
    
    // Debug: Show loaded lists
    DEBUG.debug(`Blacklisted channels: ${Object.keys(blacklistedChannels).join(', ')}`)
    DEBUG.debug(`Whitelisted channels: ${Object.keys(whitelistedChannels).join(', ')}`)

    // Priority 1: Blacklist check (overrides everything)
    if (blacklistedChannels[channelId]) {
      DEBUG.info(`Channel ${blacklistedChannels[channelId]} (${channelId}) is blacklisted - will NOT like`)
      return false
    }

    // Priority 2: Whitelist check (overrides subscription logic)
    if (whitelistedChannels[channelId]) {
      DEBUG.info(`Channel ${whitelistedChannels[channelId]} (${channelId}) is whitelisted - WILL like`)
      return true
    }

    // Priority 3: Fall back to existing logic
    DEBUG.info(`Channel ${channelId} not in whitelist/blacklist, using subscription logic`)
    const subscribed = isSubscribed()
    const shouldLike = GM_config.get('LIKE_IF_NOT_SUBSCRIBED') || subscribed
    DEBUG.info(`Subscription logic result: ${shouldLike ? 'WILL' : 'will NOT'} like`)
    return shouldLike
  }

  function wait () {
    if (watchThresholdReached()) {
      try {
        if (shouldLikeVideo()) {
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
    return button.classList.contains('style-default-active') ||
      button.getAttribute('aria-pressed') === 'true'
  }

  function like () {
    DEBUG.info('Trying to like video...')
    const likeButton = document.querySelector(SELECTORS.LIKE_BUTTON)
    const dislikeButton = document.querySelector(SELECTORS.DISLIKE_BUTTON)
    if (!likeButton) {
      throw Error('Couldn\'t find like button')
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
