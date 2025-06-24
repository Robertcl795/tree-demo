import { Component, input, output, signal, computed, OnInit } from '@angular/core';
import { TreeNode, TreeConfig, MenuAction, SelectionState } from '../../models/vault.model';
import { TreeItemComponent } from '../tree-item/tree-item.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

interface FlattenedNode extends TreeNode {
  depth: number;
}

@Component({
  selector: 'app-tree-explorer',
  standalone: true,
  imports: [
    CommonModule,
    TreeItemComponent,
    MatProgressBarModule
  ],
  templateUrl: './tree-explorer.component.html',
  styleUrl: './tree-explorer.component.scss'
})
export class TreeExplorerComponent implements OnInit {
  // Inputs using new Angular signal inputs
  rootData = input.required<TreeNode[]>();
  config = input.required<TreeConfig>();
  globalLoading = input<boolean>(false);

  // Outputs
  expand = output<string>();
  menuAction = output<MenuAction>();
  selectionChange = output<string[]>(); // Emits IDs of all selected nodes

  // Internal state
  private expandedNodes = signal<Set<string>>(new Set());
  private selectedNodes = signal<Set<string>>(new Set());
  private loadingNodes = signal<Set<string>>(new Set());
  private nodeSelectionState = signal<Map<string, SelectionState>>(new Map());

  // Computed properties
  flattenedNodes = computed(() => {
    return this.flattenTree(this.rootData(), 0);
  });

  ngOnInit() {
    // Initialize with preselected nodes if specified in config
    if (this.config().preselectedNodes?.length) {
      const preselected = new Set(this.config().preselectedNodes);
      this.selectedNodes.set(preselected);
      
      // Update parent nodes selection state based on children
      this.updateAllNodesSelectionState();
    }
  }

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

  getNodeSelectionState(nodeId: string): SelectionState {
    return this.nodeSelectionState().get(nodeId) || SelectionState.UNSELECTED;
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
    const currentNode = this.findNodeById(nodeId, this.rootData());
    
    if (!currentNode) return;
    
    const isCurrentlySelected = selected.has(nodeId);
    
    if (isCurrentlySelected) {
      // Deselect the node and all its children
      this.deselectNodeAndChildren(currentNode, selected);
    } else {
      // Select the node and all its children
      this.selectNodeAndChildren(currentNode, selected);
    }
    
    this.selectedNodes.set(selected);
    
    // Update parent nodes to reflect children's selection state
    this.updateAllNodesSelectionState();
    
    // Emit the selection change event with all selected node IDs
    this.selectionChange.emit(Array.from(selected));
  }
  
  private selectNodeAndChildren(node: TreeNode, selectedSet: Set<string>) {
    selectedSet.add(node.id);
    
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        this.selectNodeAndChildren(child, selectedSet);
      }
    }
  }
  
  private deselectNodeAndChildren(node: TreeNode, selectedSet: Set<string>) {
    selectedSet.delete(node.id);
    
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        this.deselectNodeAndChildren(child, selectedSet);
      }
    }
  }
  
  private findNodeById(nodeId: string, nodes: TreeNode[]): TreeNode | null {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node;
      }
      
      if (node.children && node.children.length > 0) {
        const foundInChildren = this.findNodeById(nodeId, node.children);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }
    
    return null;
  }
  
  private getNodeParentMap(nodes: TreeNode[], parentId?: string): Map<string, string> {
    const parentMap = new Map<string, string>();
    
    for (const node of nodes) {
      if (parentId) {
        parentMap.set(node.id, parentId);
      }
      
      if (node.children && node.children.length > 0) {
        // Add parent-child relationships for this node's children
        const childrenMap = this.getNodeParentMap(node.children, node.id);
        // Merge the maps
        for (const [childId, parentId] of childrenMap.entries()) {
          parentMap.set(childId, parentId);
        }
      }
    }
    
    return parentMap;
  }
  
  private getAllParentIds(nodeId: string, parentMap: Map<string, string>): string[] {
    const parents: string[] = [];
    let currentId = nodeId;
    
    while (parentMap.has(currentId)) {
      const parentId = parentMap.get(currentId)!;
      parents.push(parentId);
      currentId = parentId;
    }
    
    return parents;
  }
  
  private updateAllNodesSelectionState() {
    const selectedSet = this.selectedNodes();
    const parentMap = this.getNodeParentMap(this.rootData());
    const selectionStateMap = new Map<string, SelectionState>();
    
    // First, set all selected nodes to SELECTED
    for (const nodeId of selectedSet) {
      selectionStateMap.set(nodeId, SelectionState.SELECTED);
    }
    
    // Then, go through all nodes to determine parent states
    this.updateParentSelectionStates(this.rootData(), selectedSet, selectionStateMap);
    
    this.nodeSelectionState.set(selectionStateMap);
  }
  
  private updateParentSelectionStates(
    nodes: TreeNode[],
    selectedSet: Set<string>,
    selectionStateMap: Map<string, SelectionState>
  ) {
    // Build a map of parents to their children
    const parentToChildrenMap = new Map<string, TreeNode[]>();
    
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        parentToChildrenMap.set(node.id, node.children);
        
        // Recursively process children
        this.updateParentSelectionStates(node.children, selectedSet, selectionStateMap);
        
        // Calculate this parent's selection state based on its children
        const allChildren = node.children.length;
        let selectedChildren = 0;
        let partialChildren = 0;
        
        for (const child of node.children) {
          const childState = selectionStateMap.get(child.id) || SelectionState.UNSELECTED;
          
          if (childState === SelectionState.SELECTED) {
            selectedChildren++;
          } else if (childState === SelectionState.PARTIAL) {
            partialChildren++;
          }
        }
        
        // Set parent state based on children
        if (selectedChildren === allChildren) {
          // All children selected means parent is fully selected
          selectionStateMap.set(node.id, SelectionState.SELECTED);
          if (!selectedSet.has(node.id)) {
            selectedSet.add(node.id);
          }
        } else if (selectedChildren > 0 || partialChildren > 0) {
          // Some children selected means parent is partially selected
          selectionStateMap.set(node.id, SelectionState.PARTIAL);
        } else {
          // No children selected means parent is unselected
          selectionStateMap.set(node.id, SelectionState.UNSELECTED);
          selectedSet.delete(node.id);
        }
      } else if (!selectionStateMap.has(node.id)) {
        // Leaf nodes that aren't in the map yet are unselected
        selectionStateMap.set(node.id, SelectionState.UNSELECTED);
      }
    }
  }

  onMenuAction(action: MenuAction) {
    this.menuAction.emit(action);
  }
}
