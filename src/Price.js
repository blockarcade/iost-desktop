import React, { useState, useEffect } from 'react';
import { Sparklines, SparklinesCurve } from 'react-sparklines';

const Price = () => {
  const [price, setPrice] = useState(0.000000);
  const [data, setData] = useState([0, 0, 0, 0]);

  const updatePrice = () => {
    fetch('https://api.binance.com/api/v3/avgPrice?symbol=IOSTUSDT')
      .then(response => response.json())
      .then(newPrice => setPrice(Number(newPrice.price)))
      .then(() => fetch('https://api.binance.com/api/v1/klines?symbol=IOSTUSDT&interval=8h&limit=4'))
      .then(response => response.json())
      .then((prices) => {
        const newData = prices.map(newPrice => Number(newPrice[4]));
        setData(newData);
      });
  };

  useEffect(
    () => {
      updatePrice();
      const timer = setTimeout(() => updatePrice(), 10000);
      return () => {
        clearTimeout(timer);
      };
    },
    [],
  );

  return (
    <div>
      <h1>IOST</h1>
      <h2>
        $
        {price.toFixed(6)}
      </h2>
      <Sparklines data={data}>
        <SparklinesCurve color="#008bff" />
      </Sparklines>
    </div>
  );
};


module.exports = Price;
