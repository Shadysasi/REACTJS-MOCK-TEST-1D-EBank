import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {userId: '', pin: '', showSubmitError: false, errorMsg: ''}

  onChangePIN = event => {
    this.setState({pin: event.target.value})
  }

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 600,
      path: '/',
    })

    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    console.log(errorMsg)
    this.setState({showSubmitError: true, errorMsg})
  }

  renderPinField = () => {
    const {pin} = this.state
    return (
      <>
        <label htmlFor="pin">PIN</label>
        <input
          id="pin"
          type="password"
          value={pin}
          placeholder="Enter PIN"
          onChange={this.onChangePIN}
        />
      </>
    )
  }

  renderUserIdField = () => {
    const {userId} = this.state
    return (
      <>
        <label htmlFor="userId">User ID</label>
        <input
          id="userId"
          type="text"
          value={userId}
          placeholder="Enter User ID"
          onChange={this.onChangeUserId}
        />
      </>
    )
  }

  BankLogin = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    console.log(userDetails)
    const url = 'https://apis.ccbp.in/ebank/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <div>
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
            />
          </div>
          <form onSubmit={this.BankLogin}>
            <h1>Welcome Back!</h1>
            {this.renderUserIdField()}
            {this.renderPinField()}
            <button type="submit">Login</button>
            {showSubmitError && <p>{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
