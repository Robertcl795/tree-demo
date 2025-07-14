import { Component, input, output, computed, ViewChild, TemplateRef } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

import { 
  TreeNode, 
  TreeConfig, 
  MenuAction, 
  SelectionState, 
  ContextMenuItem 
} from '../types/tree.types';

@Component({
  selector: 'tree-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <div class="tree-item" [style.padding-left.px]="paddingLeft()">
      @if (isLoading()) {
        <mat-progress-bar
          mode="indeterminate"
          class="loading-bar"
        ></mat-progress-bar>
      }

      <div class="item-content" 
           (click)="onRowClick($event)"
           (dblclick)="onRowDoubleClick($event)">
        
        <!-- Expand/Collapse Button -->
        <button
          mat-icon-button
          class="expand-button"
          [class.invisible]="!hasChildren()"
          (click)="onExpandClick($event)"
          [attr.aria-label]="isExpanded() ? 'Collapse' : 'Expand'"
          [attr.aria-expanded]="isExpanded()"
        >
          <mat-icon>{{ getExpandIcon() }}</mat-icon>
        </button>

        <!-- Selection Checkbox -->
        @if (config().showCheckboxes !== false) {
          <div class="checkbox-wrapper" 
               [matTooltip]="getDisabledTooltip()"
               [matTooltipDisabled]="!isCheckboxDisabled()"
               matTooltipPosition="right">
            <mat-checkbox
              [checked]="isSelected()"
              [indeterminate]="isIndeterminate()"
              [disabled]="isCheckboxDisabled()"
              (change)="onCheckboxChange($event)"
              (click)="onCheckboxClick($event)"
              [attr.aria-label]="'Select ' + getNodeLabel()"
            ></mat-checkbox>
          </div>
        }

        <!-- Node Icon -->
        <mat-icon class="node-icon" [attr.aria-hidden]="true">
          {{ getNodeIcon() }}
        </mat-icon>

        <!-- Node Label -->
        <span class="node-label" [title]="getNodeLabel()">
          {{ getNodeLabel() }}
        </span>

        <!-- Custom Content Projection -->
        <ng-content select="[slot=content]"></ng-content>

        <!-- Spacer -->
        <div class="spacer"></div>

        <!-- Context Menu -->
        <button
          mat-icon-button
          class="menu-button"
          [matMenuTriggerFor]="menu"
          (click)="$event.stopPropagation()"
          [attr.aria-label]="'Open context menu for ' + getNodeLabel()"
          [style.display]="config().showContextMenu === false || getContextMenuItems().length === 0 ? 'none' : 'block'"
        >
          <mat-icon>more_vert</mat-icon>
        </button>

        <!-- Custom Actions Projection -->
        <ng-content select="[slot=actions]"></ng-content>
      </div>
    </div>

    <!-- Context Menu -->
    <mat-menu #menu="matMenu">
      @for (item of getContextMenuItems(); track item.id) {
        @if (item.separator) {
          <mat-divider></mat-divider>
        } @else {
          <button 
            mat-menu-item 
            [disabled]="item.disabled"
            (click)="onMenuItemClick(item.action)">
            @if (item.icon) {
              <mat-icon>{{ item.icon }}</mat-icon>
            }
            <span>{{ item.label }}</span>
          </button>
        }
      }
    </mat-menu>
  `,
  styles: [`
    .tree-item {
      position: relative;
      min-height: 40px;
    }

    .loading-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      z-index: 1000;
    }

    .item-content {
      display: flex;
      align-items: center;
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.2s ease;
      min-height: 40px;
    }

    .item-content:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .item-content:hover .menu-button {
      opacity: 1;
    }

    .expand-button {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .expand-button.invisible {
      opacity: 0;
      pointer-events: none;
    }

    .checkbox-wrapper {
      margin-right: 8px;
      flex-shrink: 0;
    }

    .node-icon {
      margin-right: 8px;
      flex-shrink: 0;
      color: rgba(0, 0, 0, 0.6);
    }

    .node-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
    }

    .spacer {
      flex: 1;
    }

    .menu-button {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .menu-button mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class TreeItemComponent<T = any> {
  // Inputs
  node = input.required<TreeNode<T>>();
  depth = input.required<number>();
  isExpanded = input<boolean>(false);
  selectionState = input<SelectionState>(SelectionState.UNSELECTED);
  isLoading = input<boolean>(false);
  config = input.required<TreeConfig<T>>();

  // Outputs  
  expand = output<void>();
  toggleSelection = output<void>();
  menuAction = output<MenuAction>();
  nodeClick = output<Event>();
  nodeDoubleClick = output<Event>();

  // Computed properties
  paddingLeft = computed(() => this.depth() * 24 + 16);
  
  hasChildren = computed(() => 
    this.node().children && this.node().children!.length > 0
  );
  
  isSelected = computed(() => this.selectionState() === SelectionState.SELECTED);
  
  isIndeterminate = computed(() => this.selectionState() === SelectionState.PARTIAL);

  /**
   * Gets the display label for the node
   */
  getNodeLabel(): string {
    const labelProp = this.config().labelProperty;
    const node = this.node();
    return (node as any)[labelProp] || node.id || 'Unnamed';
  }

  /**
   * Gets the icon for the node
   */
  getNodeIcon(): string {
    const config = this.config();
    const node = this.node();

    // Use custom icon resolver if provided
    if (config.iconResolver) {
      return config.iconResolver(node);
    }

    // Use icon property if specified
    if (config.iconProperty) {
      const iconValue = (node as any)[config.iconProperty];
      if (iconValue) {
        return this.resolveDefaultIcon(iconValue);
      }
    }

    // Default icons based on node structure
    return this.hasChildren() ? 'folder' : 'description';
  }

  /**
   * Gets the expand/collapse icon
   */
  getExpandIcon(): string {
    return this.isExpanded() ? 'expand_more' : 'chevron_right';
  }

  /**
   * Resolves default icons for common node types
   */
  private resolveDefaultIcon(iconType: any): string {
    const iconMap: Record<string, string> = {
      folder: 'folder',
      file: 'description',
      document: 'article',
      image: 'image',
      config: 'settings',
      executable: 'launch',
      archive: 'archive',
      video: 'video_file',
      audio: 'audio_file',
      code: 'code',
      text: 'text_snippet'
    };

    return iconMap[iconType?.toString().toLowerCase()] || 'description';
  }

  /**
   * Checks if the checkbox should be disabled
   */
  isCheckboxDisabled(): boolean {
    const node = this.node();
    const config = this.config();
    
    // If selectableTypes is defined, only those types are enabled
    if (config.selectableTypes && config.selectableTypes.length > 0) {
      const nodeType = this.getNodeType(node);
      return !config.selectableTypes.includes(nodeType);
    }
    
    // If disabledTypes is defined, check if this node matches any
    if (config.disabledTypes && config.disabledTypes.length > 0) {
      return config.disabledTypes.some(disabled => {
        if (disabled.matcher) {
          return disabled.matcher(node);
        }
        const nodeType = this.getNodeType(node);
        return disabled.type === nodeType;
      });
    }
    
    return false;
  }

  /**
   * Gets the tooltip text for disabled checkboxes
   */
  getDisabledTooltip(): string {
    if (!this.isCheckboxDisabled()) {
      return '';
    }
    
    const node = this.node();
    const config = this.config();
    const nodeType = this.getNodeType(node);
    
    // Find the specific disabled type configuration
    const disabledConfig = config.disabledTypes?.find(disabled => {
      if (disabled.matcher) {
        return disabled.matcher(node);
      }
      return disabled.type === nodeType;
    });
    
    if (disabledConfig) {
      return disabledConfig.reason;
    }
    
    return `${nodeType} items cannot be selected`;
  }

  /**
   * Gets the context menu items for this node
   */
  getContextMenuItems(): ContextMenuItem[] {
    const config = this.config();
    return config.contextMenuItems || [
      { id: 'rename', label: 'Rename', icon: 'edit', action: 'rename' },
      { id: 'delete', label: 'Delete', icon: 'delete', action: 'delete' },
      { id: 'properties', label: 'Properties', icon: 'info', action: 'properties' }
    ];
  }

  /**
   * Gets the node type for comparison
   */
  private getNodeType(node: TreeNode<T>): any {
    // Try to get type from common property names
    const typeProperties = ['type', 'nodeType', 'kind'];
    for (const prop of typeProperties) {
      if ((node as any)[prop] !== undefined) {
        return (node as any)[prop];
      }
    }
    
    // Fallback to structural type
    return this.hasChildren() ? 'folder' : 'file';
  }

  // Event handlers
  onRowClick(event: Event) {
    this.nodeClick.emit(event);
    
    if (this.hasChildren()) {
      this.expand.emit();
    }
  }

  onRowDoubleClick(event: Event) {
    this.nodeDoubleClick.emit(event);
  }

  onExpandClick(event: Event) {
    event.stopPropagation();
    if (this.hasChildren()) {
      this.expand.emit();
    }
  }

  onCheckboxChange(event: MatCheckboxChange) {
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
      action,
      data: this.node()
    });
  }
}
