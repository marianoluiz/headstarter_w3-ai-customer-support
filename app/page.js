'use client'

import { Box, Button, Stack, TextField } from '@mui/material'
import { useState, useRef, useEffect } from 'react'


export default function Home() { 

  /* STATE VARIABLES  */
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Sup loser! I'm clownGPT. How can I help you today?",
    },
  ])
  
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  /* send message */
    //This sends post request to the /api/chat endpoint.
  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages
    // Falsy Values: Empty strings ("") are considered falsy.

    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    setIsLoading(false)

  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    /* OUTER CONTAINER */
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="row"
      justifyContent="space-around"
      alignItems="center"
      id="outer-container"
    >
      {/* inner container */}
      <Stack
        direction={'column'}
        width="600px"
        height="550px"
        mt={10}
        p={4}
        spacing={3}
        id="inner-container"
        borderRadius={8}
        sx={{
          backgroundColor: 'white',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'linear-gradient(to right, #f6d365, #fda085)',
        }}
      >
        {/* MESSAGES MAP */}
        <Stack
          padding={5}
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'warning.dark'
                    : 'secondary.dark'
                }
                color="white"
                borderRadius={4}
                p={3}
                lineHeight={2}
              >
                {message.content}
              </Box>
            </Box>
          ))}

        <div ref={messagesEndRef} />

        </Stack>
          {/* MESSAGES END */}

        {/* INPUT DIV */}
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(); }}
            disabled={isLoading}
          />

          <Button 
            variant="contained" 
            sx={{ bgcolor: 'warning.dark' }}
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
        {/* INPUT DIV END */}

      </Stack>
      {/* INNER CONTAINER END */}
        
      {/* clown image */}
      <Box 
        height={350}
        width={300}
        mt={38}
        bgcolor="warning.dark"
      >
        <img 
          height="100%"  
          width="100%" 
          src="/clown-pict1.jpg" 
          alt="clown" 
          style={{ transform: 'scaleX(-1)' }}
        />
      </Box>
      {/* clown image end */}

      {/* make a small circle using MUI make it orange*/}
      <Box
        position="absolute"
        marginLeft={20}
        marginBottom={0}
        bgcolor="warning.dark"
        width={80}
        height={80}
        borderRadius="50%">
      </Box>
      <Box
        position="absolute"
        marginLeft={50}
        marginBottom={-10}
        bgcolor="warning.dark"
        width={50}
        height={50}
        borderRadius="50%">
      </Box>
      <Box
        position="absolute"
        marginLeft={75}
        marginBottom={-20}
        bgcolor="warning.dark"
        width={30}
        height={30}
        borderRadius="50%">
      </Box>
          
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        py={3}
        textAlign="center"
        sx={{
          backgroundColor: 'purple',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '24px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        }}
      >
        ClownGPT: Your Personal Roasting Assistant
      </Box>

      
    </Box>
    /* OUTER CONTAINER END*/
  )
}