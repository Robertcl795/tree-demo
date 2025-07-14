import { Injectable, signal, computed } from '@angular/core';
import { TreeNode, SelectionState, TreeState } from '../types/tree.types';
import { TreeUtils } from '../utils/tree.utils';

/**
 * Service for managing tree state outside of component
 * Useful for complex applications that need shared tree state
 */
@Injectable({
  providedIn: 'root'
})
export class TreeStateService<T = any> {
  private _state = signal<TreeState>({
    expandedNodes: new Set<string>(),
    selectedNodes: new Set<string>(),
    loadingNodes: new Set<string>(),
    nodeSelectionState: new Map<string, SelectionState>()
  });

  // Computed properties for reactive access
  expandedNodes = computed(() => this._state().expandedNodes);
  selectedNodes = computed(() => this._state().selectedNodes);
  loadingNodes = computed(() => this._state().loadingNodes);
  nodeSelectionState = computed(() => this._state().nodeSelectionState);

  /**
   * Expands a node
   */
  expandNode(nodeId: string): void {
    this._state.update(current => ({
      ...current,
      expandedNodes: new Set([...current.expandedNodes, nodeId])
    }));
  }

  /**
   * Collapses a node
   */
  collapseNode(nodeId: string): void {
    this._state.update(current => {
      const newExpanded = new Set(current.expandedNodes);
      newExpanded.delete(nodeId);
      return {
        ...current,
        expandedNodes: newExpanded
      };
    });
  }

  /**
   * Toggles node expansion
   */
  toggleNodeExpansion(nodeId: string): boolean {
    const isExpanded = this.isNodeExpanded(nodeId);
    if (isExpanded) {
      this.collapseNode(nodeId);
    } else {
      this.expandNode(nodeId);
    }
    return !isExpanded;
  }

  /**
   * Expands all nodes
   */
  expandAll(allNodeIds: string[]): void {
    this._state.update(current => ({
      ...current,
      expandedNodes: new Set(allNodeIds)
    }));
  }

  /**
   * Collapses all nodes
   */
  collapseAll(): void {
    this._state.update(current => ({
      ...current,
      expandedNodes: new Set()
    }));
  }

  /**
   * Selects a node and its descendants
   */
  selectNodeWithDescendants(node: TreeNode<T>): void {
    this._state.update(current => {
      const newSelected = new Set(current.selectedNodes);
      TreeUtils.selectNodeAndDescendants(node, newSelected);
      return {
        ...current,
        selectedNodes: newSelected
      };
    });
  }

  /**
   * Deselects a node and its descendants
   */
  deselectNodeWithDescendants(node: TreeNode<T>): void {
    this._state.update(current => {
      const newSelected = new Set(current.selectedNodes);
      TreeUtils.deselectNodeAndDescendants(node, newSelected);
      return {
        ...current,
        selectedNodes: newSelected
      };
    });
  }

  /**
   * Toggles node selection
   */
  toggleNodeSelection(node: TreeNode<T>): boolean {
    const isSelected = this.isNodeSelected(node.id);
    if (isSelected) {
      this.deselectNodeWithDescendants(node);
    } else {
      this.selectNodeWithDescendants(node);
    }
    return !isSelected;
  }

  /**
   * Selects specific nodes by IDs
   */
  selectNodes(nodeIds: string[]): void {
    this._state.update(current => ({
      ...current,
      selectedNodes: new Set([...current.selectedNodes, ...nodeIds])
    }));
  }

  /**
   * Deselects specific nodes by IDs
   */
  deselectNodes(nodeIds: string[]): void {
    this._state.update(current => {
      const newSelected = new Set(current.selectedNodes);
      nodeIds.forEach(id => newSelected.delete(id));
      return {
        ...current,
        selectedNodes: newSelected
      };
    });
  }

  /**
   * Clears all selections
   */
  clearSelection(): void {
    this._state.update(current => ({
      ...current,
      selectedNodes: new Set(),
      nodeSelectionState: new Map()
    }));
  }

  /**
   * Sets loading state for a node
   */
  setNodeLoading(nodeId: string, isLoading: boolean): void {
    this._state.update(current => {
      const newLoading = new Set(current.loadingNodes);
      if (isLoading) {
        newLoading.add(nodeId);
      } else {
        newLoading.delete(nodeId);
      }
      return {
        ...current,
        loadingNodes: newLoading
      };
    });
  }

  /**
   * Updates selection states for all nodes
   */
  updateSelectionStates(rootNodes: TreeNode<T>[]): void {
    this._state.update(current => {
      const selectedSet = new Set(current.selectedNodes);
      const selectionStateMap = new Map<string, SelectionState>();
      
      // Set selected nodes to SELECTED state
      for (const nodeId of selectedSet) {
        selectionStateMap.set(nodeId, SelectionState.SELECTED);
      }
      
      // Update parent selection states
      TreeUtils.updateParentSelectionStates(rootNodes, selectedSet, selectionStateMap);
      
      return {
        ...current,
        selectedNodes: selectedSet,
        nodeSelectionState: selectionStateMap
      };
    });
  }

  /**
   * Resets the entire state
   */
  resetState(): void {
    this._state.set({
      expandedNodes: new Set<string>(),
      selectedNodes: new Set<string>(),
      loadingNodes: new Set<string>(),
      nodeSelectionState: new Map<string, SelectionState>()
    });
  }

  /**
   * Gets the current state snapshot
   */
  getStateSnapshot(): TreeState {
    return {
      expandedNodes: new Set(this._state().expandedNodes),
      selectedNodes: new Set(this._state().selectedNodes),
      loadingNodes: new Set(this._state().loadingNodes),
      nodeSelectionState: new Map(this._state().nodeSelectionState)
    };
  }

  /**
   * Sets the state from a snapshot
   */
  setStateFromSnapshot(snapshot: TreeState): void {
    this._state.set({
      expandedNodes: new Set(snapshot.expandedNodes),
      selectedNodes: new Set(snapshot.selectedNodes),
      loadingNodes: new Set(snapshot.loadingNodes),
      nodeSelectionState: new Map(snapshot.nodeSelectionState)
    });
  }

  // Query methods
  isNodeExpanded(nodeId: string): boolean {
    return this._state().expandedNodes.has(nodeId);
  }

  isNodeSelected(nodeId: string): boolean {
    return this._state().selectedNodes.has(nodeId);
  }

  isNodeLoading(nodeId: string): boolean {
    return this._state().loadingNodes.has(nodeId);
  }

  getNodeSelectionState(nodeId: string): SelectionState {
    return this._state().nodeSelectionState.get(nodeId) || SelectionState.UNSELECTED;
  }

  getSelectedNodeIds(): string[] {
    return Array.from(this._state().selectedNodes);
  }

  getExpandedNodeIds(): string[] {
    return Array.from(this._state().expandedNodes);
  }

  getLoadingNodeIds(): string[] {
    return Array.from(this._state().loadingNodes);
  }
}
