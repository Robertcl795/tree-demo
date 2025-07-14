# Tree Explorer Library

A comprehensive, type-safe Angular tree component library built with Angular Signals and modern Angular features.

## Features

- 🌳 **Generic Tree Structure**: Fully typed generic support for any data structure
- ⚡ **Angular Signals**: Built with the latest Angular Signals for optimal performance
- 🎨 **Material Design**: Integrated with Angular Material components
- 🔍 **Search & Filter**: Built-in search functionality
- ✅ **Multi-Selection**: Hierarchical selection with partial states
- 📱 **Accessibility**: ARIA support and keyboard navigation
- 🎯 **Extensible**: Custom templates, icons, and menu items
- 🚀 **Standalone Components**: Ready for modern Angular applications
- 📦 **Easy to Import**: Designed as a portable library

## Installation

```typescript
// Import the tree explorer components and types
import { 
  TreeExplorerComponent, 
  TreeNode, 
  TreeConfig,
  createDefaultTreeConfig 
} from './tree-explorer';
```

## Quick Start

### Basic Usage

```typescript
import { Component, signal } from '@angular/core';
import { TreeExplorerComponent, TreeNode, TreeConfig } from './tree-explorer';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TreeExplorerComponent],
  template: `
    <tree-explorer
      [rootData]="treeData()"
      [config]="treeConfig()"
      (selectionChange)="onSelectionChange($event)"
      (menuAction)="onMenuAction($event)"
    />
  `
})
export class ExampleComponent {
  treeData = signal<TreeNode[]>([
    {
      id: '1',
      name: 'Root Folder',
      type: 'folder',
      children: [
        {
          id: '2',
          name: 'Document.pdf',
          type: 'document'
        },
        {
          id: '3',
          name: 'Subfolder',
          type: 'folder',
          children: [
            {
              id: '4',
              name: 'Image.jpg',
              type: 'image'
            }
          ]
        }
      ]
    }
  ]);

  treeConfig = signal<TreeConfig>({
    labelProperty: 'name',
    iconProperty: 'type',
    showCheckboxes: true,
    showContextMenu: true
  });

  onSelectionChange(event: { selectedIds: string[], selectedNodes: TreeNode[] }) {
    console.log('Selected nodes:', event.selectedNodes);
  }

  onMenuAction(event: { action: any, node: TreeNode }) {
    console.log('Menu action:', event.action, 'on node:', event.node);
  }
}
```

### Advanced Configuration

```typescript
import { createDefaultTreeConfig, NodeType } from './tree-explorer';

const advancedConfig = createDefaultTreeConfig({
  labelProperty: 'displayName',
  iconResolver: (node) => {
    if (node.isSpecial) return 'star';
    return node.type === 'folder' ? 'folder' : 'description';
  },
  selectableTypes: [NodeType.FILE, NodeType.DOCUMENT],
  disabledTypes: [
    {
      type: NodeType.FOLDER,
      reason: 'Folders cannot be selected',
      matcher: (node) => node.type === 'folder' && node.locked
    }
  ],
  contextMenuItems: [
    { id: 'download', label: 'Download', icon: 'download', action: 'download' },
    { id: 'share', label: 'Share', icon: 'share', action: 'share' },
    { id: 'separator', separator: true },
    { id: 'delete', label: 'Delete', icon: 'delete', action: 'delete' }
  ],
  loadingBehavior: {
    showOnExpand: true,
    duration: 500
  }
});
```

## API Reference

### TreeExplorerComponent

#### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rootData` | `TreeNode<T>[]` | **required** | The root nodes of the tree |
| `config` | `TreeConfig<T>` | **required** | Configuration options |
| `globalLoading` | `boolean` | `false` | Show global loading indicator |
| `ariaLabel` | `string` | `'Tree Explorer'` | ARIA label for accessibility |
| `searchTerm` | `string` | `''` | Filter nodes by search term |

#### Outputs

