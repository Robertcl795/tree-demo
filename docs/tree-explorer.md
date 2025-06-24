# Tree Explorer Component Documentation

## Overview

The Tree Explorer is a reusable Angular component that provides a hierarchical view of data with advanced selection capabilities. It is built using Angular 20 and Angular Material, leveraging signals for state management and providing a modern, responsive user interface.

## Key Features

- **Hierarchical Data Display**: Efficiently renders tree structures of any depth
- **Partial Selection States**: Parent nodes show indeterminate state when only some children are selected
- **Preselected Nodes**: Support for loading trees with items already selected
- **Contextual Menus**: Three-dot menu with customizable actions for each node
- **Dynamic Loading**: Support for asynchronously loading child nodes
- **Customizable Icons**: Different node types can display different icons
- **Configurable Selection Rules**: Control which types of nodes can be selected

## Component Architecture

The Tree Explorer consists of two main components:

1. **TreeExplorerComponent**: Container component that manages the tree structure and selection states
2. **TreeItemComponent**: Individual node component with selection and expansion capabilities

### Component Relationships

```
TreeExplorerComponent
└── TreeItemComponent (multiple instances)
```

## Data Models

### TreeNode

```typescript
export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  children?: TreeNode[];
  parentId?: string;
  selectionState?: SelectionState; // Runtime calculation
}
```

### TreeConfig

```typescript
export interface TreeConfig {
  childrenProperty: string;
  labelProperty: string;
  iconProperty: string;
  selectableTypes?: NodeType[];
  disabledTypes?: {
    type: NodeType;
    reason: string;
  }[];
  preselectedNodes?: string[]; // IDs of nodes that should be preselected
}
```

### SelectionState Enum

```typescript
export enum SelectionState {
  UNSELECTED = 'unselected',
  SELECTED = 'selected',
  PARTIAL = 'partial'
}
```

## Usage Examples

### Basic Usage

```html
<app-tree-explorer
  [rootData]="treeData"
  [config]="treeConfig"
  [globalLoading]="isLoading"
  (expand)="onNodeExpand($event)"
  (menuAction)="onMenuAction($event)"
  (selectionChange)="onSelectionChange($event)"
></app-tree-explorer>
```

### Configuration Example

```typescript
const treeConfig: TreeConfig = {
  childrenProperty: 'children',
  labelProperty: 'name',
  iconProperty: 'type',
  selectableTypes: [
    NodeType.FILE, 
    NodeType.DOCUMENT
  ],
  disabledTypes: [
    {
      type: NodeType.EXECUTABLE,
      reason: 'Executable files cannot be selected for security reasons'
    }
  ],
  preselectedNodes: ['node-1', 'node-2'] // Optional
};
```

## Key Implementation Details

### Partial Selection State

The tree implements an indeterminate checkbox state for parent nodes when only some of their children are selected. This is calculated by:

1. Tracking selection for all nodes in a Set
2. Updating parent selection states recursively
3. Using a SelectionState enum to represent three possible states:
   - `SELECTED`: All children are selected
   - `UNSELECTED`: No children are selected
   - `PARTIAL`: Some but not all children are selected

### Preselection Support

The component supports loading a tree with pre-selected nodes by:

1. Accepting a list of node IDs in the configuration
2. Setting these nodes as selected when the component initializes
3. Recursively updating parent states to reflect child selection

## Event Handling

### Available Events

- **expand**: Emitted when a node is expanded/collapsed
- **menuAction**: Emitted when a menu item is clicked
- **selectionChange**: Emitted when the selection state changes

### Event Structures

```typescript
// For menuAction event
export interface MenuAction {
  nodeId: string;
  action: string;
}
```

## Styling

The component uses Angular Material for styling and icons. Custom styles provide hover effects, proper spacing, and a clean UI.

Key style features:
- Hover highlighting
- Proper indentation based on nesting level
- Show/hide of the context menu on hover
- Loading indicator for asynchronous operations

## Testing Guide

For thorough testing, verify:

1. **Selection Behavior**:
   - Select/deselect individual nodes
   - Select parent should select all children
   - Deselect parent should deselect all children
   - Child selection should update parent state

2. **Preselection**:
   - Load with preselected nodes
   - Ensure parent nodes show correct state

3. **Edge Cases**:
   - Very deep trees (5+ levels)
   - Trees with many nodes at same level
   - Empty trees or empty folders

## Performance Considerations

- Tree rendering uses Angular's `@for` with `track` for efficient updates
- Selection state uses computed signals for minimal re-rendering
- Large trees should implement virtual scrolling (future enhancement)

## Accessibility

- Proper ARIA attributes for interactive elements
- Keyboard navigation support
- High contrast visual indicators

## Future Enhancements

- Virtual scrolling for large trees
- Drag and drop support
- Search/filter capabilities
- Context-specific actions based on node type
