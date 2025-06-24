export interface Vault {
  id: string;
  name: string;
  peopleCount: number;
  sectionsCount: number;
}

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

export enum SelectionState {
  UNSELECTED = 'unselected',
  SELECTED = 'selected',
  PARTIAL = 'partial'
}

export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  children?: TreeNode[];
  parentId?: string;
  selectionState?: SelectionState;
}

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

export interface MenuAction {
  nodeId: string;
  action: string;
}