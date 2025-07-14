import { 
  Component, 
  input, 
  output, 
  signal, 
  computed, 
  OnInit, 
  effect,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { TreeItemComponent } from './tree-item.component';
import { TreeUtils } from '../utils/tree.utils';
import { 
  TreeNode, 
  TreeConfig, 
  MenuAction, 
  SelectionState, 
  TreeEvents,
  FlattenedNode,
  TreeState
} from '../types/tree.types';

@Component({
  selector: 'tree-explorer',
  standalone: true,
  imports: [
    CommonModule,
    TreeItemComponent,
    MatProgressBarModule
  ],
  template: `
    @if (globalLoading()) {
      <div class="global-loading">
        <mat-progress-bar
          mode="indeterminate"
          [style.opacity]="0.7"
        ></mat-progress-bar>
      </div>
    }

    <div class="tree-container"
         [class.loading]="globalLoading()"
         role="tree"
         [attr.aria-label]="ariaLabel()">
      
      @if (filteredNodes().length === 0) {
        <div class="empty-state">
          <ng-content select="[slot=empty]">
            <p>No items to display</p>
          </ng-content>
        </div>
      } @else {
        @for (flatNode of filteredNodes(); track flatNode.id) {
          <tree-item
            [node]="flatNode"
            [depth]="flatNode.depth"
            [isExpanded]="isNodeExpanded(flatNode.id)"
            [selectionState]="getNodeSelectionState(flatNode.id)"
            [isLoading]="isNodeLoading(flatNode.id)"
            [config]="config()"
            (expand)="onNodeExpand(flatNode)"
            (toggleSelection)="onToggleSelection(flatNode.id)"
            (menuAction)="onMenuAction($event)"
            (nodeClick)="onNodeClick(flatNode, $event)"
            (nodeDoubleClick)="onNodeDoubleClick(flatNode, $event)"
            role="treeitem"
            [attr.aria-expanded]="hasChildren(flatNode) ? isNodeExpanded(flatNode.id) : null"
            [attr.aria-selected]="isNodeSelected(flatNode.id)"
            [attr.aria-level]="flatNode.depth + 1"
          >
            <!-- Allow custom content projection -->
            <ng-content select="[slot=node-content]"></ng-content>
            <ng-content select="[slot=node-actions]"></ng-content>
          </tree-item>
        }
      }
    </div>

    <!-- Custom loading template projection -->
    <ng-content select="[slot=loading]"></ng-content>
  `,
  styles: [`
    .tree-container {
      position: relative;
      overflow-y: auto;
      max-height: 100%;
    }

    .tree-container.loading {
      opacity: 0.6;
      pointer-events: none;
    }

    .global-loading {
      margin-bottom: 16px;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      color: rgba(0, 0, 0, 0.6);
      font-style: italic;
    }

    tree-item {
      display: block;
    }
  `]
})
export class TreeExplorerComponent<T = any> implements OnInit {
  // Inputs using Angular signal inputs
  rootData = input.required<TreeNode<T>[]>();
  config = input.required<TreeConfig<T>>();
  globalLoading = input<boolean>(false);
  ariaLabel = input<string>('Tree Explorer');
  searchTerm = input<string>('');
  
  // Computed property for data (for backward compatibility)
  data = computed(() => this.rootData());
  
  // Events input for better type safety
  events = input<TreeEvents<T>>({});

  // Outputs
  expand = output<{ nodeId: string; node: TreeNode<T> }>();
  collapse = output<{ nodeId: string; node: TreeNode<T> }>();
  selectionChange = output<{ selectedIds: string[]; selectedNodes: TreeNode<T>[] }>();
  menuAction = output<{ action: MenuAction; node: TreeNode<T> }>();
  nodeClick = output<{ node: TreeNode<T>; event: Event }>();
  nodeDoubleClick = output<{ node: TreeNode<T>; event: Event }>();

  // Internal state signals
  private treeState = signal<TreeState>({
    expandedNodes: new Set<string>(),
    selectedNodes: new Set<string>(),
    loadingNodes: new Set<string>(),
    nodeSelectionState: new Map<string, SelectionState>()
  });

  // Computed properties
  flattenedNodes = computed(() => {
    const nodes = this.data();
    const state = this.treeState();
    return TreeUtils.flattenTree(nodes, 0, state.expandedNodes);
  });

  filteredNodes = computed(() => {
    const nodes = this.flattenedNodes();
    const searchTerm = this.searchTerm().trim();
    
    if (!searchTerm) {
      return nodes;
    }

    const config = this.config();
    const searchProperty = config.labelProperty;
    
    // Filter nodes that match the search term or have matching descendants
    return nodes.filter(node => {
      const value = (node as any)[searchProperty];
      return typeof value === 'string' && 
             value.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  constructor() {
    // React to configuration changes
    effect(() => {
      const config = this.config();
      if (config.preselectedNodes?.length) {
        this.initializePreselectedNodes(config.preselectedNodes);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    // Validate tree structure
    if (!TreeUtils.validateTreeStructure(this.data())) {
      console.warn('Tree structure contains circular references');
    }
  }

  // Public API methods
  
  /**
   * Expands a node by ID
   */
  expandNode(nodeId: string): void {
    const state = this.treeState();
    const newExpanded = new Set(state.expandedNodes);
    newExpanded.add(nodeId);
    
    this.treeState.update(current => ({
      ...current,
      expandedNodes: newExpanded
    }));
  }

  /**
   * Collapses a node by ID
   */
  collapseNode(nodeId: string): void {
    const state = this.treeState();
    const newExpanded = new Set(state.expandedNodes);
    newExpanded.delete(nodeId);
    
    this.treeState.update(current => ({
      ...current,
      expandedNodes: newExpanded
    }));
  }

  /**
   * Expands all nodes
   */
  expandAll(): void {
    const allNodeIds = this.getAllNodeIds(this.data());
    this.treeState.update(current => ({
      ...current,
      expandedNodes: new Set(allNodeIds)
    }));
  }

  /**
   * Collapses all nodes
   */
  collapseAll(): void {
    this.treeState.update(current => ({
      ...current,
      expandedNodes: new Set()
    }));
  }

  /**
   * Selects nodes by IDs
   */
  selectNodes(nodeIds: string[]): void {
    const state = this.treeState();
    const newSelected = new Set(state.selectedNodes);
    
    nodeIds.forEach(id => newSelected.add(id));
    
    this.treeState.update(current => ({
      ...current,
      selectedNodes: newSelected
    }));
    
    this.updateAllNodesSelectionState();
  }

  /**
   * Deselects nodes by IDs
   */
  deselectNodes(nodeIds: string[]): void {
    const state = this.treeState();
    const newSelected = new Set(state.selectedNodes);
    
    nodeIds.forEach(id => newSelected.delete(id));
    
    this.treeState.update(current => ({
      ...current,
      selectedNodes: newSelected
    }));
    
    this.updateAllNodesSelectionState();
  }

  /**
   * Clears all selections
   */
  clearSelection(): void {
    this.treeState.update(current => ({
      ...current,
      selectedNodes: new Set(),
      nodeSelectionState: new Map()
    }));
    
    this.emitSelectionChange();
  }

  /**
   * Gets selected node IDs
   */
  getSelectedNodeIds(): string[] {
    return Array.from(this.treeState().selectedNodes);
  }

  /**
   * Gets selected nodes
   */
  getSelectedNodes(): TreeNode<T>[] {
    const selectedIds = this.getSelectedNodeIds();
    return selectedIds
      .map(id => TreeUtils.findNodeById(id, this.data()))
      .filter((node): node is TreeNode<T> => node !== null);
  }

  // Internal helper methods

  isNodeExpanded(nodeId: string): boolean {
    return this.treeState().expandedNodes.has(nodeId);
  }

  isNodeSelected(nodeId: string): boolean {
    return this.treeState().selectedNodes.has(nodeId);
  }

  isNodeLoading(nodeId: string): boolean {
    return this.treeState().loadingNodes.has(nodeId);
  }

  getNodeSelectionState(nodeId: string): SelectionState {
    return this.treeState().nodeSelectionState.get(nodeId) || SelectionState.UNSELECTED;
  }

  hasChildren(node: TreeNode<T>): boolean {
    return Boolean(node.children?.length);
  }

  // Event handlers

  onNodeExpand(node: TreeNode<T>) {
    const isCurrentlyExpanded = this.isNodeExpanded(node.id);
    
    if (isCurrentlyExpanded) {
      this.collapseNode(node.id);
      this.collapse.emit({ nodeId: node.id, node });
      this.events().collapse?.(node.id, node);
    } else {
      this.expandNode(node.id);
      this.handleLoadingState(node);
      this.expand.emit({ nodeId: node.id, node });
      this.events().expand?.(node.id, node);
    }
  }

  onToggleSelection(nodeId: string) {
    const node = TreeUtils.findNodeById(nodeId, this.data());
    if (!node) return;
    
    const state = this.treeState();
    const selected = new Set(state.selectedNodes);
    const isCurrentlySelected = selected.has(nodeId);
    
    if (isCurrentlySelected) {
      TreeUtils.deselectNodeAndDescendants(node, selected);
    } else {
      TreeUtils.selectNodeAndDescendants(node, selected);
    }
    
    this.treeState.update(current => ({
      ...current,
      selectedNodes: selected
    }));
    
    this.updateAllNodesSelectionState();
    this.emitSelectionChange();
  }

  onMenuAction(action: MenuAction) {
    const node = TreeUtils.findNodeById(action.nodeId, this.data());
    if (node) {
      this.menuAction.emit({ action, node });
      this.events().menuAction?.(action, node);
    }
  }

  onNodeClick(node: TreeNode<T>, event: Event) {
    this.nodeClick.emit({ node, event });
    this.events().nodeClick?.(node, event);
  }

  onNodeDoubleClick(node: TreeNode<T>, event: Event) {
    this.nodeDoubleClick.emit({ node, event });
    this.events().nodeDoubleClick?.(node, event);
  }

  // Private helper methods

  private initializePreselectedNodes(preselectedIds: string[]): void {
    const newSelected = new Set(preselectedIds);
    
    this.treeState.update(current => ({
      ...current,
      selectedNodes: newSelected
    }));
    
    this.updateAllNodesSelectionState();
  }

  private handleLoadingState(node: TreeNode<T>): void {
    const config = this.config();
    const loadingBehavior = config.loadingBehavior;
    
    if (loadingBehavior?.showOnExpand !== false && this.hasChildren(node)) {
      const state = this.treeState();
      const loading = new Set(state.loadingNodes);
      loading.add(node.id);
      
      this.treeState.update(current => ({
        ...current,
        loadingNodes: loading
      }));
      
      // Remove loading state after duration
      const duration = loadingBehavior?.duration || 1000;
      setTimeout(() => {
        this.treeState.update(current => {
          const newLoading = new Set(current.loadingNodes);
          newLoading.delete(node.id);
          return {
            ...current,
            loadingNodes: newLoading
          };
        });
      }, duration);
    }
  }

  private updateAllNodesSelectionState(): void {
    const state = this.treeState();
    const selectedSet = new Set(state.selectedNodes);
    const selectionStateMap = new Map<string, SelectionState>();
    
    // Set selected nodes to SELECTED state
    for (const nodeId of selectedSet) {
      selectionStateMap.set(nodeId, SelectionState.SELECTED);
    }
    
    // Update parent selection states
    TreeUtils.updateParentSelectionStates(this.data(), selectedSet, selectionStateMap);
    
    this.treeState.update(current => ({
      ...current,
      selectedNodes: selectedSet,
      nodeSelectionState: selectionStateMap
    }));
  }

  private emitSelectionChange(): void {
    const selectedIds = this.getSelectedNodeIds();
    const selectedNodes = this.getSelectedNodes();
    
    this.selectionChange.emit({ selectedIds, selectedNodes });
    this.events().selectionChange?.(selectedIds, selectedNodes);
  }

  private getAllNodeIds(nodes: TreeNode<T>[]): string[] {
    const ids: string[] = [];
    
    for (const node of nodes) {
      ids.push(node.id);
      if (node.children?.length) {
        ids.push(...this.getAllNodeIds(node.children));
      }
    }
    
    return ids;
  }
}
