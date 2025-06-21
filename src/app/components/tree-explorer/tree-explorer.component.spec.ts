import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeExplorerComponent } from './tree-explorer.component';

describe('TreeExplorerComponent', () => {
  let component: TreeExplorerComponent;
  let fixture: ComponentFixture<TreeExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
