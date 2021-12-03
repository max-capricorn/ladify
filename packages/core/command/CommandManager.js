Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

export default class CommandManager {
  constructor() {
    this.backward = [];
    this.forward = [];

  }
  execute(cmd) {
     this.backward.push(cmd);
     cmd.execute();
  }
  redo(){
    let lastcmd = this.forward.pop();
    console.log(this.forward.length)
    if (lastcmd) {
      lastcmd.execute();
      this.backward .push(lastcmd);
    }
  }

  undo() {
    let lastcmd = this.backward.pop();
    if (lastcmd) {
      lastcmd.undo();
      this.forward .push(lastcmd);
    }
  }
}

