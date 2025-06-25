# Tree Explorer Component Documentation

## Overview

The Tree Explorer is a powerful, reusable Angular 20 component for displaying and interacting with hierarchical data. It provides advanced features like partial selection states, preselected nodes, and contextual actions through an intuitive interface built with Angular Material.

```
┌─────────────────────── Tree Explorer Component ───────────────────────┐
│                                                                       │
│  ┌─[✓] Documents                                          ⋮ (menu)    │
│  │  │                                                                 │
│  │  ├─[✓] Reports                                         ⋮          │
│  │  │  ├─[✓] Q1_report.pdf                                ⋮          │
│  │  │  ├─[✓] Q2_report.pdf                                ⋮          │
│  │  │  └─[✓] Annual_summary.pdf                           ⋮          │
│  │  │                                                                 │
│  │  └─[✓] Contracts                                       ⋮          │
│  │     ├─[✓] contract_2025.pdf                            ⋮          │
│  │     └─[✓] agreement.docx                               ⋮          │
│  │                                                                    │
│  ├─[▤] Media                                              ⋮          │
│  │  │                                                                 │
│  │  ├─[✓] Images                                          ⋮          │
│  │  │  ├─[✓] logo.png                                     ⋮          │
│  │  │  └─[✓] banner.jpg                                   ⋮          │
│  │  │                                                                 │
│  │  └─[ ] Videos                                          ⋮          │
│  │     ├─[ ] presentation.mp4                             ⋮          │
│  │     └─[ ] tutorial.mp4                                 ⋮          │
│  │                                                                    │
│  └─[ ] Config                                             ⋮          │
│     └─[ ] settings.json                                   ⋮          │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

Legend:
[✓] Fully selected node
[▤] Partially selected node (some children selected)
[ ] Unselected node
⋮  Context menu trigger
```

## Key Features

- **Hierarchical Data Display**: Efficiently renders tree structures of any depth
- **Three Selection States**:
  - **Selected**: Node is fully selected (checkbox checked)
  - **Unselected**: Node is not selected (checkbox unchecked)
  - **Partial**: Some children are selected (checkbox in indeterminate state)
- **Preselected Nodes**: Support for loading trees with items already selected
- **Contextual Actions**: Three-dot menu with customizable actions for each node
- **Dynamic Loading**: Support for asynchronously loading child nodes
- **Type-specific Icons**: Different node types can display appropriate icons
- **Selectable Types Configuration**: Control which node types can be selected

## Component Architecture

```
┌─ Component Architecture ────────────────────────────────────────────┐
│                                                                     │
│  TreeExplorerComponent (Container)                                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │  ┌─ TreeItemComponent (Node) ─┐  ┌─ TreeItemComponent ─┐   │    │
│  │  │                            │  │                      │   │    │
│  │  │ ├─[✓] Documents       ⋮   │  │ ├─[ ] Config     ⋮   │   │    │
│  │  └────────────────────────────┘  └──────────────────────┘   │    │
│  │                                                             │    │
│  │  ┌─ TreeItemComponent ─┐  ┌─ TreeItemComponent ─┐           │    │
│  │  │                      │  │                      │          │    │
│  │  │ ├─[✓] Reports    ⋮   │  │ ├─[✓] Q1_report  ⋮   │          │    │
│  │  └──────────────────────┘  └──────────────────────┘          │    │
│  │                                                             │    │
│  │  State Management:                                          │    │
│  │  - Selection tracking                                       │    │
│  │  - Expansion state                                          │    │
│  │  - Parent-child relationships                               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│                                                                     │
│  Data Flow:                                                         │
│  1. Input tree data → TreeExplorerComponent                         │
│  2. TreeExplorerComponent flattens and manages state                │
│  3. TreeItemComponent instances render individual nodes             │
│  4. User interaction → Events emitted back to parent                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

The Tree Explorer consists of two main components working together to provide a seamless user experience:

### TreeExplorerComponent

The container component that:
- Manages the overall tree structure
- Handles flattening of hierarchical data for rendering
- Tracks expanded/collapsed state of nodes
- Manages selection states across parent-child relationships
- Calculates partial selection states

### TreeItemComponent

The individual node component that:
- Renders a single tree node with appropriate indentation
- Displays type-specific icons
- Handles selection interactions
- Manages expand/collapse functionality
- Provides contextual menu actions

## Selection State Propagation

The Tree Explorer implements intelligent selection state propagation:

```
┌─ Selection States Propagation ─────────────────────────────────────┐
│                                                                    │
│  1. Child → Parent Propagation:                                    │
│                                                                    │
│     ┌─[▤] Parent                   ┌─[✓] Parent                    │
│     │                              │                               │
│     ├─[✓] Child 1       →          ├─[✓] Child 1                   │
│     └─[ ] Child 2                  └─[✓] Child 2                   │
│        (Some selected)                (All selected)               │
│                                                                    │
│  2. Parent → Children Propagation:                                 │
│                                                                    │
│     ┌─[ ] Parent                   ┌─[✓] Parent                    │
│     │                              │                               │
│     ├─[ ] Child 1       →          ├─[✓] Child 1                   │
│     └─[ ] Child 2                  └─[✓] Child 2                   │
│      (Click parent)                   (All children selected)      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

