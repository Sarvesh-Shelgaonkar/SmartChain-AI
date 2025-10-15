"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Send, Mic, X, Bot, User, Move, Minimize2, Maximize2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: number
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export function MovableAIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [togglePosition, setTogglePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isToggleDragging, setIsToggleDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [toggleDragOffset, setToggleDragOffset] = useState({ x: 0, y: 0 })
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your SmartChain AI assistant. I can help you with inventory tracking, delivery status, supplier information, and supply chain analytics. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!chatRef.current) return
    
    const rect = chatRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - 400
    const maxY = window.innerHeight - 500
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleToggleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!toggleRef.current) return
    
    const rect = toggleRef.current.getBoundingClientRect()
    setToggleDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsToggleDragging(true)
  }

  const handleToggleMouseMove = (e: MouseEvent) => {
    if (!isToggleDragging) return
    
    const newX = e.clientX - toggleDragOffset.x
    const newY = e.clientY - toggleDragOffset.y
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - 80
    const maxY = window.innerHeight - 80
    
    setTogglePosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }

  const handleToggleMouseUp = () => {
    setIsToggleDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  useEffect(() => {
    if (isToggleDragging) {
      document.addEventListener('mousemove', handleToggleMouseMove)
      document.addEventListener('mouseup', handleToggleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleToggleMouseMove)
        document.removeEventListener('mouseup', handleToggleMouseUp)
      }
    }
  }, [isToggleDragging, toggleDragOffset])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Set initial toggle position on client side
    if (typeof window !== 'undefined') {
      setTogglePosition({
        x: window.innerWidth - 100,
        y: window.innerHeight - 100
      })
    }
  }, [])

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes("inventory") || lowerInput.includes("stock")) {
      return "I can see you have 12 inventory items currently tracked. 3 items are at critical levels: Basmati Rice (12 units), Surf Excel (23 units), and Dettol Soap (34 units). Would you like me to generate reorder recommendations?"
    }
    
    if (lowerInput.includes("delivery") || lowerInput.includes("truck")) {
      return "Currently tracking 7 active deliveries. 4 are in-transit, 2 are delayed, and 1 has been delivered. Truck MH-14-CD-5678 is experiencing a 30-minute delay on the Pune → Nashik route. Would you like detailed tracking information?"
    }
    
    if (lowerInput.includes("supplier")) {
      return "Your top performing supplier is Hindustan Unilever Ltd with 94.2% on-time delivery. Tata Consumer Products needs attention with 88.9% performance. I can provide detailed supplier analytics if needed."
    }
    
    if (lowerInput.includes("alert") || lowerInput.includes("critical")) {
      return "You have 7 active alerts: 3 critical stock levels, 2 delayed deliveries, 1 supplier performance issue, and 1 system notification. Would you like me to prioritize these for you?"
    }
    
    if (lowerInput.includes("revenue") || lowerInput.includes("sales")) {
      return "Current month revenue is ₹45,23,100 with 20.1% growth. Personal Care category is leading with ₹12,34,500. Cost savings this month: ₹8,47,500. Need detailed analytics?"
    }
    
    return "I understand you're asking about supply chain operations. I can help with inventory management, delivery tracking, supplier performance, analytics, and recommendations. Could you be more specific about what you'd like to know?"
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    const query = inputValue
    setInputValue("")
    setIsTyping(true)

    try {
      // Simulate API call for AI response
      const response = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(generateAIResponse(query));
        }, Math.random() * 1000 + 800);
      });

      // Add bot response
      const botResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: response,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      // Handle error
      const errorMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.div
        ref={toggleRef}
        className="fixed z-50"
        style={{
          left: togglePosition.x,
          top: togglePosition.y,
          cursor: isToggleDragging ? 'grabbing' : 'grab'
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onMouseDown={handleToggleMouseDown}
      >
        <Button
          onClick={(e) => {
            if (!isToggleDragging) {
              setIsOpen(!isOpen)
            }
          }}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>
        {!isOpen && (
          <motion.div
            className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full animate-pulse"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </motion.div>

      {/* Movable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            className="fixed z-40 w-96 bg-white rounded-lg shadow-2xl border"
            style={{
              left: position.x,
              top: position.y,
              cursor: isDragging ? 'grabbing' : 'default'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Draggable Header */}
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span className="font-semibold">SmartChain AI Assistant</span>
                  <Badge className="bg-white/20 text-white text-xs">Live</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20 h-6 w-6 p-0"
                  >
                    {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                  </Button>
                  <Move className="h-4 w-4 text-white/70" />
                </div>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="h-96 flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.type === "bot" && <Bot className="h-4 w-4 mt-0.5 text-blue-500" />}
                            {message.type === "user" && <User className="h-4 w-4 mt-0.5" />}
                            <div>
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.type === "user" ? "text-blue-100" : "text-gray-500"
                              }`}>
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-4 w-4 text-blue-500" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about inventory, deliveries, suppliers..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm" className="bg-blue-500 hover:bg-blue-600">
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Try: "Show inventory status", "Track deliveries", "Supplier performance"
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}