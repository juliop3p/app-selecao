import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly servicoAuth = inject(AuthService);
  private readonly roteador = inject(Router);

  protected readonly usuario = this.servicoAuth.usuarioAtual;

  public sair(): void {
    this.servicoAuth.sair().subscribe(() => this.roteador.navigate(['/auth/login']));
  }
}
