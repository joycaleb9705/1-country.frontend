import React, { useEffect, useState } from 'react'
import { TwitterTimelineEmbed, TwitterTweetEmbed } from 'react-twitter-embed'
import isUrl from 'is-url'
import BN from 'bn.js'
import { WidgetsContainer } from './Widgets.styles'

export const WIDGET_TYPE = {
  feed: 0,
  post: 1
}

const parseBN = (n) => {
  try {
    return new BN(n)
  } catch (ex) {
    console.error(ex)
    return null
  }
}

const parseTweetId = (urlInput) => {
  try {
    const url = new URL(urlInput)
    if (url.host !== 'twitter.com') {
      return { error: 'URL must be from https://twitter.com' }
    }
    const parts = url.pathname.split('/')
    const BAD_FORM = {
      error:
        'URL has bad form. It must be https://twitter.com/[some_account]/status/[tweet_id]',
    }
    if (parts.length < 2) {
      return BAD_FORM
    }
    if (parts[parts.length - 2] !== 'status') {
      return BAD_FORM
    }
    const tweetId = parseBN(parts[parts.length - 1])
    if (!tweetId) {
      return { error: 'cannot parse tweet id' }
    }
    return { tweetId: tweetId.toString() }
  } catch (ex) {
    console.error(ex)
    return { error: ex.toString() }
  }
}
const TwitterWidgetDefault = {
  tweetId: '',
  error: ''
}
const TwitterWidget = ({ value, widgetKey }) => {
  const [tweetId, setTweetId] = useState(TwitterWidgetDefault)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    console.log('value', value, userName, tweetId)
    if (isUrl(value)) {
      setTweetId(parseTweetId(value))
    } else {
      setUserName(value)
    }
  }, [value])

  return (
    <WidgetsContainer>
      <div style={{ paddingBottom: '2em' }}>
        {userName && (
          <TwitterTimelineEmbed
            sourceType='profile'
            screenName={userName}
            options={{ height: 600 }}
            placeholder='Loading...'
            key={`${userName}${widgetKey}`}
          />
        )}
        {tweetId.tweetId && (
          <TwitterTweetEmbed
            tweetId={tweetId.tweetId}
            key={`${tweetId.tweetId}${widgetKey}`}
            placeholder='Loading...'
          />)}
      </div>
    </WidgetsContainer>
  )
}

export default TwitterWidget
