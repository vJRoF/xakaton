import { Injectable } from '@angular/core';
import { MessageService } from '@progress/kendo-angular-l10n';

const messages = {
  'kendo.grid.groupPanelEmpty': 'Переместите сюда заголовок колонки, чтобы сгрупировать записи из этой колонки.',
  'kendo.grid.noRecords': 'Результатов не найдено.',
  'kendo.grid.pagerFirstPage': 'Вернуться на первую страницу',
  'kendo.grid.pagerPreviousPage': 'Перейти на предыдущую страницу',
  'kendo.grid.pagerNextPage': 'Перейдите на следующую страницу',
  'kendo.grid.pagerLastPage': 'К последней странице',
  'kendo.grid.pagerPage': 'Страница',
  'kendo.grid.pagerOf': 'из',
  'kendo.grid.pagerItems': 'элементов',
  'kendo.grid.pagerItemsPerPage': 'элементов на странице',
  'kendo.grid.filterEqOperator': 'равно',
  'kendo.grid.filterNotEqOperator': 'не равно',
  'kendo.grid.filterIsNullOperator': 'нулевой',
  'kendo.grid.filterIsNotNullOperator': 'не равно нулю',
  'kendo.grid.filterIsEmptyOperator': 'пусто',
  'kendo.grid.filterIsNotEmptyOperator': 'не пусто',
  'kendo.grid.filterStartsWithOperator': 'начинается на',
  'kendo.grid.filterContainsOperator': 'содержит',
  'kendo.grid.filterNotContainsOperator': 'не содержит',
  'kendo.grid.filterEndsWithOperator': 'оканчивается на',
  'kendo.grid.filterGteOperator': 'больше или равно',
  'kendo.grid.filterGtOperator': 'больше',
  'kendo.grid.filterLteOperator': 'меньше или равно',
  'kendo.grid.filterLtOperator': 'меньше',
  'kendo.grid.filterIsTrue': 'истина',
  'kendo.grid.filterIsFalse': 'ложь',
  'kendo.grid.filterBooleanAll': '(Все)',
  'kendo.grid.filterAfterOrEqualOperator': 'после или равна',
  'kendo.grid.filterAfterOperator': 'после',
  'kendo.grid.filterBeforeOperator': 'до',
  'kendo.grid.filterBeforeOrEqualOperator': 'до или равна',
  'kendo.grid.filterFilterButton': 'Фильтровать',
  'kendo.grid.filterClearButton': 'Очистить',
  'kendo.grid.filterAndLogic': 'И',
  'kendo.grid.filterOrLogic': 'или',
  'kendo.grid.loading': 'Загрузка',
  'kendo.grid.columnMenu': 'Меню колонок',
  'kendo.grid.columns': 'Колонки',
  'kendo.grid.lock': 'Заблокировать',
  'kendo.grid.unlock': 'Разблокировать',
  'kendo.grid.sortAscending': 'Сортировать по возрастанию',
  'kendo.grid.sortDescending': 'Сортировать по убыванию',
  'kendo.grid.columnsApply': 'Применить',
  'kendo.grid.columnsReset': 'Сбросить',
  'kendo.grid.filter': 'Фильтрация',
  'kendo.grid.sort': 'Сортировка',
  'kendo.datepicker.toggle': 'Выбрать дату',
  'kendo.datepicker.today': 'СЕГОДНЯ',
  'kendo.calendar.today': 'СЕГОДНЯ',
  'kendo.multiviewcalendar.today': 'СЕГОДНЯ'
};

@Injectable({
  providedIn: 'root'
})
export class CustomKendoMessageService extends MessageService {
  public get(key: string): string {
    return messages[key];
  }
}