| Event | Type | Description |
|-------|------|-------------|
| `expand` | `{ nodeId: string, node: TreeNode }` | Node expansion event |
| `collapse` | `{ nodeId: string, node: TreeNode }` | Node collapse event |
| `selectionChange` | `{ selectedIds: string[], selectedNodes: TreeNode[] }` | Selection change event |
| `menuAction` | `{ action: MenuAction, node: TreeNode }` | Menu action event |
| `nodeClick` | `{ node: TreeNode, event: Event }` | Node click event |
| `nodeDoubleClick` | `{ node: TreeNode, event: Event }` | Node double-click event |

#### Public Methods

```typescript
// Programmatic control
expandAll(): void
collapseAll(): void
expandNode(nodeId: string): void
collapseNode(nodeId: string): void
selectNodes(nodeIds: string[]): void
deselectNodes(nodeIds: string[]): void
clearSelection(): void
getSelectedNodeIds(): string[]
getSelectedNodes(): TreeNode[]
```

### TreeConfig Interface

```typescript
interface TreeConfig<T = any> {
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
```

### TreeNode Interface

```typescript
interface TreeNode<T = any> {
  id: string;
  children?: TreeNode<T>[];
  parentId?: string;
  [key: string]: any;
}
```

## Advanced Features

### Custom Content Projection

```html
<tree-explorer [rootData]="data" [config]="config">
  <!-- Custom empty state -->
  <div slot="empty">
    <h3>No files found</h3>
    <button mat-button>Add Files</button>
  </div>
  
  <!-- Custom loading indicator -->
  <div slot="loading">
    <mat-spinner diameter="20"></mat-spinner>
    <span>Loading tree data...</span>
  </div>
  
  <!-- Custom node content -->
  <div slot="node-content">
    <span class="file-size">{{ node.size | fileSize }}</span>
  </div>
  
  <!-- Custom node actions -->
  <div slot="node-actions">
    <button mat-icon-button (click)="downloadFile(node)">
      <mat-icon>download</mat-icon>
    </button>
  </div>
</tree-explorer>
```

### Using TreeStateService

For complex applications that need shared tree state:

```typescript
import { TreeStateService } from './tree-explorer';

@Component({
  // ...
})
export class MultiTreeComponent {
  constructor(private treeState: TreeStateService) {}

  synchronizeTrees() {
    // Share state between multiple tree instances
    const snapshot = this.treeState.getStateSnapshot();
    // Apply to another tree or save to localStorage
  }
}
```

### Search and Filtering

```typescript
@Component({
  template: `
    <mat-form-field>
      <input matInput 
             placeholder="Search..."
             [(ngModel)]="searchTerm"
             (input)="updateSearch()">
    </mat-form-field>
    
    <tree-explorer
      [rootData]="data"
      [config]="config"
      [searchTerm]="searchTerm"
    />
  `
})
export class SearchableTreeComponent {
  searchTerm = '';
  
  updateSearch() {
    // Search is handled automatically by the component
    // You can also implement custom filtering logic here
  }
}
```

## Migration Guide

### From Legacy TreeExplorerComponent

The new tree explorer is designed to be backward compatible:

```typescript
// Old usage
import { TreeExplorerComponent } from '../components/tree-explorer/tree-explorer.component';

// New usage
import { TreeExplorerComponent } from './tree-explorer';

// Update template binding
// Old: [rootData]="data"
// New: [rootData]="data" (same)

// Update config property names if needed
// Most properties remain the same for compatibility
```

### Key Changes

1. **Generic Support**: Add type parameters for better type safety
2. **Signal-based**: Inputs use Angular Signals
3. **Enhanced Events**: More detailed event objects
4. **Accessibility**: Better ARIA support
5. **Customization**: More slots for content projection

## Best Practices

1. **Type Safety**: Always use generic types for better development experience
2. **Performance**: Use `trackBy` functions for large datasets
3. **Accessibility**: Provide meaningful `ariaLabel` values
4. **Error Handling**: Validate tree structure with `TreeUtils.validateTreeStructure()`
5. **Memory Management**: Clear selections when component is destroyed

## Examples

See the `tree-test` component for comprehensive examples of all features.

## License

This tree explorer library is part of the tree-demo application.
