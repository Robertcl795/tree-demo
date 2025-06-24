import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VaultService } from '../services/vault.service';
import { TreeNode, TreeConfig, NodeType } from '../models/vault.model';
import { TreeExplorerComponent } from '../components/tree-explorer/tree-explorer.component';

@Component({
  selector: 'app-vault-view',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    TreeExplorerComponent
  ],
  templateUrl: './vault-view.component.html',
  styleUrl: './vault-view.component.scss'
})
export class VaultViewComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vaultService = inject(VaultService);

  private vaultId = signal<string>('');
  rootData = signal<TreeNode[]>([]);
  isLoading = signal<boolean>(false);
  
  vaultName = computed(() => {
    const vault = this.vaultService.getVaultById(this.vaultId());
    return vault?.name || 'Unknown Vault';
  });

  explorerConfig: TreeConfig = {
    childrenProperty: 'children',
    labelProperty: 'name',
    iconProperty: 'type',
    selectableTypes: [NodeType.FOLDER, NodeType.FILE, NodeType.DOCUMENT, NodeType.ARCHIVE],
    disabledTypes: [
      {
        type: NodeType.IMAGE,
        reason: 'Image files cannot be selected for bulk operations'
      },
      {
        type: NodeType.CONFIG,
        reason: 'Configuration files are protected from modification'
      },
      {
        type: NodeType.EXECUTABLE,
        reason: 'Executable files cannot be selected for security reasons'
      },
      {
        type: NodeType.VIDEO,
        reason: 'Video files are too large for bulk operations'
      },
      {
        type: NodeType.AUDIO,
        reason: 'Audio files are managed separately'
      }
    ]
  };

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vaultId.set(id);
      await this.loadVaultData();
    }
  }

  private async loadVaultData() {
    this.isLoading.set(true);
    try {
      const response = await this.vaultService.loadVaultData(this.vaultId());
      this.rootData.set(response.nodes);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onNodeExpand(nodeId: string) {
    // Here you could implement lazy loading of children
    console.log('Node expanded:', nodeId);
  }

  onMenuAction(action: { nodeId: string; action: string }) {
    console.log('Menu action:', action);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
