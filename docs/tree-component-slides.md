# Tree Explorer Component
## Angular 20 UI Component for Hierarchical Data

---

## What is Tree Explorer?

A reusable Angular component for displaying hierarchical data with:
- Parent-child relationships
- Advanced selection states
- Contextual actions
- Type-specific icons

---

## Key Features

![Demo Screenshot](https://via.placeholder.com/300x200?text=Demo)

- **Three Selection States**: Selected, Unselected, Partial
- **Selection Propagation**: Parent → Children, Children → Parent  
- **Preselected Nodes**: Load tree with items already selected
- **Dynamic Loading**: Async children loading with loading indicators

---

## Selection States

![Selection States](https://via.placeholder.com/500x250?text=Selection+States)

- **Full Selection**: All child items selected
- **Partial Selection**: Some child items selected
- **No Selection**: No items selected

---

## Component Structure

```
TreeExplorerComponent (container)
└── TreeItemComponent (for each node)
```

- **TreeExplorerComponent**: Manages tree data & selection state
- **TreeItemComponent**: Renders individual nodes

---

## Usage Example

```typescript
<app-tree-explorer
  [rootData]="treeData"
  [config]="treeConfig"
  [globalLoading]="isLoading"
  (expand)="onNodeExpand($event)"
  (menuAction)="onMenuAction($event)"
  (selectionChange)="onSelectionChange($event)"
></app-tree-explorer>
```

---

## Configuration

```typescript
const treeConfig: TreeConfig = {
  childrenProperty: 'children',
  labelProperty: 'name',
  iconProperty: 'type',
  selectableTypes: [
    NodeType.FILE, NodeType.DOCUMENT
  ],
  disabledTypes: [
    {
      type: NodeType.EXECUTABLE,
      reason: 'Security restriction'
    }
  ],
  preselectedNodes: ['node-1', 'node-2']
};
```

---

## Selection Behavior

1. **Select parent** → Select all children
2. **Deselect parent** → Deselect all children  
3. **Select some children** → Parent shows partial state
4. **Select all children** → Parent fully selected

---

## Implementation Highlights

- **Angular Signals**: Reactive state management
- **Computed Properties**: Dynamic UI calculation
- **Recursive Algorithms**: For selection state propagation
- **Material Design**: Modern visual components

---

## Core Models

```typescript
interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  children?: TreeNode[];
  parentId?: string;
}

enum SelectionState {
  UNSELECTED,
  SELECTED,
  PARTIAL
}
```

---

## Key Methods

- **flattenTree()**: Transforms hierarchical data to flat list
- **updateParentSelectionStates()**: Calculates parent states
- **selectNodeAndChildren()**: Recursive selection
- **deselectNodeAndChildren()**: Recursive deselection

---

## Testing Approach

- **Unit Tests**: Selection logic, recursive calculations
- **Component Tests**: User interactions, event emissions
- **Visual Tests**: All selection states, icons, menus
- **Edge Cases**: Deep nesting, large datasets

---

## Where to Find More

- **Documentation**: `/docs/tree-components.md`
- **Test Harness**: `/test` route
- **Implementation Example**: `/vault/:id` route

---

# Thank You!

Questions?
