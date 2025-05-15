import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  @Input() title: string = '';
  @Input() dense = false;

  isLoggedIn: boolean | null = null;
  isPaid: boolean | null = null;

  constructor(public auth: AuthService) {}

  async ngOnInit() {
    this.auth.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.isPaid = await this.auth.isPaid();
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  async signOut() {
    await this.auth.signOut();
  }

  isExpired(date: Date | undefined): boolean {
    if (date === undefined) {
      return true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today.getTime() > date.getTime();
  }
}
