// import WebSocket from 'ws';
import {load} from 'protobufjs';
import {EventEmitter} from 'events';
// import {join} from 'path';

export default class YahooFinance extends EventEmitter {
  _tickers;
  _ws;
  root;
  isActive;

  constructor(tickers, cb) {
    super();
    this._tickers = tickers.map((t) => t + '.NS');
    // this.isActive =isActive
    this.cb = cb;
  }

  get tickers() {
    return this._tickers;
  }

  addTicker(ticker, clear = false) {
    if (clear) this._tickers = [];
    let force = this._tickers.length < 1;
    if (Array.isArray(ticker)) {
      ticker = ticker.map((t) => t + '.NS');
      this._tickers.push(...ticker);
    } else this._tickers.push(ticker + '.NS');
    this._tickers = Array.from(new Set(this._tickers));
    this.refresh(force);
  }

  removeTicker(ticker = '') {
    if (ticker.length < 1) this._tickers = [];
    if (this._tickers.indexOf(ticker + '.NS') > -1)
      this._tickers.splice(this._tickers.indexOf(ticker + '.NS'), 1);
    this.refresh();
  }

  async refresh(force = false) {
    console.log('inside refresh the force is ', force);
    if (force) await this.connect();
    if (this.isActive())
      this._ws.send(
        JSON.stringify({
          subscribe: this._tickers,
        })
      );
  }

  async connect() {
    if (this._tickers.length < 1)
      return console.error('No tickers found. Autoconnect when ticker is added..');
    try {
      this.root = await load('./yahoo.proto');
    } catch (error) {
      throw new Error('Unable to load proto file. Please contact developer');
    }
    console.log('connecting state', this.isConnecting());
    console.log('connecting state', this.isActive());
    if (this.isActive() || this.isConnecting()) return;
    this._ws = new WebSocket('wss://streamer.finance.yahoo.com');

    this._ws.onclose = () => console.log('disconnected');
    this._ws.onerror = (error) => console.log('error', error);
    this._ws.onopen = async () => {
      await new Promise((r) => setTimeout(r, 3000));
      console.log('connected');
      this._ws.send(
        JSON.stringify({
          subscribe: this._tickers,
        })
      );
    };

    this._ws.onmessage = ({data}) => {
      try {
        const message = this.root
          .lookupType('YahooFinance.Message')
          .decode(Buffer.from(data.toString(), 'base64'));
        // this.emit('message', message);
        // console.log(message.price);
        var symbol = message.id.split('.')[0];
        var price = message.price.toFixed(2);
        this.cb((prevPrices) => ({
          ...prevPrices,
          [symbol]: price,
        }));
      } catch (error) {
        this.emit('error', error);
      }
    };
  }

  isActive() {
    console.log(
      'inside is active ',
      !!(this._ws && this?._ws?.readyState === WebSocket?.CONNECTING)
    );
    return !!(this._ws && this?._ws?.readyState === WebSocket?.OPEN);
  }
  isConnecting() {
    return !!(this?._ws && this._ws?.readyState === WebSocket?.CONNECTING);
  }

  close() {
    if (!this._ws) return;
    if (this.isActive()) {
      this._ws.close();
      this._tickers = [];
    }
  }
}
