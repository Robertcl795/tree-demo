import { TreeNode, FlattenedNode, SelectionState } from '../types/tree.types';

/**
 * Utility functions for tree operations
 */
export class TreeUtils {
  
  /**
   * Flattens a tree structure into a flat array with depth information
   */
  static flattenTree<T>(
    nodes: TreeNode<T>[], 
    depth: number = 0,
    expandedNodes: Set<string> = new Set()
  ): FlattenedNode<T>[] {
    const result: FlattenedNode<T>[] = [];

    for (const node of nodes) {
      const flatNode: FlattenedNode<T> = {
        ...node,
        depth,
        isExpanded: expandedNodes.has(node.id)
      };
      
      result.push(flatNode);

      if (expandedNodes.has(node.id) && node.children?.length) {
        result.push(...this.flattenTree(node.children, depth + 1, expandedNodes));
      }
    }

    return result;
  }

  /**
   * Finds a node by ID in the tree
   */
  static findNodeById<T>(nodeId: string, nodes: TreeNode<T>[]): TreeNode<T> | null {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node;
      }
      
      if (node.children?.length) {
        const foundInChildren = this.findNodeById(nodeId, node.children);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }
    
    return null;
  }

  /**
   * Gets all descendant node IDs for a given node
   */
  static getDescendantIds<T>(node: TreeNode<T>): string[] {
    const descendants: string[] = [];
    
    if (node.children?.length) {
      for (const child of node.children) {
        descendants.push(child.id);
        descendants.push(...this.getDescendantIds(child));
      }
    }
    
    return descendants;
  }

  /**
   * Gets all ancestor node IDs for a given node
   */
  static getAncestorIds<T>(nodeId: string, nodes: TreeNode<T>[]): string[] {
    const parentMap = this.buildParentMap(nodes);
    const ancestors: string[] = [];
    let currentId = nodeId;
    
    while (parentMap.has(currentId)) {
      const parentId = parentMap.get(currentId)!;
      ancestors.push(parentId);
      currentId = parentId;
    }
    
    return ancestors;
  }

  /**
   * Builds a map of child ID to parent ID
   */
  static buildParentMap<T>(nodes: TreeNode<T>[], parentId?: string): Map<string, string> {
    const parentMap = new Map<string, string>();
    
    for (const node of nodes) {
      if (parentId) {
        parentMap.set(node.id, parentId);
      }
      
      if (node.children?.length) {
        const childrenMap = this.buildParentMap(node.children, node.id);
        for (const [childId, parentId] of childrenMap.entries()) {
          parentMap.set(childId, parentId);
        }
      }
    }
    
    return parentMap;
  }

  /**
   * Selects a node and all its descendants
   */
  static selectNodeAndDescendants<T>(node: TreeNode<T>, selectedSet: Set<string>): void {
    selectedSet.add(node.id);
    
    if (node.children?.length) {
      for (const child of node.children) {
        this.selectNodeAndDescendants(child, selectedSet);
      }
    }
  }

  /**
   * Deselects a node and all its descendants
   */
  static deselectNodeAndDescendants<T>(node: TreeNode<T>, selectedSet: Set<string>): void {
    selectedSet.delete(node.id);
    
    if (node.children?.length) {
      for (const child of node.children) {
        this.deselectNodeAndDescendants(child, selectedSet);
      }
    }
  }

  /**
   * Updates selection state for all nodes based on their children's state
   */
  static updateParentSelectionStates<T>(
    nodes: TreeNode<T>[],
    selectedSet: Set<string>,
    selectionStateMap: Map<string, SelectionState>
  ): void {
    for (const node of nodes) {
      if (node.children?.length) {
        // Recursively process children first
        this.updateParentSelectionStates(node.children, selectedSet, selectionStateMap);
        
        // Calculate this parent's selection state based on its children
        const allChildren = node.children.length;
        let selectedChildren = 0;
        let partialChildren = 0;
        
        for (const child of node.children) {
          const childState = selectionStateMap.get(child.id) || SelectionState.UNSELECTED;
          
          if (childState === SelectionState.SELECTED) {
            selectedChildren++;
          } else if (childState === SelectionState.PARTIAL) {
            partialChildren++;
          }
        }
        
        // Set parent state based on children
        if (selectedChildren === allChildren) {
          selectionStateMap.set(node.id, SelectionState.SELECTED);
          selectedSet.add(node.id);
        } else if (selectedChildren > 0 || partialChildren > 0) {
          selectionStateMap.set(node.id, SelectionState.PARTIAL);
        } else {
          selectionStateMap.set(node.id, SelectionState.UNSELECTED);
          selectedSet.delete(node.id);
        }
      } else if (!selectionStateMap.has(node.id)) {
        // Leaf nodes that aren't in the map yet are unselected
        selectionStateMap.set(node.id, SelectionState.UNSELECTED);
      }
    }
  }

  /**
   * Filters tree nodes based on a predicate function
   */
  static filterTree<T>(
    nodes: TreeNode<T>[], 
    predicate: (node: TreeNode<T>) => boolean
  ): TreeNode<T>[] {
    const filtered: TreeNode<T>[] = [];
    
    for (const node of nodes) {
      if (predicate(node)) {
        const filteredNode = { ...node };
        
        if (node.children?.length) {
          const filteredChildren = this.filterTree(node.children, predicate);
          if (filteredChildren.length > 0) {
            filteredNode.children = filteredChildren;
          }
        }
        
        filtered.push(filteredNode);
      } else if (node.children?.length) {
        // Check if any children match
        const filteredChildren = this.filterTree(node.children, predicate);
        if (filteredChildren.length > 0) {
          filtered.push({
            ...node,
            children: filteredChildren
          });
        }
      }
    }
    
    return filtered;
  }

  /**
   * Searches for nodes containing a search term
   */
  static searchTree<T>(
    nodes: TreeNode<T>[], 
    searchTerm: string, 
    searchProperty: keyof T
  ): TreeNode<T>[] {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return this.filterTree(nodes, (node) => {
      const value = node[searchProperty as string];
      return typeof value === 'string' && 
             value.toLowerCase().includes(lowerSearchTerm);
    });
  }

  /**
   * Validates tree structure for circular references
   */
  static validateTreeStructure<T>(nodes: TreeNode<T>[]): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const validateNode = (node: TreeNode<T>): boolean => {
      if (recursionStack.has(node.id)) {
        return false; // Circular reference detected
      }
      
      if (visited.has(node.id)) {
        return true; // Already validated
      }
      
      visited.add(node.id);
      recursionStack.add(node.id);
      
      if (node.children?.length) {
        for (const child of node.children) {
          if (!validateNode(child)) {
            return false;
          }
        }
      }
      
      recursionStack.delete(node.id);
      return true;
    };
    
    for (const node of nodes) {
      if (!validateNode(node)) {
        return false;
      }
    }
    
    return true;
  }
}
