

function setColor (lastPrice, currentPrice, element){
  if (lastPrice == null || lastPrice == currentPrice){
    element.style.color = 'white';
  }
  else if (lastPrice < currentPrice) {
    element.innerHTML = element.innerHTML + " ▲";
    element.style.color = 'green';
  } 
  else {
    element.innerHTML = element.innerHTML + " ▼";
    element.style.color = 'red';
  }
}

function getData(arr, lastCallCountValue){

  const endpoint1 = `wss://stream.binance.com:9443/ws/${arr[0]}@trade`;

  const endpoint2 = `wss://stream.binance.com:9443/ws/${arr[1]}@trade`;

  const ticker = new WebSocket(endpoint1);
  const targetTicker = new WebSocket(endpoint2);

  let lastLiveExchangeRate = null;

  //Variable to control number of responses that get stored and used. 
  //Aids performance, and user experience. Does not start at 0 so
  //the exchange rate and conversion are displayed "instantly"
  let j = 4;
  ticker.onmessage = (event) => { 
    j++;
    if (j%5 === 0){

    let response = JSON.parse(event.data);
    let price = parseFloat(response.p).toFixed(6);

    targetTicker.onmessage = (event) => {
      if (j%5 === 0){
      j++;
      let response2 = JSON.parse(event.data);
      let targetPrice = parseFloat(response2.p).toFixed(6);

      let liveExchangeRate = parseFloat(price/targetPrice).toFixed(6);


      let domElement = document.getElementById("display");

      domElement.innerHTML = "Exchange rate: " + parseFloat(price/targetPrice).toFixed(6);

      setColor(lastLiveExchangeRate, liveExchangeRate, domElement);

      let domElement2 = document.getElementById("conversion");

      domElement2.innerHTML = arr[2] + " " + arr[0].toUpperCase() + " = " + arr[2]*(parseFloat(price/targetPrice).toFixed(6)) + " " + arr[1].toUpperCase();

      setColor(lastLiveExchangeRate, liveExchangeRate, domElement2);

      lastLiveExchangeRate = liveExchangeRate;

      closeConnections(callCount, lastCallCountValue, ticker, targetTicker);
      }
    };
  };
  }
}

let callCount = 0;
function convert(){

  callCount++;
  const lastCallCountValue = callCount;

  const symbolsAndAmount = [];
  
  symbolsAndAmount.push(document.getElementById("symbol").value);
  symbolsAndAmount.push(document.getElementById("target-symbol").value);
  symbolsAndAmount.push(document.getElementById("amount").value);

  getData(symbolsAndAmount, lastCallCountValue);
}

function closeConnections(callCount, lastCallCount, ws1, ws2){
  if (callCount > lastCallCount){
    ws1.close();
    ws2.close();
  }
}

  




