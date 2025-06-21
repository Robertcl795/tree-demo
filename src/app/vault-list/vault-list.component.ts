import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { VaultService } from '../services/vault.service';

@Component({
  selector: 'app-vault-list',
 imports: [
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './vault-list.component.html',
  styleUrl: './vault-list.component.scss'
})
export class VaultListComponent {
private vaultService = inject(VaultService);
  private router = inject(Router);

  vaults = this.vaultService.getVaults();
  displayedColumns = ['name', 'people', 'sections', 'actions'];

  browseVault(vaultId: string) {
    this.router.navigate(['/vault', vaultId]);
  }
}
