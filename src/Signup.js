import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { inputDash } from './inputDash';
class Signup extends Component {
  state = {
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    confirmPassword: false,
    visible: false,
    register: false
  };
  render() {
    if (!this.state.register) {
      return (
        <div
          style={{
            width: '50%',
            marginLeft: '25%'
          }}
        >
          <input
            onChange={e =>
              this.setState({
                email: e.target.value
              })
            }
            style={{ height: 15 }}
            placeholder="email"
          />
          <input
            onChange={e =>
              this.setState({
                password: e.target.value
              })
            }
            style={{ height: 15 }}
            placeholder="password"
            type="password"
          />
          <div>
            <input
              onChange={e => {
                this.setState({
                  confirmPassword: e.target.value === this.state.password
                });
              }}
              style={{ height: 15 }}
              onBlur={() => {
                this.setState({ visible: true });
              }}
              placeholder="confirm password"
              type="password"
            />
            {this.state.visible ? (
              this.state.confirmPassword ? (
                <div
                  style={{
                    color: 'green',
                    fontSize: '0.8em',
                    textAlign: 'center'
                  }}
                >
                  비밀번호가 일치합니다
                </div>
              ) : (
                <div
                  style={{
                    color: 'red',
                    fontSize: '0.8em',
                    textAlign: 'center'
                  }}
                >
                  비밀번호가 일치하지 않습니다
                </div>
              )
            ) : (
              <div />
            )}
          </div>
          <input
            onChange={e =>
              this.setState({
                name: e.target.value
              })
            }
            style={{ height: 15 }}
            placeholder="name"
          />
          <input
            onBlur={e =>
              this.setState({
                phoneNumber: inputDash(
                  e.target.value
                    .split('')
                    .filter(el => !isNaN(Number(el)))
                    .join('')
                )
              })
            }
            style={{ height: 15 }}
            // value={this.state.phoneNumber}
            placeholder="phoneNumber"
          />
          <button
            onClick={() => {
              console.log(this.state);
              axios
                .post(
                  'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signup',
                  this.state,
                  { headers: { 'Content-Type': 'application/json' } }
                )
                .then(res => {
                  alert('안녕하세요!');
                  this.setState({
                    register: true
                  });
                })
                .catch(function(err) {
                  console.log(err.message);
                  if (err.response.status === 401) {
                    alert('이미 가입된 전화번호입니다');
                  } else if (err.response.status === 402) {
                    alert('이미 가입된 이메일입니다');
                  }
                });
            }}
            style={{
              width: '50%',
              height: 40,
              marginTop: 30,
              marginLeft: '25%'
            }}
          >
            등록
          </button>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

export default Signup;
