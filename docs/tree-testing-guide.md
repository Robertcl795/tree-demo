# Tree Explorer Component Testing Guide

This guide outlines the test scenarios and procedures for validating the Tree Explorer component. Use this document to ensure consistent testing across the development team.

## Test Environment

The component can be tested in two ways:

1. **Testing Harness**: Access the `/test` route for an interactive testing environment
2. **Real-world Implementation**: Visit the `/vault/:id` route to see the component in a real application context

## Functional Testing Matrix

| Test Case | Steps | Expected Result | Pass/Fail |
|-----------|-------|-----------------|-----------|
| **Basic Tree Rendering** | 1. Navigate to test page<br>2. Click "Basic Tree" button | Tree displays with root nodes and proper indentation | |
| **Expansion/Collapse** | 1. Click on caret icon<br>2. Click the same caret icon again | 1. Node expands showing children<br>2. Node collapses hiding children | |
| **Single Node Selection** | Click checkbox for a leaf node | Checkbox becomes checked | |
| **Parent Selection** | Click checkbox for a parent node | 1. Parent checkbox becomes checked<br>2. All child checkboxes become checked | |
| **Partial Selection** | 1. Expand a parent node<br>2. Select one child but not others | Parent shows indeterminate state (partial selection) | |
| **Deselecting Parent** | 1. Select a parent (which selects all children)<br>2. Click parent checkbox again | 1. Parent becomes unchecked<br>2. All child nodes become unchecked | |
| **Preselection** | Click "Preselect Leaf Nodes" button | All leaf nodes show as selected with parents showing partial selection as appropriate | |
| **Menu Actions** | 1. Hover over a node<br>2. Click on the three-dot menu<br>3. Select an action | 1. Menu appears<br>2. Menu opens<br>3. Action is logged in event log | |
| **Tooltip on Disabled** | Hover over checkbox of a disabled node type | Tooltip appears explaining why the node is disabled | |

## Edge Case Testing

| Edge Case | Test Procedure | Expected Result | Pass/Fail |
|-----------|---------------|-----------------|-----------|
| **Deep Nesting** | 1. Click "Deep Tree" button<br>2. Expand multiple levels | Tree correctly renders with proper indentation at all levels | |
| **Many Siblings** | Add multiple nodes at same level using "Add Node" | All siblings render correctly with proper navigation | |
| **Mixed Selection States** | 1. Click "Complex Tree" button<br>2. Select nodes at various levels | Selection state correctly propagates up and down the tree | |
| **Empty Folders** | 1. Add a folder with no children<br>2. Attempt to expand | 1. Folder shows with no caret<br>2. Nothing happens on click (no expansion) | |

## Visual Appearance Testing

| Element | Criteria | Expected Appearance | Pass/Fail |
|---------|----------|---------------------|-----------|
| **Indentation** | Check nodes at different levels | Each level indented 24px further than parent | |
| **Icons** | Check each node type | Proper icon displayed for each node type | |
| **Selection Visual** | Check selected, unselected, partial states | Clear visual difference between all three states | |
| **Hover Effects** | Hover over tree items | 1. Background color changes<br>2. Three-dot menu appears | |
| **Loading Indicator** | Expand a node with children | Brief loading bar appears at top of node | |

## Interactive Testing Procedure

1. **Selection Propagation**
   - Start with a clean tree (click "Complex Tree")
   - Select a parent node and verify all children select
   - Deselect one child and verify parent goes to partial state
   - Deselect all children and verify parent deselects
   - Select all children individually and verify parent selects

2. **Preselection Testing**
   - Click "Clear Selection" button
   - Click "Preselect Mixed Nodes"
   - Verify selection states are correctly applied
   - Perform additional selections and verify behavior is consistent

3. **Menu Action Testing**
   - Click on different menu items for different node types
   - Verify proper actions appear in the event log
   - Check that menu closes after action selection

## Performance Testing

| Test | Procedure | Acceptance Criteria | Pass/Fail |
|------|-----------|---------------------|-----------|
| **Large Tree Rendering** | 1. Generate deep tree with many nodes<br>2. Measure initial render time | Renders in under 500ms | |
| **Selection Performance** | 1. Select a parent with many descendants<br>2. Measure time until all children update | Updates in under 100ms | |
| **Expansion Performance** | Expand/collapse nodes with many children | Animation completes smoothly | |

## Regression Testing

After any changes to the component, verify:

1. Selection states still propagate correctly
2. Preselected nodes render properly on initialization
3. Node expansion/collapse works as expected
4. Menu actions trigger correctly
5. Visual styling remains consistent

## Keyboard Accessibility Testing

| Test | Procedure | Expected Result | Pass/Fail |
|------|-----------|-----------------|-----------|
| **Tab Navigation** | Tab through the tree | Focus moves through interactive elements in logical order | |
| **Checkbox Operation** | Press Space when a checkbox has focus | Checkbox toggles selection state | |
| **Menu Access** | 1. Tab to menu button<br>2. Press Enter<br>3. Use arrow keys | Menu opens and allows navigation | |

## Cross-Browser Testing

Test the component in:
- Chrome
- Firefox
- Safari
- Edge

## User Acceptance Scenarios

1. **Data Browser Scenario**:
   - Load complex tree structure
   - Find and select specific nodes using expand/collapse
   - Verify correct files are selected

2. **Batch Operations Scenario**:
   - Select multiple items using parent selection
   - Perform action on selected items
   - Verify action applied to all selected items

3. **Configuration Scenario**:
   - Change configuration to disable certain node types
   - Verify those nodes cannot be selected
   - Verify tooltip explains why selection is disabled

## Bug Reporting Template

When reporting issues with the tree component, include:

1. **Environment**: Browser, version, screen size
2. **Reproduction Steps**: Clear steps to reproduce the issue
3. **Expected vs. Actual**: What should happen vs. what did happen
4. **Tree Structure**: Description or screenshot of the tree structure
5. **Selection State**: Which nodes were selected/unselected
6. **Screenshots/Video**: Visual evidence if applicable
7. **Console Errors**: Any errors in the developer console

## Known Limitations

- Tree performance may degrade with more than 1000 total nodes
- Partial selection only tracks direct parent-child relationships
- Menu actions are limited to the predefined set
- Icon customization requires code changes
