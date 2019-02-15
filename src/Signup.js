import React, { Component } from 'react';
import axios from 'axios';
import { inputDash } from './inputDash';
class Signup extends Component {
  state = {
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    confirmPassword: false,
    visible: false
  };
  render() {
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
          style={{ width: '100%', height: 30, marginTop: 30 }}
          placeholder="email"
        />
        이메일
        <input
          onChange={e =>
            this.setState({
              password: e.target.value
            })
          }
          style={{ width: '100%', height: 30, marginTop: 30 }}
          placeholder="password"
          type="password"
        />
        비밀번호
        <div>
          <input
            onChange={e => {
              this.setState({
                confirmPassword: e.target.value === this.state.password
              });
            }}
            style={{ width: '100%', height: 30, marginTop: 30 }}
            onBlur={() => {
              this.setState({ visible: true });
            }}
            placeholder="confirm password"
            type="password"
          />
          {this.state.visible ? (
            this.state.confirmPassword ? (
              <div style={{ color: 'green', textDecorationLine: 'underline' }}>
                비밀번호가 일치합니다
              </div>
            ) : (
              <div style={{ color: 'red', textDecorationLine: 'underline' }}>
                비밀번호가 일치하지 않습니다
              </div>
            )
          ) : (
            <div />
          )}
          비밀번호 확인
        </div>
        <input
          onChange={e =>
            this.setState({
              name: e.target.value
            })
          }
          style={{ width: '100%', height: 30, marginTop: 30 }}
          placeholder="name"
        />
        이름
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
          style={{ width: '100%', height: 30, marginTop: 30 }}
          // value={this.state.phoneNumber}
          placeholder="phoneNumber"
        />
        <div>전화번호</div>
        <button
          onClick={() => {
            console.log(this.state);
            axios.post(
              'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signup',
              this.state,
              { headers: { 'Content-Type': 'application/json' } }
            );
            alert('회원가입이 완료되었습니다.');
          }}
          style={{ width: '50%', height: 30, marginTop: 30, marginLeft: '25%' }}
        >
          등록
        </button>
      </div>
    );
  }
}

export default Signup;
