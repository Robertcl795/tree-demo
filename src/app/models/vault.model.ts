export interface Vault {
  id: string;
  name: string;
  peopleCount: number;
  sectionsCount: number;
}

export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'document' | 'image';
  children?: TreeNode[];
  parentId?: string;
}

export interface TreeConfig {
  childrenProperty: string;
  labelProperty: string;
  iconProperty: string;
}

export interface MenuAction {
  nodeId: string;
  action: string;
}