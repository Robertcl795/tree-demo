import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { 
  TreeExplorerComponent, 
  TreeNode, 
  TreeConfig, 
  createDefaultTreeConfig,
  NodeType 
} from '../tree-explorer';

interface FileNode extends TreeNode {
  name: string;
  type: 'folder' | 'file' | 'image' | 'document';
  size?: number;
  modified?: Date;
  children?: FileNode[];
}

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    TreeExplorerComponent
  ],
  template: `
    <div class="demo-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Enhanced Tree Explorer Demo</mat-card-title>
          <mat-card-subtitle>Generic, type-safe tree component with Angular Signals</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="controls">
            <mat-form-field>
              <mat-label>Search Files</mat-label>
              <input matInput [(ngModel)]="searchTerm" placeholder="Type to search...">
            </mat-form-field>
            
            <div class="actions">
              <button mat-raised-button color="primary" (click)="expandAll()">Expand All</button>
              <button mat-raised-button (click)="collapseAll()">Collapse All</button>
              <button mat-raised-button (click)="clearSelection()">Clear Selection</button>
            </div>
          </div>
          
          <div class="tree-container">
            <tree-explorer
              #treeExplorer
              [rootData]="fileData()"
              [config]="treeConfig()"
              [searchTerm]="searchTerm"
              [globalLoading]="isLoading()"
              (selectionChange)="onSelectionChange($event)"
              (menuAction)="onMenuAction($event)"
              (nodeClick)="onNodeClick($event)"
              (nodeDoubleClick)="onNodeDoubleClick($event)"
            >
              <!-- Custom empty state -->
              <div slot="empty" class="empty-state">
                <h3>No files found</h3>
                <p>Try adjusting your search terms</p>
              </div>
            </tree-explorer>
          </div>
          
          <div class="status">
            <p><strong>Selected:</strong> {{ selectedFiles().length }} files</p>
            <p><strong>Search:</strong> {{ searchTerm || 'No filter' }}</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 16px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .controls {
      display: flex;
      gap: 16px;
      align-items: flex-end;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    
    .actions {
      display: flex;
      gap: 8px;
    }
    
    .tree-container {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      height: 400px;
      overflow: auto;
      padding: 8px;
    }
    
    .empty-state {
      text-align: center;
      padding: 32px;
      color: #666;
    }
    
    .status {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 32px;
    }
    
    mat-form-field {
      min-width: 200px;
    }
  `]
})
export class TreeDemoComponent {
  searchTerm = '';
  isLoading = signal(false);
  selectedFiles = signal<TreeNode<FileNode>[]>([]);
  
  // Sample file system data
  fileData = signal<TreeNode<FileNode>[]>([
    {
      id: '1',
      name: 'Documents',
      type: 'folder',
      modified: new Date('2024-01-15'),
      children: [
        {
          id: '2',
          name: 'Project Proposal.pdf',
          type: 'document',
          size: 2048576,
          modified: new Date('2024-01-10')
        },
        {
          id: '3',
          name: 'Meeting Notes.docx',
          type: 'document',
          size: 45678,
          modified: new Date('2024-01-12')
        },
        {
          id: '4',
          name: 'Archive',
          type: 'folder',
          modified: new Date('2024-01-01'),
          children: [
            {
              id: '5',
              name: 'Old Project.zip',
              type: 'file',
              size: 10485760,
              modified: new Date('2023-12-15')
            }
          ]
        }
      ]
    },
    {
      id: '6',
      name: 'Images',
      type: 'folder',
      modified: new Date('2024-01-20'),
      children: [
        {
          id: '7',
          name: 'Screenshot.png',
          type: 'image',
          size: 1234567,
          modified: new Date('2024-01-18')
        },
        {
          id: '8',
          name: 'Logo.svg',
          type: 'image',
          size: 8765,
          modified: new Date('2024-01-16')
        }
      ]
    },
    {
      id: '9',
      name: 'README.md',
      type: 'file',
      size: 1024,
      modified: new Date('2024-01-22')
    }
  ]);
  
