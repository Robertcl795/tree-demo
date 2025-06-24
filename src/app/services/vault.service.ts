import { Injectable, signal } from '@angular/core';
import { Vault, TreeNode, NodeType, SelectionState } from '../models/vault.model';

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

  // Sample preselected nodes IDs for different vaults
  private preselectedNodesMap = new Map<string, string[]>([
    ['1', ['1-doc1', '1-img1', '1-img2']], // Personal Documents preselected items
    ['2', ['2-file1', '2-folder2', '2-folder2-child1']], // Work Projects preselected items
    ['3', ['3-video1', '3-audio1']] // Media Library preselected items
  ]);

  getVaults() {
    return this.vaults.asReadonly();
  }

  getVaultById(id: string) {
    return this.vaults().find(vault => vault.id === id);
  }

  getPreselectedNodesForVault(vaultId: string): string[] {
    return this.preselectedNodesMap.get(vaultId) || [];
  }

  // Simulate async data loading with delay
  async loadVaultData(vaultId: string, withPreselection: boolean = false): Promise<{
    nodes: TreeNode[];
    preselected?: string[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data = this.generateMockTreeData(vaultId);
    
    return {
      nodes: data,
      preselected: withPreselection ? this.getPreselectedNodesForVault(vaultId) : undefined
    };
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
        type: NodeType.FOLDER,
        children: [
          {
            id: `${vaultId}-doc1`,
            name: 'Report.pdf',
            type: NodeType.DOCUMENT
          },
          {
            id: `${vaultId}-config1`,
            name: 'app.config.json',
            type: NodeType.CONFIG
          },
          {
            id: `${vaultId}-folder2`,
            name: 'Subfolder',
            type: NodeType.FOLDER,
            children: [
              {
                id: `${vaultId}-file1`,
                name: 'data.xlsx',
                type: NodeType.FILE
              }
            ]
          }
        ]
      },
      {
        id: `${vaultId}-images`,
        name: 'Media',
        type: NodeType.FOLDER,
        children: [
          {
            id: `${vaultId}-img1`,
            name: 'photo1.jpg',
            type: NodeType.IMAGE
          },
          {
            id: `${vaultId}-img2`,
            name: 'screenshot.png',
            type: NodeType.IMAGE
          },
          {
            id: `${vaultId}-video1`,
            name: 'presentation.mp4',
            type: NodeType.VIDEO
          },
          {
            id: `${vaultId}-audio1`,
            name: 'recording.mp3',
            type: NodeType.AUDIO
          }
        ]
      },
      {
        id: `${vaultId}-exe1`,
        name: 'installer.exe',
        type: NodeType.EXECUTABLE
      },
      {
        id: `${vaultId}-archive1`,
        name: 'backup.zip',
        type: NodeType.ARCHIVE
      },
      {
        id: `${vaultId}-file2`,
        name: 'readme.txt',
        type: NodeType.FILE
      }
    ];

    return baseData;
  }

  private generateMockChildren(nodeId: string): TreeNode[] {
    // Extract the vault ID from node ID pattern (vaultId-nodeid)
    const vaultId = nodeId.split('-')[0];
    
    return [
      {
        id: `${nodeId}-child1`,
        name: 'Lazy loaded item 1',
        type: NodeType.FILE
      },
      {
        id: `${nodeId}-child2`,
        name: 'Lazy loaded folder',
        type: NodeType.FOLDER,
        children: []
      },
      {
        id: `${nodeId}-folder2-child1`,
        name: 'Nested document',
        type: NodeType.DOCUMENT
      }
    ];
  }
}