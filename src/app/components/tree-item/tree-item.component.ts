import { Component, input, output, computed } from '@angular/core';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TreeNode, TreeConfig, MenuAction, NodeType, SelectionState } from '../../models/vault.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tree-item',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './tree-item.component.html',
  styleUrl: './tree-item.component.scss',
})
export class TreeItemComponent {
  // Inputs
  node = input.required<TreeNode>();
  depth = input.required<number>();
  isExpanded = input<boolean>(false);
  selectionState = input<SelectionState>(SelectionState.UNSELECTED);
  isLoading = input<boolean>(false);
  config = input.required<TreeConfig>();

  // Outputs  
  expand = output<void>();
  toggleSelection = output<void>();
  menuAction = output<MenuAction>();

  // Computed properties
  paddingLeft = computed(() => this.depth() * 24 + 16);
  
  hasChildren = computed(() => 
    this.node().children && this.node().children!.length > 0
  );
  
  isSelected = computed(() => this.selectionState() === SelectionState.SELECTED);
  
  isIndeterminate = computed(() => this.selectionState() === SelectionState.PARTIAL);

  getNodeLabel(): string {
    const labelProp = this.config().labelProperty;
    return (this.node() as any)[labelProp] || 'Unnamed';
  }

  getNodeIcon(): string {
    const iconProp = this.config().iconProperty;
    const iconType = (this.node() as any)[iconProp] as NodeType;
    
    switch (iconType) {
      case NodeType.FOLDER: return 'folder';
      case NodeType.FILE: return 'description';
      case NodeType.DOCUMENT: return 'article';
      case NodeType.IMAGE: return 'image';
      case NodeType.CONFIG: return 'settings';
      case NodeType.EXECUTABLE: return 'launch';
      case NodeType.ARCHIVE: return 'archive';
      case NodeType.VIDEO: return 'video_file';
      case NodeType.AUDIO: return 'audio_file';
      default: return 'description';
    }
  }

  isCheckboxDisabled(): boolean {
    const nodeType = this.node().type;
    const config = this.config();
    
    // If selectableTypes is defined, only those types are enabled
    if (config.selectableTypes && config.selectableTypes.length > 0) {
      return !config.selectableTypes.includes(nodeType);
    }
    
    // If disabledTypes is defined, those types are disabled
    if (config.disabledTypes && config.disabledTypes.length > 0) {
      return config.disabledTypes.some(disabled => disabled.type === nodeType);
    }
    
    // Default: all types are selectable
    return false;
  }

  getDisabledTooltip(): string {
    if (!this.isCheckboxDisabled()) {
      return '';
    }
    
    const nodeType = this.node().type;
    const config = this.config();
    
    // Find the specific disabled type configuration
    const disabledConfig = config.disabledTypes?.find(disabled => disabled.type === nodeType);
    if (disabledConfig) {
      return disabledConfig.reason;
    }
    
    // Fallback message if using selectableTypes approach
    return `${nodeType} files cannot be selected`;
  }

  onRowClick(event: Event) {
    if (this.hasChildren()) {
      this.expand.emit();
    }
  }

  onExpandClick(event: Event) {
    event.stopPropagation();
    if (this.hasChildren()) {
      this.expand.emit();
    }
  }

  onCheckboxChange(event: MatCheckboxChange) {
    // Only process if checkbox is not disabled
    if (!this.isCheckboxDisabled()) {
      this.toggleSelection.emit();
    }
  }

  onCheckboxClick(event: Event) {
    event.stopPropagation();
  }

  onMenuItemClick(action: string) {
    this.menuAction.emit({
      nodeId: this.node().id,
      action
    });
  }
}
