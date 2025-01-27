import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../auth.service';
import { clearIntendedDestination } from '../../intendedDestination';

@Component({
  selector: 'app-auto-sign-in-success-page',
  templateUrl: './auto-sign-in-success-page.component.html',
  styleUrls: ['./auto-sign-in-success-page.component.scss'],
})
export class AutoSignInSuccessPageComponent implements OnInit {
  private destroy$ = new Subject();

  public isLoading = true;

  public canBeAutomaticallyClosed = !!window.opener;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    from(this.auth.isLoggedIn$)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn) => {
        this.isLoading = false;
        clearIntendedDestination();
      });
  }

  closeTheTab() {
    window.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
