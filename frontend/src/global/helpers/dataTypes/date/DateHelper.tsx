export default class DateHelper {
   static toDDMMYYYY = (date: Date): string => {
      let day: number | string = date.getDate();
      let month: number | string = date.getMonth() + 1;
      const year = date.getFullYear();
      if (day < 10) day = `0${day}`;
      if (month < 10) month = `0${month}`;
      return `${day}/${month}/${year}`;
   };

   static fromDDMMYYYY = (date: string): Date => {
      const [day, month, year] = date.split('/');
      return new Date(Number(year), Number(month) - 1, Number(day));
   };

   static fromMMYYYYToWord = (date: string): string => {
      const [month, year] = date.split('/');
      const monthNumber = parseInt(month, 10);
      const dateConv = new Date(Number(year), monthNumber - 1, 1);
      const monthWord = dateConv.toLocaleString('default', { month: 'short' });
      const yearWord = dateConv.toLocaleString('default', { year: 'numeric' });
      return `${monthWord} ${yearWord}`;
   };

   static fromDDMMYYYYToWord(date: string): string {
      const [day, month, year] = date.split('/');
      const monthAndYearConv = DateHelper.fromMMYYYYToWord(`${month}/${year}`);
      return `${day} ${monthAndYearConv}`;
   }

   static getMonthName(ddmmyyyy: string): string {
      const [day, month, year] = ddmmyyyy.split('/');
      const monthNumber = parseInt(month, 10);
      const dateConv = new Date(Number(year), monthNumber - 1, Number(day));
      const monthWord = dateConv.toLocaleString('default', { month: 'short' });
      return monthWord;
   }

   static getPrevMonthName(ddmmyyyy: string): string {
      const [day, month, year] = ddmmyyyy.split('/');
      const monthNumber = parseInt(month, 10);
      const dateConv = new Date(Number(year), monthNumber - 2, Number(day));
      const monthWord = dateConv.toLocaleString('default', { month: 'short' });
      return monthWord;
   }
}
