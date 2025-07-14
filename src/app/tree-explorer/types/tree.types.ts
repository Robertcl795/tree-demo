/**
 * Generic tree node interface that can be extended for specific use cases
 */
export interface TreeNode<T = any> {
  id: string;
  children?: TreeNode<T>[];
  parentId?: string;
  [key: string]: any;
}

/**
 * Configuration interface for the tree explorer component
 */
export interface TreeConfig<T = any> {
  /** Property name to use for node labels */
  labelProperty: keyof T;
  /** Property name to use for node icons */
  iconProperty?: keyof T;
  /** Property name to use for children */
  childrenProperty?: keyof T;
  /** Function to get icon for a node */
  iconResolver?: (node: TreeNode<T>) => string;
  /** Types that can be selected */
  selectableTypes?: any[];
  /** Types that are disabled with reasons */
  disabledTypes?: DisabledType<T>[];
  /** IDs of nodes that should be preselected */
  preselectedNodes?: string[];
  /** Show checkboxes for selection */
  showCheckboxes?: boolean;
  /** Show context menu */
  showContextMenu?: boolean;
  /** Context menu items */
  contextMenuItems?: ContextMenuItem[];
  /** Custom loading behavior */
  loadingBehavior?: LoadingBehavior;
}

/**
 * Disabled type configuration
 */
export interface DisabledType<T = any> {
  type: any;
  reason: string;
  matcher?: (node: TreeNode<T>) => boolean;
}

/**
 * Context menu item interface
 */
export interface ContextMenuItem {
  id: string;
  action: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
}

/**
 * Loading behavior configuration
 */
export interface LoadingBehavior {
  /** Show loading indicator on expand */
  showOnExpand?: boolean;
  /** Loading duration in milliseconds */
  duration?: number;
  /** Custom loading template */
  template?: any;
}

/**
 * Selection state enum
 */
export enum SelectionState {
  UNSELECTED = 'unselected',
  SELECTED = 'selected',
  PARTIAL = 'partial'
}

/**
 * Menu action interface
 */
export interface MenuAction {
  nodeId: string;
  action: string;
  data?: any;
}

/**
 * Tree events interface
 */
export interface TreeEvents<T = any> {
  /** Node expansion event */
  expand?: (nodeId: string, node: TreeNode<T>) => void;
  /** Node collapse event */
  collapse?: (nodeId: string, node: TreeNode<T>) => void;
  /** Selection change event */
  selectionChange?: (selectedIds: string[], selectedNodes: TreeNode<T>[]) => void;
  /** Menu action event */
  menuAction?: (action: MenuAction, node: TreeNode<T>) => void;
  /** Node click event */
  nodeClick?: (node: TreeNode<T>, event: Event) => void;
  /** Node double click event */
  nodeDoubleClick?: (node: TreeNode<T>, event: Event) => void;
}

/**
 * Flattened node interface for internal use
 */
export interface FlattenedNode<T = any> extends TreeNode<T> {
  depth: number;
  isExpanded?: boolean;
  selectionState?: SelectionState;
  isLoading?: boolean;
}

/**
 * Tree state interface
 */
export interface TreeState {
  expandedNodes: Set<string>;
  selectedNodes: Set<string>;
  loadingNodes: Set<string>;
  nodeSelectionState: Map<string, SelectionState>;
}
