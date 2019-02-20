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

  render() {
    return this.state.isLogin ? (
      <div
        style={{
          fontSize: '1em',
          textAlign: 'center',
          color: '#fff',
          padding: '20px'
        }}
      >
        <span>{localStorage.getItem('restaurantName')}</span>의 싸장님 페이지
        <button
          style={{
            fontSize: '0.8em'
          }}
          onClick={() => {
            localStorage.setItem('isLogin', false);
            localStorage.setItem('restaurantName', '');
            this.setState({ isLogin: false });
          }}
        >
          로그아웃
        </button>
        <div style={{ fontSize: '1em', padding: '30px' }} className="orderlist">
          <hr />
          주문리스트
          {this.state.orderData.map((el, index) => (
            <div
              key={index}
              style={{
                marginTop: 5,
                boxShadow: '0px 0px 5px rgba(0,0,0,0.5)',
                fontSize: '1em',
                lineHeight: '1.6em',
                padding: '10px 20px'
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
                onClick={async e => {
                  let order_id = e.target.parentNode.childNodes[0].textContent.slice(
                    6
                  );
                  let restaurant_id = await localStorage.getItem(
                    'restaurant_id'
                  );
                  axios.get(
                    this.baseUrl +
                      `/restaurants/delivery/${restaurant_id}/${order_id}`
                  );
                  this.setState({
                    ...this.state,
                    orderData: this.state.orderData.filter(
                      el => el.order_id !== order_id
                    )
                  });
                }}
                // 아직 주문번호로 지우는 거 확인 못했음. 내일 꼭 확인하기 받아오는 데이터도 한번더 확인
              >
                배달완료
              </button>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div
        style={{
          margin: '10px auto',
          display: 'flex',
          padding: '5%',
          flexDirection: 'column',
          textAlign: 'center',
          width: '400px'
        }}
      >
        <h2 style={{ color: '#ddd' }}>식당아이디로 로그인 해주세요</h2>
        <input
          onChange={e =>
            this.setState({
              email: e.target.value
            })
          }
          placeholder="email"
        />
        <input
          type="password"
          onChange={e =>
            this.setState({
              password: e.target.value
            })
          }
          placeholder="password"
        />
        <button
          onClick={() => {
            axios
              .post(
                this.baseUrl + '/users/signin',
                { email: this.state.email, password: this.state.password },
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
                } else {
                  alert('아이디나 비밀번호를 확인해주세요.');
                }
              });
          }}
        >
          로그인
        </button>
      </div>
    );
  }
}

export default App;
