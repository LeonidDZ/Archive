export class SavedEntities {
    constructor(
        public rowsPerPage: number,
        public currPage: number
    ) {
        this.rowsPerPage = rowsPerPage;
        this.currPage = currPage;
    }
}
