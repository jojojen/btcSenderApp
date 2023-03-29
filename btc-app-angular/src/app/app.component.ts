import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  btcAddress!: string;
  balance: number | null = null;
  usdValue: number | null = null;
  error: string | null = null;

  transactionFeeBtc: number | null = null;
  transactionFeeUsd: number | null = null;

  isLoading: boolean = false;

// Add a new method to fetch balance only
async fetchBalance() {
  this.isLoading = true;
  if (!this.btcAddress) {
    this.error = 'Please enter a valid Bitcoin address.';
    return;
  }
  try {
    const response = await axios.get(`https://blockchain.info/rawaddr/${this.btcAddress}`);
    this.balance = response.data.final_balance / 100000000;
    this.error = null;
    await this.calculateUsdValue();
  } catch (error) {
    this.error = 'Error fetching balance. Please try again later.';
  }
  this.isLoading = false;
}

// Add a new method to fetch transaction fees only
async fetchTransactionFees() {
  this.isLoading = true;
  try {
    const feePerByte = await this.fetchTransactionFeeEstimate();
    const averageTransactionSize = 250; // You can adjust this value based on the type of transaction
    this.transactionFeeBtc = feePerByte * averageTransactionSize / 100000000;
    this.transactionFeeUsd = this.transactionFeeBtc * (this.usdValue! / this.balance!);
  } catch (error) {
    this.error = 'Error fetching transaction fees. Please try again later.';
  }
  this.isLoading = false;
}


  async calculateUsdValue() {
    try {
      const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
      const btcToUsdRate = response.data.bpi.USD.rate_float;
      this.usdValue = this.balance! * btcToUsdRate;
    } catch (error) {
      this.error = 'Error fetching BTC to USD conversion rate. Please try again later.';
    }
  }

  async fetchTransactionFeeEstimate() {
    try {
      const response = await axios.get('https://mempool.space/api/v1/fees/recommended');
      const fastestFeePerByte = response.data.fastestFee;
      return fastestFeePerByte;
    } catch (error) {
      this.error = 'Error fetching transaction fee estimate. Please try again later.';
    }
  }
  
}
