import { io } from "socket.io-client"
import { DEFAULT_SOCKET_CONFIG } from "./type"
import useChatStore from "../stores/chatStore"
export class SocketService {
    constructor(config = DEFAULT_SOCKET_CONFIG) {
        this.socket = null
        this.config = config
        this.currentUser = null
        this.reconnectAttempts = 0
        this.maxReconnectAttempts = 5
        this.eventListeners = new Map()
    }

    connect(user) {
        return new Promise((resolve, reject) => {

            if (this.socket?.connected) {
                resolve()
                return
            }
            this.currentUser = user
            this.socket = io(this.config.url, {
                ...this.config.options,
            })
            
            this.socket.connect()
            this.socket.on("connect", () => {
                console.log("✅ Socket connected:", this.socket)
                this.reconnectAttempts = 0
                this.setupEventListeners()
                this.emit("connection:established", { userId: user.id, socketId: this.socket?.id || "" })
                resolve()
            })
           
            this.socket.on("connect_error", (error) => {
                console.error("❌ Socket connection error:", error)
                reject(error)
            })

            this.socket.on("disconnect", (reason) => {
                console.warn("⚠️ Socket disconnected:", reason)
                this.emit("connection:lost", { reason })

            })
        })
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
            this.currentUser = null
            this.eventListeners.clear()
        }
    }

    isConnected() {
        return this.socket?.connected || false
    }
    setupEventListeners() {
    if (!this.socket) return
      console.log("Setting up socket event listeners...")
    // Message events
    this.socket.on("message:new", ({message}) => {
      useChatStore.getState().addMessage(message);
      // this.emit("message:new", message)
    })

    this.socket.on("message:updated", (data) => {
  
      this.emit("message:updated", data)
    })

    this.socket.on("message:deleted", (data) => {
      console.log("🗑️ Message deleted:", data)
      this.emit("message:deleted", data)
    })

    this.socket.on("message:delivered", ({tempId,message}) => {
      if(!tempId || !message){
        console.error("Invalid message update data:", message)
      }
      useChatStore.getState().updateMessageId(tempId, message);
    })

    // Room events
    this.socket.on("room:created", (data) => {
      console.log("🏠 Room created:", data)
      this.emit("room:created", data)
    })

    this.socket.on("room:updated", (data) => {
      console.log("🏠 Room updated:", data)
      this.emit("room:updated", data)
    })

    this.socket.on("room:member_joined", ({roomId,userId}) => {
      useChatStore.getState().setUserOnline(userId, true);
    })

    this.socket.on("room:member_left", ({roomId,userId}) => {
      useChatStore.getState().setUserOnline(userId, false);
    })

    // Presence events
    this.socket.on("user:online", (data) => {
      console.log("🟢 User online:", data)
      this.emit("user:online", data)
    })

    this.socket.on("user:offline", (data) => {
      console.log("🔴 User offline:", data)
      this.emit("user:offline", data)
    })

    this.socket.on("user:typing", ({roomId,userId,isTyping}) => {
      console.log(`📝 User ${isTyping ? "started" : "stopped"} typing in room ${roomId}:`, userId)
      if(isTyping){
      useChatStore.getState().setTyping({userId, roomId, timestamp: new Date(),});
      }else{
      useChatStore.getState().removeTyping(userId, roomId);
      }
    })

    // Read receipts
    this.socket.on("message:read", (data) => {
      this.emit("message:read", data)
    })

    this.socket.on("room:read", (data) => {
      this.emit("room:read", data)
    })

    // Error handling
    this.socket.on("connection:error", (data) => {
      console.error("🚨 Socket error:", data)
      this.emit("connection:error", data)
    })
  }

  // ========================================
  // MESSAGE OPERATIONS
  // ========================================

  sendMessage(data) {
    if (!this.socket?.connected) {
      throw new Error("Socket not connected")
    }

    console.log("📤 Sending message:", data)
    this.socket.emit("message:send", data)
  }

  editMessage(messageId, content) {
    if (!this.socket?.connected) return

    this.socket.emit("message:edit", { messageId, content })
  }

  deleteMessage(messageId, roomId) {
    if (!this.socket?.connected) return

    this.socket.emit("message:delete", { messageId, roomId })
  }

  markMessageAsRead(messageId, roomId) {
    if (!this.socket?.connected) return

    this.socket.emit("message:mark_read", { messageId, roomId })
  }

  markRoomAsRead(roomId, lastReadMessageId) {
    if (!this.socket?.connected) return

    this.socket.emit("room:mark_read", { roomId, lastReadMessageId })
  }

  // ========================================
  // ROOM OPERATIONS
  // ========================================

  joinRoom(roomId) {
    if (!this.socket?.connected) return

    console.log("🚪 Joining room:", roomId)
    this.socket.emit("room:join", { roomId })
  }

  leaveRoom(roomId) {
    if (!this.socket?.connected) return

    console.log("🚪 Leaving room:", roomId)
    this.socket.emit("room:leave", { roomId })
  }

  createRoom(data) {
    if (!this.socket?.connected) return

    console.log("🏗️ Creating room:", data)
    this.socket.emit("room:create", data)
  }

  updateRoom(roomId, updates) {
    if (!this.socket?.connected) return

    this.socket.emit("room:update", { roomId, updates })
  }

  // ========================================
  // TYPING INDICATORS
  // ========================================

  startTyping(roomId) {
    if (!this.socket?.connected) return

    this.socket.emit("typing:start", { roomId })
  }

  stopTyping(roomId) {
    if (!this.socket?.connected) return

    this.socket.emit("typing:stop", { roomId })
  }

  // ========================================
  // PRESENCE MANAGEMENT
  // ========================================

  updatePresence(status) {
    if (!this.socket?.connected) return

    this.socket.emit("presence:update", { status })
  }

  // ========================================
  // EVENT EMITTER PATTERN
  // ========================================

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)?.push(callback)
  }

  off(event, callback) {
    if (!callback) {
      this.eventListeners.delete(event)
      return
    }

    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((callback) => callback(data))
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  getSocketId() {
    return this.socket?.id
  }

  getCurrentUser() {
    return this.currentUser
  }

  // ========================================
  // RECONNECTION LOGIC
  // ========================================

  handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("❌ Max reconnection attempts reached")
      this.emit("connection:failed", { reason: "Max attempts reached" })
      return
    }

    this.reconnectAttempts++
    console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)

    setTimeout(() => {
      if (this.currentUser && !this.isConnected()) {
        // Attempt to reconnect with stored user data
        // You would need to store the token somewhere secure
        // this.connect(this.currentUser, storedToken)
      }
    }, Math.pow(2, this.reconnectAttempts) * 1000) // Exponential backoff
  }
}

export const SocketServiceInstance = new SocketService()