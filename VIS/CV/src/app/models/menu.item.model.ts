export class MenuItem {
    constructor(public id?: number,
        public title?: string,
        public path?: string,
        public children?: MenuItem[]) { }
}
