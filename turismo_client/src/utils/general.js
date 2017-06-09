import moment from 'moment';

export function formatDateString(dateString) {
  const date = moment.utc(dateString);
  moment.locale('es');
  return date.format('ll');
}
