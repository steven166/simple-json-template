/**
 * Model which holds the current scope
 */
export interface ScopeModel {

  path: string;
  this?: any;
  root?: any;
  parent?: any;
  vars?: any;

}