import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { OnChainService } from './on-chain.service';





@Injectable()
export class  AuthGuard implements CanActivate {

  constructor(

    private onChainService: OnChainService,
    public router:Router
  ) {

  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

    return await this.checkAllow(state, route);
  }

  checkAllow( myState: RouterStateSnapshot, route:ActivatedRouteSnapshot): boolean {

    const allowedChain = this.onChainService.allowedChain
 
    if (allowedChain !== undefined && allowedChain  === true) {
       
      return true;
    } else {

    }

    this.router.navigate(['/home'])
    return false;

  }

}

