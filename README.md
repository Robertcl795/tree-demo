# Tree Explorer Component Demo

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.2.

## Tree Explorer Component

This project showcases an advanced Tree Explorer component built with Angular 20 and Angular Material that provides sophisticated selection capabilities:

- **Three Selection States**: Selected, Unselected, and Partial selection
- **Parent-Child Selection Synchronization**: Selection propagates between parents and children
- **Preloaded Selection**: Support for loading the tree with selections already present
- **Context Menu Actions**: Customizable actions for tree nodes
- **Type-Specific Icons**: Different icons based on node types
- **Configurable Selection Rules**: Define which node types can be selected

### Demo Pages

- `/test` - Interactive testing harness with configurable tree structures
- `/vault/:id` - Real-world implementation in a vault viewing context

### Documentation

For comprehensive information, see:

- [Full Component Documentation](/docs/tree-components.md)
- [Presentation Slides](/docs/tree-component-slides.md)
- [Testing Guide](/docs/tree-testing-guide.md)

## Project Structure

```
tree-demo/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── tree-explorer/         # Container component
│   │   │   └── tree-item/             # Individual node component
│   │   ├── models/
│   │   │   └── vault.model.ts         # Data models for the tree
│   │   ├── services/
│   │   │   └── vault.service.ts       # Demo data service
│   │   └── tree-test/                 # Test harness component
│   └── ...
└── docs/                             # Documentation
    ├── tree-components.md            # Comprehensive documentation
    ├── tree-component-slides.md      # Presentation-friendly docs
    └── tree-testing-guide.md         # Testing procedures
```

## Core Models

### TreeNode

```typescript
export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  children?: TreeNode[];
  parentId?: string;
  selectionState?: SelectionState;
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
  preselectedNodes?: string[];
}
```

### SelectionState

```typescript
export enum SelectionState {
  UNSELECTED = 'unselected',
  SELECTED = 'selected',
  PARTIAL = 'partial'
}
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
