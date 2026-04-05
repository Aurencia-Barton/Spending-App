// Small app component that keeps track of money spent.
// It stores a list of expenses and lets the user add new ones.
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// One expense item: how much and what it's for
interface Expense {
  amount: number;
  category: string;
}

@Component({
  selector: 'app-root',
  // standalone: means this component can run by itself without an NgModule wrapper
  standalone: true,
  // imports: lets the component use simple form features (so inputs keep their values)
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(private http: HttpClient) {} //sets up dependenccies so we can call the backend API
  // The saved expenses start empty and grow as the user adds items
  expenses: Expense[] = [];
  // These hold the values currently typed into the two input boxes
  amount: number | null = null;
  category: string = '';

  ngOnInit() {
    this.loadExpenses(); // Load expenses from the backend when the component initializes
  }

  // When you press Add, this runs:
  // - it checks that you typed something useful
  // - saves the item to the list
  // - clears the input boxes so you can add another
  addExpense() {
    if (this.amount === null || this.category.trim() === '') {
      return;
    }
    const expense = {
        amount: this.amount,
        category: this.category
    };
    this.http.post('http://localhost:3000/expenses', expense)
    .subscribe(() => {
      this.loadExpenses(); // Refresh the list after adding a new expense
    });

    //Resets inputs after saving:
    this.amount = null;
    this.category = '';

  }

  // Adds up all expense amounts and gives back the total number
  getTotal(): number {
    return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  // Loads expenses from the backend API and updates the list
  loadExpenses() {
    this.http.get<any[]>('http://localhost:3000/expenses')
    .subscribe(data => {
      this.expenses = data; //stores the data from the backend in the expenses list, which will update the UI
    });
  }
}
