import { Injectable, signal } from '@angular/core';
import { Vault, TreeNode } from '../models/vault.model';

@Injectable({
  providedIn: 'root'
})
export class VaultService {
  private vaults = signal<Vault[]>([
    { id: '1', name: 'Personal Documents', peopleCount: 3, sectionsCount: 12 },
    { id: '2', name: 'Work Projects', peopleCount: 8, sectionsCount: 25 },
    { id: '3', name: 'Media Library', peopleCount: 2, sectionsCount: 45 },
    { id: '4', name: 'Archive', peopleCount: 1, sectionsCount: 67 }
  ]);

  getVaults() {
    return this.vaults.asReadonly();
  }

  getVaultById(id: string) {
    return this.vaults().find(vault => vault.id === id);
  }

  // Simulate async data loading with delay
  async loadVaultData(vaultId: string): Promise<TreeNode[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return this.generateMockTreeData(vaultId);
  }

  async loadNodeChildren(nodeId: string): Promise<TreeNode[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.generateMockChildren(nodeId);
  }

  private generateMockTreeData(vaultId: string): TreeNode[] {
    const baseData: TreeNode[] = [
      {
        id: `${vaultId}-folder1`,
        name: 'Documents',
        type: 'folder',
        children: [
          {
            id: `${vaultId}-doc1`,
            name: 'Report.pdf',
            type: 'document'
          },
          {
            id: `${vaultId}-folder2`,
            name: 'Subfolder',
            type: 'folder',
            children: [
              {
                id: `${vaultId}-file1`,
                name: 'data.xlsx',
                type: 'file'
              }
            ]
          }
        ]
      },
      {
        id: `${vaultId}-images`,
        name: 'Images',
        type: 'folder',
        children: [
          {
            id: `${vaultId}-img1`,
            name: 'photo1.jpg',
            type: 'image'
          },
          {
            id: `${vaultId}-img2`,
            name: 'screenshot.png',
            type: 'image'
          }
        ]
      },
      {
        id: `${vaultId}-file2`,
        name: 'readme.txt',
        type: 'file'
      }
    ];

    return baseData;
  }

  private generateMockChildren(nodeId: string): TreeNode[] {
    return [
      {
        id: `${nodeId}-child1`,
        name: 'Lazy loaded item 1',
        type: 'file'
      },
      {
        id: `${nodeId}-child2`,
        name: 'Lazy loaded folder',
        type: 'folder',
        children: []
      }
    ];
  }
}