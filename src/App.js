import React, { Component } from 'react';
import axios from 'axios';
import socket from './socketIoClient';

class App extends Component {
  state = {
    email: '',
    password: '',
    isLogin: JSON.parse(localStorage.getItem('isLogin')),
    restaurantKey: localStorage.getItem('restaurant_id'),
    orderData: []
  };

  componentDidMount() {
    console.log('didmount');
    socket.on(localStorage.getItem('restaurant_id'), order => {
      alert('새 주문이 왔어요!');
      this.setState({
        ...this.state,
        orderData: [order, ...this.state.orderData]
      });
    });
  }

  _logout = () => {
    localStorage.setItem('isLogin', false);
    this.setState({ isLogin: false });
  };

  _totalcalculate = element =>
    element.orderList.reduce(
      (acc, curr) =>
        acc +
        Number(
          curr.price
            .slice(0, curr.price.length - 1)
            .split('')
            .filter(el => el !== ',')
            .join('')
        ) *
          curr.number,
      0
    );

  _delivery = async (e, element) => {
    let order_id = e.target.parentNode.childNodes[0].textContent.slice(6);
    let restaurant_id = await localStorage.getItem('restaurant_id');
    axios.get(
      this.baseUrl + `/restaurants/delivery/${restaurant_id}/${order_id}`
    );
    this.setState({
      ...this.state,
      orderData: this.state.orderData.filter(
        element => element.order_id !== order_id
      )
    });
  };

  _emailOnChangeHandler = e =>
    this.setState({
      email: e.target.value
    });

  _passwordOnChangeHandler = e =>
    this.setState({
      password: e.target.value
    });

  _login = () => {
    axios
      .post(
        this.baseUrl + '/users/signin',
        { email: this.state.email, password: this.state.password },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(res => {
        this.setState({ restaurantKey: res.data.restaurantKey });
        localStorage.setItem('restaurant_id', res.data.restaurantKey);
        localStorage.setItem('restaurantName', res.data.restaurantName);
        if (res.status === 200) {
          localStorage.setItem('isLogin', true);
          this.setState({ isLogin: true });
        } else {
          alert('아이디나 비밀번호를 확인해주세요.');
        }
      });
  };

  render() {
    return this.state.isLogin ? (
      // 로그인 되어있는 상태
      <div style={{ fontSize: 40 }}>
        <span style={{ color: '#51CDCA' }}>
          {localStorage.getItem('restaurantName')}
        </span>
        의 싸장님 페이지
        <button onClick={this._logout}>로그아웃</button>
        <div style={{ fontSize: 40, padding: 10 }} className="orderlist">
          <hr />
          주문리스트
          {this.state.orderData.map((el, index) => (
            <div
              key={index}
              style={{
                marginTop: 5,
                fontSize: 20,
                border: '2.5px solid #DCDCDC',
                width: 400
              }}
            >
              <h4>주문번호: {el.order_id}</h4>
              <h4>주소: {el.address}</h4>
              <h4>주문시간: {el.date}</h4>
              <div>
                주문내역:{' '}
                {el.orderList.map((el, i) => (
                  <div key={i}>
                    <span>{el.menu}</span>
                    <span style={{ marginLeft: 15 }}> {el.number}</span>
                    <span style={{ marginLeft: 15 }}> {el.price}</span>
                  </div>
                ))}
              </div>
              <p>
                총 금액:
                {this._totalcalculate(el)}원
              </p>
              <div>주문자전화번호: {el.phoneNumber}</div>
              <button
                onClick={e => this._delivery(e, el)}
                // 아직 주문번호로 지우는 거 확인 못했음. 내일 꼭 확인하기 받아오는 데이터도 한번더 확인
              >
                배달완료
              </button>
            </div>
          ))}
        </div>
      </div>
    ) : (
      // 로그인 안되어 있는 상태
      <div>
        <h1>식당아이디로 로그인 해주세요</h1>
        <input
          style={{ width: 350, height: 50 }}
          onChange={e => this._emailOnChangeHandler(e)}
          placeholder="email"
        />
        <input
          type="password"
          style={{ width: 350, height: 50 }}
          onChange={e => this._passwordOnChangeHandler(e)}
          placeholder="password"
        />
        <button style={{ height: 50 }} onClick={this._login}>
          로그인
        </button>
      </div>
    );
  }
}

export default App;
