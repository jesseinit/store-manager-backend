const paginateEmptyResult = message => ({
  status: 'success',
  message,
  data: [],
  meta: {
    hasNextPage: false,
    hasPrevPage: false
  }
});
/* istanbul ignore next */
const paginatedResult = (rows, totalPages, currentPage, message = 'Records retrieved successfully') => ({
  status: 'success',
  message,
  data: rows,
  meta: {
    totalPages,
    currentPage,
    nextPage: currentPage < totalPages ? currentPage + 1 : undefined,
    prevPage: currentPage > 1 ? currentPage - 1 : undefined,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  }
});

export { paginateEmptyResult, paginatedResult };
