import React, { Component } from 'react';
import axios from 'axios';
import SocketIOClient from 'socket.io-client';
// import axios from 'axios';

class App extends Component {
  state = {
    email: '',
    password: '',
    isLogin: JSON.parse(localStorage.getItem('isLogin')),
    orderData: []
  };

  socket = SocketIOClient(
    'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080'
  );

  componentDidMount() {
    this.socket.on(localStorage.getItem('restaurant_id'), order => {
      alert('새 주문이 왔어요!');
      console.log(order);
      this.setState({
        ...this.state,
        orderData: [order, ...this.state.orderData]
      });
    });
  }

  render() {
    return this.state.isLogin ? (
      <div style={{ fontSize: 40 }}>
        쏴좡뉨 풰이지
        <button
          onClick={() => {
            localStorage.setItem('isLogin', false);
            this.setState({ isLogin: false });
          }}
        >
          쏴좡뉨 나가지 말아여
        </button>
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
              <h4>주문시간: {el._date}</h4>
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
                    `http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/restaurants/delivery/${restaurant_id}/${order_id}`
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
      <div>
        <h1>식당아이디로 로그인 해주세요</h1>
        <input
          style={{ width: 350, height: 50 }}
          onChange={e =>
            this.setState({
              email: e.target.value
            })
          }
          placeholder="email"
        />
        <input
          type="password"
          style={{ width: 350, height: 50 }}
          onChange={e =>
            this.setState({
              password: e.target.value
            })
          }
          placeholder="password"
        />
        <button
          style={{ height: 50 }}
          onClick={() => {
            axios
              .post(
                'http://ec2-34-201-173-255.compute-1.amazonaws.com:8080/users/signin',
                { email: this.state.email, password: this.state.password },
                { headers: { 'Content-Type': 'application/json' } }
              )
              .then(res => {
                localStorage.setItem('restaurant_id', res.data.restaurantKey);
                if (res.status === 200) {
                  localStorage.setItem('isLogin', true);
                  this.setState({ isLogin: true });
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