1. **Child → Parent**: When children are selected or deselected, parent nodes update their state:
   - All children selected → Parent becomes fully selected
   - Some children selected → Parent shows partial (indeterminate) state
   - No children selected → Parent becomes unselected

2. **Parent → Children**: Selecting or deselecting a parent affects all its children:
   - Selecting a parent selects all its children
   - Deselecting a parent deselects all its children

## Usage Examples

### Basic Implementation

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

### Configuration

```typescript
const treeConfig: TreeConfig = {
  childrenProperty: 'children',
  labelProperty: 'name',
  iconProperty: 'type',
  selectableTypes: [
    NodeType.FILE, 
    NodeType.DOCUMENT,
    NodeType.IMAGE
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

## Data Models

### TreeNode

The core data structure for tree nodes:

```typescript
export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  children?: TreeNode[];
  parentId?: string;
  selectionState?: SelectionState; // Used internally
}
```

### TreeConfig

Configuration options for customizing the tree behavior:

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
  preselectedNodes?: string[];
}
```

### SelectionState

The possible selection states for a node:

```typescript
export enum SelectionState {
  UNSELECTED = 'unselected',
  SELECTED = 'selected',
  PARTIAL = 'partial'
}
```

### NodeType

Available node types with corresponding icons:

```
┌─ Node Types and Icons ────────────────────────────────────────────┐
│                                                                   │
│  📁 FOLDER      - folder icon for directories                     │
│  📄 FILE        - generic file icon                               │
│  📝 DOCUMENT    - document icon for text files                    │
│  🖼️  IMAGE       - image icon for pictures                         │
│  ⚙️  CONFIG      - gear icon for configuration files               │
│  🚀 EXECUTABLE  - launch icon for executables                     │
│  🗃️  ARCHIVE     - archive icon for compressed files               │
│  🎬 VIDEO       - video icon for media files                      │
│  🎵 AUDIO       - audio icon for sound files                      │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

```typescript
export enum NodeType {
  FOLDER = 'folder',
  FILE = 'file',
  DOCUMENT = 'document',
  IMAGE = 'image',
  CONFIG = 'config',
  EXECUTABLE = 'executable',
  ARCHIVE = 'archive',
  VIDEO = 'video',
  AUDIO = 'audio'
}
```

## Events

The Tree Explorer emits several events for interaction:

| Event | Description | Payload |
|-------|-------------|---------|
| `expand` | Node expanded or collapsed | `string` (node ID) |
| `menuAction` | Context menu action clicked | `MenuAction` object |
| `selectionChange` | Selection state changed | `string[]` (selected node IDs) |

## Implementation Details

### Partial Selection Algorithm

The tree uses a recursive algorithm to calculate selection states:

1. Track individual node selection in a Set
2. For each parent node:
   - Check how many children are selected or partial
   - If all children are selected, parent is SELECTED
   - If some children are selected/partial, parent is PARTIAL
   - If no children are selected, parent is UNSELECTED

### Preselection Implementation

Preselection is handled at initialization:

1. Set preselected node IDs in the configuration
2. During component initialization, these IDs are added to the selection set
3. The tree recursively updates parent selection states
4. Renders with the correct selection states already applied

## Performance Considerations

- Uses Angular's `@for` with `track` for efficient rendering
- Utilizes Angular signals for reactive state management
- Implements lazy rendering for unexpanded nodes
- Only updates affected nodes when selection changes

## Testing Strategy

For thorough testing of the tree component:

1. **Unit Tests**:
   - Selection state calculations
   - Parent-child relationship handling
   - Flattening algorithm

2. **Component Tests**:
   - Node expansion/collapse behavior
   - Selection interaction patterns
   - Menu action events

3. **Edge Cases**:
   - Deep tree structures (5+ levels)
   - Trees with many siblings at same level
   - Selection patterns with mixed node types

## Accessibility Features

- Proper ARIA attributes for interactive elements
- Keyboard navigation support for tree traversal
- High contrast visual cues for selection states
- Tooltips for disabled items explaining why they cannot be selected

## Best Practices

- Limit tree depth to 5-7 levels for best user experience
- Use descriptive node icons to aid visual recognition
- Implement search functionality for large trees
- Consider virtual scrolling for trees with 100+ nodes

## Live Demo

Test the component's capabilities in an interactive environment:

- **Testing Harness**: `/test` route
- **Example Implementation**: `/vault/:id` route

---

# Component Integration Guide

## Installation

1. Import the components in your module or standalone component:

```typescript
import { TreeExplorerComponent } from './components/tree-explorer/tree-explorer.component';
import { TreeItemComponent } from './components/tree-item/tree-item.component';
```

2. Include in your standalone component imports:

```typescript
@Component({
  // ...
  imports: [
    // ...
    TreeExplorerComponent
  ]
})
```

## Required Angular Material Dependencies

The component uses these Angular Material modules:

- MatCheckboxModule
- MatIconModule
- MatButtonModule
- MatMenuModule
- MatProgressBarModule
- MatTooltipModule

## Customization Options

### Custom Icons

To customize icons based on node types:

```typescript
getNodeIcon(nodeType: NodeType): string {
  switch (nodeType) {
    case NodeType.FOLDER: return 'folder';
    case NodeType.FILE: return 'description';
    // Add custom icons here
    case NodeType.CUSTOM_TYPE: return 'custom_icon';
    default: return 'description';
  }
}
```

### Custom Menu Actions

Implement different actions based on node type:

```typescript
onMenuAction(action: MenuAction) {
  const { nodeId, action: actionType } = action;
  const node = this.findNodeById(nodeId);
  
  if (!node) return;
  
  switch (actionType) {
    case 'rename':
      this.renameNode(node);
      break;
    case 'delete':
      this.deleteNode(node);
      break;
    case 'download':
      if (node.type !== NodeType.FOLDER) {
        this.downloadFile(node);
      }
      break;
  }
}
```

## Advanced Usage Examples

### Lazy Loading Children

```typescript
async onNodeExpand(nodeId: string) {
  // Set loading state
  this.setNodeLoading(nodeId, true);
  
  try {
    // Load children asynchronously
    const children = await this.dataService.loadNodeChildren(nodeId);
    
    // Update the node with new children
    this.updateNodeChildren(nodeId, children);
  } finally {
    // Clear loading state
    this.setNodeLoading(nodeId, false);
  }
}
```

### Selection State Management

```typescript
onSelectionChange(selectedIds: string[]) {
  this.selectedItems.set(selectedIds);
  
  // Example: Filtering selected items by type
  const selectedFiles = selectedIds
    .map(id => this.findNodeById(id))
    .filter(node => node && node.type === NodeType.FILE);
  
  // Take action based on selection
  if (selectedFiles.length > 0) {
    this.enableFileActions();
  } else {
    this.disableFileActions();
  }
}
```

## Troubleshooting Common Issues

| Problem | Possible Cause | Solution |
|---------|---------------|----------|
| Parent selection state not updating | Missing parentId references | Ensure tree data has proper parent-child relationships |
| Icons not displaying correctly | Incorrect type mapping | Verify node types match the NodeType enum values |
| Selection not persisting | Signal not properly updated | Make sure to properly update the selection set with .set() |
| Menu actions not firing | Event propagation issue | Add $event.stopPropagation() to menu click handlers |

---

## Future Enhancements

Planned improvements for future versions:

1. **Virtual Scrolling**: Support for efficiently rendering very large trees
2. **Drag and Drop**: Reordering and moving nodes between branches
3. **Search/Filter**: Integrated search functionality with highlighting
4. **Expanded Keyboard Navigation**: Complete keyboard control for accessibility
5. **Custom Node Templates**: Support for custom node rendering templates
