import React from 'react'
import { Card } from '../ui/card'
import { ChatContainer } from '../molecules/ChatContainer'

export const Chat = () => {
  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)]">
      <ChatContainer />
    </Card>
  )
}

