"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Send, Mic, MicOff, Bot, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: number
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export function AIChatInterface() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your SmartChain AI assistant. I can help you track inventory, monitor deliveries, and provide insights. Try asking me something like 'Show stock of Surf Excel in Kolhapur' or 'Track truck MH-14'.",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue)
      const botMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("track") && lowerInput.includes("mh-14")) {
      return "🚛 Truck MH-14-CD-5678 Status:\n• Driver: Priya Sharma\n• Route: Pune → Nashik\n• Progress: 45% complete\n• ETA: 3h 45m\n• Current delay: 30 minutes\n• Location: Near Manmad Junction\n\nWould you like me to suggest an alternative route to reduce the delay?"
    }

    if (lowerInput.includes("stock") && lowerInput.includes("surf excel")) {
      return "📦 Surf Excel Stock Status:\n• Kolhapur Store: 23 units (CRITICAL - 3 days left)\n• Jalgaon Central: 67 units (Good)\n• Nashik Mall: 45 units (Low - reorder recommended)\n• Aurangabad Plaza: 89 units (Optimal)\n\nShall I generate a purchase order for Kolhapur Store?"
    }

    if (lowerInput.includes("alert") || lowerInput.includes("critical")) {
      return "🚨 Current Critical Alerts:\n• Parachute Oil - Jalgaon: Stock out in 2.3 days\n• Surf Excel - Kolhapur: Below reorder point\n• Delivery MH-18: 45 min delay due to traffic\n• Weather Alert: Monsoon affecting 3 routes\n\nWould you like details on any specific alert?"
    }

    if (lowerInput.includes("weather") || lowerInput.includes("monsoon")) {
      return "🌧️ Weather Impact Analysis:\n• Monsoon season starting in 5 days\n• Umbrella demand predicted to rise 340%\n• 3 delivery routes affected\n• Recommended actions:\n  - Increase umbrella stock by 300%\n  - Activate backup suppliers\n  - Reroute deliveries via NH-48\n\nShall I implement these recommendations?"
    }

    if (lowerInput.includes("savings") || lowerInput.includes("cost")) {
      return "💰 Cost Savings Summary (Today):\n• Route Optimization: ₹1,24,500\n• Inventory Reduction: ₹89,200\n• Demand Prediction: ₹67,800\n• Total Savings: ₹2,81,500\n\nProjected monthly savings: ₹84,45,000\nEfficiency improvement: 23.4%"
    }

    if (lowerInput.includes("supplier") || lowerInput.includes("performance")) {
      return "📊 Top Supplier Performance:\n• Hindustan Unilever: 94.2% on-time delivery\n• Nestle India: 91.8% on-time delivery\n• Britannia: 92.7% on-time delivery\n• ITC Limited: 87.6% on-time delivery\n\nWould you like detailed performance metrics for any supplier?"
    }

    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello! 👋 I'm here to help you manage your supply chain efficiently. You can ask me about:\n• Inventory levels and stock alerts\n• Delivery tracking and routes\n• Supplier performance\n• Cost savings and analytics\n• Weather and demand predictions\n\nWhat would you like to know?"
    }

    return "I understand you're asking about supply chain operations. I can help you with inventory tracking, delivery monitoring, supplier performance, cost analysis, and predictive insights. Could you please be more specific about what information you need?"
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false)
      // Stop voice recognition
    } else {
      setIsListening(true)
      // Start voice recognition
      setTimeout(() => {
        setIsListening(false)
        setInputValue("Show me critical alerts")
      }, 3000)
    }
  }

  const quickCommands = [
    "Show critical alerts",
    "Track all deliveries",
    "Check inventory status",
    "Weather impact forecast",
    "Cost savings report",
  ]

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-20 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6" />
          {messages.length > 1 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">{messages.length - 1}</Badge>
          )}
        </Button>
      </motion.div>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-36 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className="shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  <span>SmartChain AI Assistant</span>
                  <Badge className="ml-auto bg-green-100 text-green-800">Online</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[80%] ${
                          message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <div className={`p-2 rounded-full ${message.type === "user" ? "bg-blue-500" : "bg-gray-200"}`}>
                          {message.type === "user" ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="p-2 rounded-full bg-gray-200">
                          <Bot className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="p-3 rounded-lg bg-gray-100">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Commands */}
                <div className="p-4 border-t bg-gray-50">
                  <p className="text-xs text-gray-500 mb-2">Quick Commands:</p>
                  <div className="flex flex-wrap gap-1">
                    {quickCommands.map((command, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => setInputValue(command)}
                      >
                        {command}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me anything about your supply chain..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleVoiceToggle}
                      variant="outline"
                      size="sm"
                      className={isListening ? "bg-red-100 text-red-600" : ""}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button onClick={handleSendMessage} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {isListening && <p className="text-xs text-red-600 mt-1 animate-pulse">🎤 Listening... Speak now</p>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
