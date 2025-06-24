import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./vault-list/vault-list.component').then(m => m.VaultListComponent)
  },
  {
    path: 'vault/:id',
    loadComponent: () => import('./vault-view/vault-view.component').then(m => m.VaultViewComponent)
  },
  {
    path: 'test',
    loadComponent: () => import('./tree-test/tree-test.component').then(m => m.TreeTestComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];