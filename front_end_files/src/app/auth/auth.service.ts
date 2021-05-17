//this service needs to be injected to any
// other component that will update the UI
//once a user is logged in to verify the token  

import { HttpClient } from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn: "root" })
export class AuthService{
  private isAuthenticated = false; 
  //this token variable will hold the created jwt token 
private token: string;

//will use Subject from rxjs to push auth information to components in need of it 
private authStatusListener = new Subject<boolean>(); 

  constructor(private http: HttpClient, private router: Router) {} 

  //will need to use this function in other services to verify user auth 
  getToken (){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated; 
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable(); 
  }

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
      this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe( response => {
        console.log(response);
      });
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string}>("http://localhost:3000/api/user/login", authData)
    .subscribe(response => {
      //extracting token 
      const token = response.token; 
      //storing token to be used in other services 
      this.token = token;
      this.authStatusListener.next(true);
      this.router.navigate(['/home']);
    })
  }
  //this will 
  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);  
    this.router.navigate(['/login']);
  }
}