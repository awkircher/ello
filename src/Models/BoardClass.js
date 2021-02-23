export class BoardClass {
    constructor(name, uid, ownerId) {
      this.name = name;
      this.uid = uid;
      this.ownerId = ownerId;
      this.listIds = [];
      this.memberIds = [];
    }
  }