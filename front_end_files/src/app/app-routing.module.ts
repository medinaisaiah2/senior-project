import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './Home/home.component';
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./auth/auth.guard";
import { TransactionsComponent } from "./User Pages/Transactions/transactions.component";
import { StocksComponent } from "./User Pages/Stocks/stocks.component";
import { TradingComponent } from "./User Pages/Trading/trading.component";
import { StrategyComponent } from "./User Pages/Strategy/strategy.component";
import { RobinhoodComponent } from "./User Pages/Robinhood/robinhood.component";


const routes: Routes = [
    { path: 'header', component: HeaderComponent },
    { path: 'home', component: HomeComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'transactions', component: TransactionsComponent },
    {path: 'stocks', component: StocksComponent},
    {path: 'trading', component: TradingComponent},
    {path: 'strategy', component: StrategyComponent},
    {path: 'robinhood', component: RobinhoodComponent}



      
      
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule{}