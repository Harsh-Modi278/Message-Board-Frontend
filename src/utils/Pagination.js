export class Pagination {
  constructor(data, pageSize) {
    this.data = data;
    this.pageSize = pageSize;
  }

  getPage(n) {
    const offset = (n - 1) * this.pageSize;
    return this.data?.slice(offset, offset + this.pageSize);
  }

  getUptoPage(n) {
    const offset = (n - 1) * this.pageSize;
    return this.data?.slice(0, offset + this.pageSize);
  }

  getTotalPages() {
    return Math.floor(this?.data?.length / this?.pageSize) + 1;
  }
}

export const PageNavigation = ({
  nextPageHandler,
  previousPageHandler,
  currentPage,
  totalPages,
}) => {
  return (
    <div>
      {currentPage === 0 ? null : (
        <button onClick={previousPageHandler}>Prev</button>
      )}
      {currentPage + 1 >= totalPages ? null : (
        <button onClick={nextPageHandler}>Next</button>
      )}
      <span>
        Page {currentPage + 1} of {totalPages}
      </span>
    </div>
  );
};
