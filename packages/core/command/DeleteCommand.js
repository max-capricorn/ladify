import _ from 'lodash'
export class DeleteCommand {
    constructor(redo, undo) {
      this.redof=redo;
      this.undof=undo;
      this.oldState = null;
    }
  
    execute() {
      this.oldState= _.cloneDeep(this.redof());
     }
  
    undo() {
      this.undof(this.oldState);
    }
}