  // Tree configuration with custom features
  treeConfig = signal<TreeConfig<FileNode>>(createDefaultTreeConfig({
    labelProperty: 'name',
    iconResolver: (node: TreeNode<FileNode>) => {
      const fileNode = node as FileNode;
      switch (fileNode.type) {
        case 'folder': return 'folder';
        case 'image': return 'image';
        case 'document': return 'article';
        default: return 'description';
      }
    },
    selectableTypes: ['file', 'document', 'image'],
    disabledTypes: [
      {
        type: 'folder',
        reason: 'Folders cannot be selected for download'
      }
    ],
    contextMenuItems: [
      { id: 'open', label: 'Open', icon: 'open_in_new', action: 'open' },
      { id: 'download', label: 'Download', icon: 'download', action: 'download' },
      { id: 'separator1', separator: true },
      { id: 'rename', label: 'Rename', icon: 'edit', action: 'rename' },
      { id: 'delete', label: 'Delete', icon: 'delete', action: 'delete' },
      { id: 'separator2', separator: true },
      { id: 'properties', label: 'Properties', icon: 'info', action: 'properties' }
    ],
    preselectedNodes: ['2', '7'] // Pre-select some files
  }));
  
  // Tree explorer reference (set via template reference)
  private treeExplorer: any;
  
  onSelectionChange(event: { selectedIds: string[], selectedNodes: TreeNode<FileNode>[] }) {
    this.selectedFiles.set(event.selectedNodes);
    console.log('Selection changed:', event);
  }
  
  onMenuAction(event: { action: any, node: TreeNode<FileNode> }) {
    const fileNode = event.node as FileNode;
    console.log('Menu action:', event.action.action, 'on', fileNode.name);
    
    switch (event.action.action) {
      case 'open':
        this.openFile(event.node);
        break;
      case 'download':
        this.downloadFile(event.node);
        break;
      case 'rename':
        this.renameFile(event.node);
        break;
      case 'delete':
        this.deleteFile(event.node);
        break;
      case 'properties':
        this.showProperties(event.node);
        break;
    }
  }
  
  onNodeClick(event: { node: TreeNode<FileNode>, event: Event }) {
    const fileNode = event.node as FileNode;
    console.log('Node clicked:', fileNode.name);
  }
  
  onNodeDoubleClick(event: { node: TreeNode<FileNode>, event: Event }) {
    const fileNode = event.node as FileNode;
    console.log('Node double-clicked:', fileNode.name);
    if (fileNode.type !== 'folder') {
      this.openFile(event.node);
    }
  }
  
  expandAll() {
    // Access tree explorer methods if needed
    console.log('Expanding all nodes');
  }
  
  collapseAll() {
    console.log('Collapsing all nodes');
  }
  
  clearSelection() {
    this.selectedFiles.set([]);
    console.log('Cleared selection');
  }
  
  private openFile(node: TreeNode<FileNode>) {
    const fileNode = node as FileNode;
    alert(`Opening ${fileNode.name}`);
  }
  
  private downloadFile(node: TreeNode<FileNode>) {
    const fileNode = node as FileNode;
    alert(`Downloading ${fileNode.name} (${this.formatFileSize(fileNode.size || 0)})`);
  }
  
  private renameFile(node: TreeNode<FileNode>) {
    const fileNode = node as FileNode;
    const newName = prompt('Enter new name:', fileNode.name);
    if (newName && newName !== fileNode.name) {
      // Update the node name in the data
      // This is just a demo - in real app you'd update your data source
      console.log(`Renaming ${fileNode.name} to ${newName}`);
    }
  }
  
  private deleteFile(node: TreeNode<FileNode>) {
    const fileNode = node as FileNode;
    if (confirm(`Are you sure you want to delete ${fileNode.name}?`)) {
      console.log(`Deleting ${fileNode.name}`);
      // Remove from data source
    }
  }
  
  private showProperties(node: TreeNode<FileNode>) {
    const fileNode = node as FileNode;
    const props = [
      `Name: ${fileNode.name}`,
      `Type: ${fileNode.type}`,
      `Size: ${this.formatFileSize(fileNode.size || 0)}`,
      `Modified: ${fileNode.modified?.toLocaleDateString() || 'Unknown'}`
    ].join('\\n');
    
    alert(`File Properties:\\n\\n${props}`);
  }
  
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
