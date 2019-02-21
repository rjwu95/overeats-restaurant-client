import React, { Component } from 'react';
import axios from 'axios';
import SocketIOClient from 'socket.io-client';
import './style.css';

class App extends Component {
  state = {
    email: '',
    password: '',
    isLogin: JSON.parse(localStorage.getItem('isLogin')),
    restaurantKey: localStorage.getItem('restaurant_id'),
    orderData: []
  };
  baseUrl = 'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080';
  socket = SocketIOClient(this.baseUrl);

  componentDidMount() {
    console.log('didmount');
    this.socket.on(localStorage.getItem('restaurant_id'), order => {
      alert('새 주문이 왔어요!');
      this.setState({
        ...this.state,
        orderData: [order, ...this.state.orderData]
      });
      // console.log(this.state);
    });
  }

  isLogin = () => {
    localStorage.setItem('isLogin', false);
    localStorage.setItem('restaurantName', '');
    localStorage.setItem('restaurant_id', '');
    this.socket.disconnect('disconnect', () => console.log('끊김..'));
    this.setState({ isLogin: false });
  };

  signin = async () => {
    let { email, password } = this.state;
    let baseUrl = this.baseUrl;
    await axios
      .post(
        baseUrl + '/users/signin',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(res => {
        console.log(res);
        this.setState({ restaurantKey: res.data.restaurantKey });
        localStorage.setItem('restaurant_id', res.data.restaurantKey);
        localStorage.setItem('restaurantName', res.data.restaurantName);
        if (res.status === 200) {
          localStorage.setItem('isLogin', true);
          this.setState({ isLogin: true });
          window.location.href = '/';
        } else {
          alert('아이디나 비밀번호를 확인해주세요.');
        }
      });
  };

  targetValue = (e, name) => {
    this.setState({
      [name]: e.target.value
    });
  };
  order = async e => {
    {
      let order_id = e.target.parentNode.childNodes[0].textContent.slice(6);
      let restaurant_id = await localStorage.getItem('restaurant_id');
      axios.get(
        this.baseUrl + `/restaurants/delivery/${restaurant_id}/${order_id}`
      );
      this.setState({
        ...this.state,
        orderData: this.state.orderData.filter(el => el.order_id !== order_id)
      });
    }
  };
  render() {
    return this.state.isLogin ? (
      <div className="login">
        <span>{localStorage.getItem('restaurantName')}</span>의 싸장님 페이지
        <button onClick={this.isLogin}>로그아웃</button>
        <div style={{ fontSize: '1em', padding: '30px' }} className="orderlist">
          <hr />
          <h4>주문리스트</h4>
          {this.state.orderData.map((el, index) => (
            <div key={index} className="orderList">
              <h4>주문번호: {el.order_id}</h4>
              <h4>주소: {el.address}</h4>
              <h4>주문시간: {el.date}</h4>
              <div>
                주문내역:{' '}
                {el.orderList.map((el, i) => (
                  <div key={i}>
                    <span>{el.menu}</span>
                    <span style={{ marginLeft: 15 }}> {el.number}개</span>
                    <span style={{ marginLeft: 15 }}> {el.price}</span>
                  </div>
                ))}
              </div>
              <p>
                총 금액:
                {el.orderList.reduce(
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
                )}
                원
              </p>
              <div>주문자전화번호: {el.phoneNumber}</div>
              <button
                onClick={this.order}
                // 아직 주문번호로 지우는 거 확인 못했음. 내일 꼭 확인하기 받아오는 데이터도 한번더 확인
              >
                배달완료
              </button>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="logout">
        <h2 style={{ color: '#ddd' }}>식당아이디로 로그인 해주세요</h2>
        {['email', 'password'].map(el => (
          <input
            type={el === 'password' ? el : 'text'}
            onChange={e => this.targetValue(e, el)}
            placeholder={el}
            key={el}
          />
        ))}
        <button onClick={this.signin}>로그인</button>
      </div>
    );
  }
}

export default App;
