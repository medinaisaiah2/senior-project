//this will be called for request leaving the app 
import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

//injecting service to this service 
@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService: AuthService) {}

    //here we ad the token crated to the authorization header 
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        const authRequest = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + authToken)
        });
        return next.handle(authRequest);
    }
}