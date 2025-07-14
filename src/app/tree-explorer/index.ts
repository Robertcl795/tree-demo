// Main public API for the Tree Explorer Library

// Components
export { TreeExplorerComponent } from './components/tree-explorer.component';
export { TreeItemComponent } from './components/tree-item.component';

// Types and Interfaces
export * from './types/tree.types';

// Models (legacy compatibility)
export * from './models';

// Utilities
export { TreeUtils } from './utils/tree.utils';

// Services
export { TreeStateService } from './services/tree-state.service';

// Version
export const TREE_EXPLORER_VERSION = '1.0.0';

// Default exports for convenience
export { TreeExplorerComponent as TreeExplorer } from './components/tree-explorer.component';
export { TreeItemComponent as TreeItem } from './components/tree-item.component';
