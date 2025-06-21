import { Component, input, output, signal, computed } from '@angular/core';
import { TreeNode, TreeConfig, MenuAction } from '../../models/vault.model';
import { TreeItemComponent } from '../tree-item/tree-item.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface FlattenedNode extends TreeNode {
  depth: number;
}

@Component({
  selector: 'app-tree-explorer',
  imports: [
    TreeItemComponent,
    MatProgressBarModule
  ],
  templateUrl: './tree-explorer.component.html',
  styleUrl: './tree-explorer.component.scss'
})
export class TreeExplorerComponent {
// Inputs using new Angular signal inputs
  rootData = input.required<TreeNode[]>();
  config = input.required<TreeConfig>();
  globalLoading = input<boolean>(false);

  // Outputs
  expand = output<string>();
  menuAction = output<MenuAction>();

  // Internal state
  private expandedNodes = signal<Set<string>>(new Set());
  private selectedNodes = signal<Set<string>>(new Set());
  private loadingNodes = signal<Set<string>>(new Set());

  // Computed properties
  flattenedNodes = computed(() => {
    return this.flattenTree(this.rootData(), 0);
  });

  private flattenTree(nodes: TreeNode[], depth: number): FlattenedNode[] {
    const result: FlattenedNode[] = [];

    for (const node of nodes) {
      // Create flattened node with depth information
      const flatNode: FlattenedNode = {
        ...node,
        depth
      };
      
      result.push(flatNode);

      if (this.isNodeExpanded(node.id) && node.children?.length) {
        result.push(...this.flattenTree(node.children, depth + 1));
      }
    }

    return result;
  }

  isNodeExpanded(nodeId: string): boolean {
    return this.expandedNodes().has(nodeId);
  }

  isNodeSelected(nodeId: string): boolean {
    return this.selectedNodes().has(nodeId);
  }

  isNodeLoading(nodeId: string): boolean {
    return this.loadingNodes().has(nodeId);
  }

  onNodeExpand(node: TreeNode) {
    const expanded = new Set(this.expandedNodes());
    
    if (expanded.has(node.id)) {
      expanded.delete(node.id);
    } else {
      expanded.add(node.id);
      
      // Simulate loading state for nodes with children
      if (node.children?.length) {
        const loading = new Set(this.loadingNodes());
        loading.add(node.id);
        this.loadingNodes.set(loading);
        
        // Remove loading state after a delay
        setTimeout(() => {
          const currentLoading = new Set(this.loadingNodes());
          currentLoading.delete(node.id);
          this.loadingNodes.set(currentLoading);
        }, 500);
      }
    }
    
    this.expandedNodes.set(expanded);
    this.expand.emit(node.id);
  }

  onToggleSelection(nodeId: string) {
    const selected = new Set(this.selectedNodes());
    
    if (selected.has(nodeId)) {
      selected.delete(nodeId);
    } else {
      selected.add(nodeId);
    }
    
    this.selectedNodes.set(selected);
  }

  onMenuAction(action: MenuAction) {
    this.menuAction.emit(action);
  }
}
