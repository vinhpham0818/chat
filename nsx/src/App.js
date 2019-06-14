import React from 'react';
import './App.scss';
import socketIOclient from 'socket.io-client'
const socket = socketIOclient('192.168.1.152:5000')

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      socketServer: '192.168.1.152:5000',
      receiveMessages: '',
      buttonTilte: 'Join',
      userName: 'vinh'
    }
  }

  componentDidMount () {
    
  this.onReceived()
  this.onJoined()
  this.onLeave()
  this.onTypingFromMember()
}

onTypingFromMember() {
  socket.on('member_typing', (user) => {
    if(user.userName != this.state.userName) {
    this.setMessage(`${user.userName} typing...`)
    }
  })
}

  onReceived() {
    socket.on('receive-message', (value) => {
      this.setMessage(`${value.userName}: ${value.message}`)
    })
  }

  

  onJoined() {
    socket.on('joined', (user) => {
      console.log(user)
      
      this.setMessage(`User ${user.userName} joined`)
    })
  }

  onLeave() {
    socket.on('leaved', (user) => {
     
      console.log(user)
      this.setMessage(`User ${user.userName} leaved`)
    })
  }

  setMessage(message) {
    let messages = this.state.receiveMessages
    messages = message + '\n' + messages
    this.setState({
      receiveMessages: messages
    })
  }

    onKeyPress = event => {
      if (event.key === 'Enter') {
        console.log(event.target.value)
        socket.emit('send-message', {
          userName: this.state.userName,
          message: event.target.value
        })
      }
    }

    onClick = event => {
      console.log(event)
      let title = 'Join'
      if(this.state.buttonTilte === 'Join')  {
        title = 'Leave'
        this.join()
      } else {
        this.leave()
      }
      this.setState({
        buttonTilte: title
      })
    }
    
    join () {
      socket.emit('join', {
        userName: this.state.userName
      })
    }

    leave() {
      socket.emit('leave', {
      userName: this.state.userName
      })
    }
  
    onChange = event => {
      socket.emit('typing', {
        userName: this.state.userName
      })
    }
 
  render() {
    return (
     <div className="App">
        <div className="App-Container">
          <div className="chat-box">
            <div className="receive-messages" >
              <textarea value={this.state.receiveMessages}></textarea>
            </div>
            <div className="send-message">
              
                <input onKeyPress={this.onKeyPress}></input>
                <button onClick={e => this.onClick(e)}>{this.state.buttonTilte}</button>
              
            </div>
          </div>
        </div>
     </div> 
    )
  }
}


export default App;
