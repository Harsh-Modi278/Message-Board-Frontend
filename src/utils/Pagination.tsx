export class Pagination<T> {
  private data: T[];
  private pageSize: number;

  static DEFAULT_PAGE_SIZE: number = 5; // number of posts per page
  static DEFAULT_FIRST_PAGE: number = 1; // default page number

  constructor(data: T[], pageSize: number) {
    this.data = data;
    this.pageSize = pageSize;
  }

  getPage(n: number): T[] {
    const offset = (n - 1) * this.pageSize;
    return this.data?.slice(offset, offset + this.pageSize);
  }

  getUptoPage(n: number): T[] {
    console.log({ data: this.data, n, pageSize: this.pageSize });
    const offset = (n - 1) * this.pageSize;
    return this.data?.slice(0, offset + this.pageSize);
  }

  getTotalPages(): number {
    return Math.floor((this.data.length || 0) / this.pageSize) + 1;
  }
}

export interface PageNavigationProps {
  nextPageHandler: () => void;
  previousPageHandler: () => void;
  currentPage: number;
  totalPages: number;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
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
