# Tree Explorer Component
## Angular 20 UI Component

---

## What is Tree Explorer?

A hierarchical tree component for Angular 20 that:

* Shows data in a tree structure with parent-child relationships
* Provides partial selection state for parent nodes
* Supports pre-loaded selection state 
* Offers contextual actions via menu

---

## Key Features

* **Partial Selection**: Parent shows indeterminate state when some children selected
* **Preselection**: Load tree with items already selected
* **Contextual Actions**: Context menu with custom actions per node
* **Dynamic Loading**: Async loading of child nodes
* **Configurable Selection**: Control which types can be selected

---

## Component Structure

```
TreeExplorerComponent (container)
└── TreeItemComponent (for each node)
```

* **TreeExplorerComponent**: Manages tree data & selection state
* **TreeItemComponent**: Renders individual nodes with selection & expansion

---

## Selection States

![Selection States](https://via.placeholder.com/600x300?text=Selection+State+Diagram)

* **Unselected**: No checkmark
* **Selected**: Full checkmark
* **Partial**: Indeterminate dash

---

## Basic Usage

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

---

## Configuration

```typescript
const treeConfig: TreeConfig = {
  childrenProperty: 'children',
  labelProperty: 'name',
  iconProperty: 'type',
  selectableTypes: [NodeType.FILE, NodeType.DOCUMENT],
  disabledTypes: [
    {
      type: NodeType.EXECUTABLE,
      reason: 'Cannot select executables'
    }
  ],
  preselectedNodes: ['node-1', 'node-2'] // Optional
};
```

---

## Selection Behavior

1. Select parent → Select all children
2. Deselect parent → Deselect all children  
3. Select some children → Parent shows partial state
4. Select all children → Parent fully selected

---

## Models

```typescript
export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  children?: TreeNode[];
  parentId?: string;
}

export enum SelectionState {
  UNSELECTED = 'unselected',
  SELECTED = 'selected',
  PARTIAL = 'partial'
}
```

---

## Data Flow

![Data Flow](https://via.placeholder.com/600x300?text=Data+Flow+Diagram)

1. Input tree data
2. Flattener transforms to render-ready format
3. Selection tracker manages all states
4. Output events when state changes

---

## Implementation Highlights

* Uses Angular Signals for reactive state
* Recursive selection state calculation
* Parent-child relationship tracking
* Indeterminate checkbox state for partial selection

---

## Testing Approaches

* Unit tests for selection logic
* Component tests with mock data
* Visual tests for all states
* Performance tests with large trees

---

## Thank You!

Demo:
* `/demo` - Documentation & demo page
* `/test` - Interactive testing harness
