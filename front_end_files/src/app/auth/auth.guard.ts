//this component is to protect the toutes from being accecible through the 
//navigaion bar. Need to add Comp to providers array in app-routing.component.ts 
//then need to add to the routes that will be using component 
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {} 

    canActivate(
        route: ActivatedRouteSnapshot,
         state: RouterStateSnapshot
         ): boolean | Observable<boolean> | Promise<boolean > {
        const isAuth = this.authService.getIsAuth(); 
        if(!isAuth){
            this.router.navigate(['/login']);
        }
        return isAuth; 
    }
}

//not working for HomeComp yet???
