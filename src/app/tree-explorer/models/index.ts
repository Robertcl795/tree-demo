// Re-export everything from types for backward compatibility
export * from '../types/tree.types';

import { TreeNode, TreeConfig } from '../types/tree.types';

// Legacy enums and interfaces for compatibility with existing code
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

// Default icon resolver for common node types
export const defaultIconResolver = (node: any): string => {
  const iconMap: Record<string, string> = {
    [NodeType.FOLDER]: 'folder',
    [NodeType.FILE]: 'description',
    [NodeType.DOCUMENT]: 'article',
    [NodeType.IMAGE]: 'image',
    [NodeType.CONFIG]: 'settings',
    [NodeType.EXECUTABLE]: 'launch',
    [NodeType.ARCHIVE]: 'archive',
    [NodeType.VIDEO]: 'video_file',
    [NodeType.AUDIO]: 'audio_file'
  };

  const nodeType = node.type || (node.children?.length ? NodeType.FOLDER : NodeType.FILE);
  return iconMap[nodeType] || 'description';
};

// Helper function to create default tree config
export const createDefaultTreeConfig = <T>(overrides: Partial<TreeConfig<T>> = {}): TreeConfig<T> => {
  return {
    labelProperty: 'name' as keyof T,
    iconProperty: 'type' as keyof T,
    childrenProperty: 'children' as keyof T,
    iconResolver: defaultIconResolver,
    showCheckboxes: true,
    showContextMenu: true,
    loadingBehavior: {
      showOnExpand: true,
      duration: 1000
    },
    contextMenuItems: [
      { id: 'rename', label: 'Rename', icon: 'edit', action: 'rename' },
      { id: 'delete', label: 'Delete', icon: 'delete', action: 'delete' },
      { id: 'properties', label: 'Properties', icon: 'info', action: 'properties' }
    ],
    ...overrides
  };
};

// Utility type for creating tree nodes with proper typing
export type CreateTreeNode<T> = Omit<TreeNode<T>, 'id'> & {
  id?: string;
};

// Helper function to create tree nodes with auto-generated IDs
export const createTreeNode = <T>(data: CreateTreeNode<T>): TreeNode<T> => {
  return {
    id: data.id || Math.random().toString(36).substr(2, 9),
    ...data
  };
};
