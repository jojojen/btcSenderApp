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
  error: string | null = null;

  async checkBalance() {
    if (!this.btcAddress) {
      this.error = 'Please enter a valid Bitcoin address.';
      return;
    }
    try {
      const response = await axios.get(`https://blockchain.info/rawaddr/${this.btcAddress}`);
      this.balance = response.data.final_balance / 100000000;
      this.error = null;
    } catch (error) {
      this.error = 'Error fetching balance. Please try again later.';
    }
  }
}
