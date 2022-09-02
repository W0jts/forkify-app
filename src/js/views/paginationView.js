import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClicker(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //First page and there are no other pages
    if (currentPage === 1 && numPages === 1) {
      return ``;
    }
    //First page and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateNextButton(currentPage);
    }
    //Middle pages
    if (currentPage < numPages) {
      return [
        this._generatePrevButton(currentPage),
        this._generateNextButton(currentPage),
      ].join('');
    }
    //Last page
    if (currentPage === numPages && numPages > 1) {
      return this._generatePrevButton(currentPage);
    }
  }
  _generatePrevButton(currentPage) {
    return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>`;
  }
  _generateNextButton(currentPage) {
    return `
    <button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>`;
  }
}

export default new PaginationView();
