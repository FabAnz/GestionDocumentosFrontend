import React from 'react'
import { Card } from '../ui/card'
import { ChatContainer } from '../molecules/ChatContainer'

export const Chat = () => {
  return (
    <Card className="flex flex-col h-full">
      <ChatContainer />
    </Card>
  )
}

