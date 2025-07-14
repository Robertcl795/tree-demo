import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { TreeExplorerComponent } from '../tree-explorer';
import { TreeNode, TreeConfig, NodeType, SelectionState, MenuAction } from '../tree-explorer';

@Component({
  selector: 'app-tree-test',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    TreeExplorerComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Tree Component Test Harness</span>
    </mat-toolbar>
    
    <div class="test-container">
      <div class="controls">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Test Controls</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="control-group">
              <h3>Tree Structure</h3>
              
              <button mat-raised-button color="primary" (click)="generateBasicTree()">
                Basic Tree
              </button>
              
              <button mat-raised-button color="accent" (click)="generateComplexTree()">
                Complex Tree
              </button>
              
              <button mat-raised-button color="warn" (click)="generateDeepTree()">
                Deep Tree
              </button>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="control-group">
              <h3>Selection Tests</h3>
              
              <button mat-stroked-button (click)="preselectLeafNodes()">
                Preselect Leaf Nodes
              </button>
              
              <button mat-stroked-button (click)="preselectMixedNodes()">
                Preselect Mixed Nodes
              </button>
              
              <button mat-stroked-button (click)="clearSelection()">
                Clear Selection
              </button>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="control-group">
              <h3>Add Node</h3>
              
              <mat-form-field appearance="fill" class="full-width">
                <mat-label>Parent Node ID</mat-label>
                <input matInput placeholder="Leave empty for root level" #parentIdInput>
              </mat-form-field>
              
              <mat-form-field appearance="fill" class="full-width">
                <mat-label>Node Name</mat-label>
                <input matInput placeholder="Enter node name" #nodeNameInput>
              </mat-form-field>
              
              <mat-form-field appearance="fill" class="full-width">
                <mat-label>Node Type</mat-label>
                <mat-select #nodeTypeSelect value="folder">
                  @for (type of nodeTypes; track type) {
                    <mat-option [value]="type">{{ type }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              
              <button mat-raised-button color="primary" 
                (click)="addNode(parentIdInput.value, nodeNameInput.value, nodeTypeSelect.value)">
                Add Node
              </button>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card>
          <mat-card-header>
            <mat-card-title>Event Log</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="event-log">
              @for (event of eventLog(); track $index) {
                <div class="event-entry">
                  <span class="event-time">{{ event.time }}</span>
                  <span class="event-type">{{ event.type }}</span>
                  <pre class="event-data">{{ event.data | json }}</pre>
                </div>
              }
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button (click)="clearEventLog()">Clear Log</button>
          </mat-card-actions>
        </mat-card>
      </div>
      
      <mat-card class="tree-container">
        <mat-card-header>
          <mat-card-title>Tree Explorer</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <tree-explorer
            [rootData]="treeData()"
            [config]="treeConfig()"
            [globalLoading]="isLoading()"
            (expand)="onNodeExpand($event)"
            (menuAction)="onMenuAction($event)"
            (selectionChange)="onSelectionChange($event)"
          ></tree-explorer>
        </mat-card-content>
        
        <mat-card-footer>
          <div class="selection-summary">
            <strong>Selected:</strong> {{ selectedNodes().length }} nodes
          </div>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .test-container {
      padding: 16px;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 16px;
    }
    
    .controls {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .control-group {
      margin: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .tree-container {
      height: calc(100vh - 120px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .tree-container mat-card-content {
      flex: 1;
      overflow: auto;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
    
    .event-log {
      height: 300px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 8px;
    }
    
    .event-entry {
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .event-time {
      color: #999;
      font-size: 0.8rem;
      margin-right: 8px;
    }
    
    .event-type {
      font-weight: 500;
      color: #3f51b5;
    }
    
    .event-data {
      margin: 4px 0 0;
      padding: 4px;
      background-color: #f9f9f9;
      font-size: 0.9rem;
      overflow-x: auto;
    }
    
    .selection-summary {
      padding: 8px 16px;
      text-align: right;
      background-color: #f5f5f5;
    }
  `]
})
export class TreeTestComponent implements OnInit {
  treeData = signal<TreeNode[]>([]);
  isLoading = signal<boolean>(false);
  selectedNodes = signal<string[]>([]);
  nodeIdCounter = 1;
  
  eventLog = signal<{time: string, type: string, data: any}[]>([]);

  // All node types for the select dropdown  
  nodeTypes = Object.values(NodeType);
  
  treeConfig = signal<TreeConfig>({
    childrenProperty: 'children',
    labelProperty: 'name',
    iconProperty: 'type'
  });
  
  ngOnInit() {
    this.generateBasicTree();
  }
  
  generateBasicTree() {
    this.isLoading.set(true);
    this.nodeIdCounter = 1;
    
    setTimeout(() => {
      const data: TreeNode[] = [
        {
          id: this.getNextNodeId(),
          name: 'Root Folder 1',
          type: NodeType.FOLDER,
          children: [
            {
              id: this.getNextNodeId(),
              name: 'Document 1',
              type: NodeType.DOCUMENT
            },
            {
              id: this.getNextNodeId(),
              name: 'Image 1',
              type: NodeType.IMAGE
            }
          ]
        },
        {
          id: this.getNextNodeId(),
          name: 'Root File 1',
          type: NodeType.FILE
        }
      ];
      
      this.treeData.set(data);
      this.isLoading.set(false);
      this.logEvent('generateTree', 'Basic tree generated');
    }, 500);
  }
  
  generateComplexTree() {
    this.isLoading.set(true);
    this.nodeIdCounter = 1;
    
    setTimeout(() => {
      const data: TreeNode[] = [
        {
          id: this.getNextNodeId(),
          name: 'Project Files',
          type: NodeType.FOLDER,
          children: [
            {
              id: this.getNextNodeId(),
              name: 'src',
              type: NodeType.FOLDER,
              children: [
                {
                  id: this.getNextNodeId(),
                  name: 'app',
                  type: NodeType.FOLDER,
                  children: [
                    {
                      id: this.getNextNodeId(),
                      name: 'main.ts',
                      type: NodeType.FILE
                    },
                    {
                      id: this.getNextNodeId(),
                      name: 'app.module.ts',
                      type: NodeType.FILE
                    }
                  ]
                },
                {
                  id: this.getNextNodeId(),
                  name: 'assets',
                  type: NodeType.FOLDER,
                  children: [
                    {
                      id: this.getNextNodeId(),
                      name: 'logo.png',
                      type: NodeType.IMAGE
                    }
                  ]
                }
              ]
            },
            {
              id: this.getNextNodeId(),
              name: 'package.json',
              type: NodeType.CONFIG
            },
            {
              id: this.getNextNodeId(),
              name: 'README.md',
              type: NodeType.DOCUMENT
            }
          ]
        },
        {
          id: this.getNextNodeId(),
          name: 'Media',
          type: NodeType.FOLDER,
          children: [
            {
              id: this.getNextNodeId(),
              name: 'presentation.mp4',
              type: NodeType.VIDEO
            },
            {
              id: this.getNextNodeId(),
              name: 'audio.mp3',
              type: NodeType.AUDIO
            }
          ]
        }
      ];
      
      this.treeData.set(data);
      this.isLoading.set(false);
      this.logEvent('generateTree', 'Complex tree generated');
    }, 500);
  }
  
  generateDeepTree() {
    this.isLoading.set(true);
    this.nodeIdCounter = 1;
    
    const createNestedFolders = (depth: number, breadth: number, currentDepth = 0): TreeNode[] => {
      if (currentDepth >= depth) return [];
      
      const nodes: TreeNode[] = [];
      
      for (let i = 0; i < breadth; i++) {
        const folderNode: TreeNode = {
          id: this.getNextNodeId(),
          name: `Folder D${currentDepth}-${i}`,
          type: NodeType.FOLDER,
          children: createNestedFolders(depth, breadth, currentDepth + 1)
        };
        
        // Add a file at each level
        if (folderNode.children) {
          folderNode.children.push({
            id: this.getNextNodeId(),
            name: `File-${currentDepth}-${i}.txt`,
            type: NodeType.FILE
          });
        }
        
        nodes.push(folderNode);
      }
      
      return nodes;
    };
    
    setTimeout(() => {
      const data: TreeNode[] = [
        {
          id: this.getNextNodeId(),
          name: 'Deep Structure',
          type: NodeType.FOLDER,
          children: createNestedFolders(5, 3)
        }
      ];
      
      this.treeData.set(data);
      this.isLoading.set(false);
      this.logEvent('generateTree', 'Deep tree generated');
    }, 500);
  }
  
  preselectLeafNodes() {
    const leafNodeIds: string[] = [];
    
    const findLeafNodes = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (!node.children || node.children.length === 0) {
          leafNodeIds.push(node.id);
        } else if (node.children) {
          findLeafNodes(node.children);
        }
      }
    };
    
    findLeafNodes(this.treeData());
    
    const updatedConfig = { 
      ...this.treeConfig(), 
      preselectedNodes: leafNodeIds 
    };
    this.treeConfig.set(updatedConfig);
    this.selectedNodes.set(leafNodeIds);
    
    this.logEvent('preselect', { count: leafNodeIds.length, nodes: leafNodeIds });
  }
  
  preselectMixedNodes() {
    const selectedNodeIds: string[] = [];
    
    const selectRandomNodes = (nodes: TreeNode[], probability = 0.4) => {
      for (const node of nodes) {
        if (Math.random() < probability) {
          selectedNodeIds.push(node.id);
        }
        
        if (node.children && node.children.length > 0) {
          selectRandomNodes(node.children, probability);
        }
      }
    };
    
    selectRandomNodes(this.treeData());
    
    const updatedConfig = { 
      ...this.treeConfig(), 
      preselectedNodes: selectedNodeIds 
    };
    this.treeConfig.set(updatedConfig);
    this.selectedNodes.set(selectedNodeIds);
    
    this.logEvent('preselect', { count: selectedNodeIds.length, nodes: selectedNodeIds });
  }
  
  clearSelection() {
    const updatedConfig = { 
      ...this.treeConfig(), 
      preselectedNodes: [] 
    };
    this.treeConfig.set(updatedConfig);
    this.selectedNodes.set([]);
    
    this.logEvent('clearSelection', { message: 'Selection cleared' });
  }
  
  addNode(parentId: string, name: string, nodeType: string) {
    if (!name) {
      alert('Please enter a node name');
      return;
    }
    
    const newNode: TreeNode = {
      id: this.getNextNodeId(),
      name: name,
      type: nodeType as NodeType
    };
    
    if (!parentId) {
      // Add at root level
      const currentData = [...this.treeData()];
      currentData.push(newNode);
      this.treeData.set(currentData);
    } else {
      // Find parent and add as child
      const currentData = [...this.treeData()];
      const updated = this.addNodeToParent(currentData, parentId, newNode);
      
      if (updated) {
        this.treeData.set(currentData);
      } else {
        alert(`Parent node with ID ${parentId} not found`);
      }
    }
    
    this.logEvent('addNode', { node: newNode, parentId });
  }
  
  private addNodeToParent(nodes: TreeNode[], parentId: string, newNode: TreeNode): boolean {
    for (const node of nodes) {
      if (node.id === parentId) {
        if (!node.children) {
          node.children = [];
        }
        node.children.push(newNode);
        return true;
      }
      
      if (node.children && node.children.length > 0) {
        if (this.addNodeToParent(node.children, parentId, newNode)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  onNodeExpand(event: { nodeId: string; node: TreeNode }) {
    this.logEvent('expand', event);
  }
  
  onMenuAction(event: { action: MenuAction; node: TreeNode }) {
    this.logEvent('menuAction', event);
  }
  
  onSelectionChange(event: { selectedIds: string[]; selectedNodes: TreeNode[] }) {
    this.selectedNodes.set(event.selectedIds);
    this.logEvent('selectionChange', { count: event.selectedIds.length, ids: event.selectedIds });
  }
  
  clearEventLog() {
    this.eventLog.set([]);
  }
  
  private getNextNodeId(): string {
    return `node-${this.nodeIdCounter++}`;
  }
  
  private logEvent(type: string, data: any) {
    const now = new Date();
    const time = now.toLocaleTimeString();
    
    const currentLog = this.eventLog();
    this.eventLog.set([{ time, type, data }, ...currentLog].slice(0, 100));
  }
}
