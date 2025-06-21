import { Component, input, output, computed } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TreeNode, TreeConfig, MenuAction } from '../../models/vault.model';

@Component({
  selector: 'app-tree-item',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule
  ],
  templateUrl: './tree-item.component.html',
  styleUrl: './tree-item.component.scss'
})
export class TreeItemComponent {
  // Inputs
  node = input.required<TreeNode>();
  depth = input.required<number>();
  isExpanded = input<boolean>(false);
  isSelected = input<boolean>(false);
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

  getNodeLabel(): string {
    const labelProp = this.config().labelProperty;
    return (this.node() as any)[labelProp] || 'Unnamed';
  }

  getNodeIcon(): string {
    const iconProp = this.config().iconProperty;
    const iconType = (this.node() as any)[iconProp];
    
    switch (iconType) {
      case 'folder': return 'folder';
      case 'file': return 'description';
      case 'document': return 'article';
      case 'image': return 'image';
      default: return 'description';
    }
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

  onCheckboxChange(_event: MatCheckboxChange) {
    this.toggleSelection.emit();
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