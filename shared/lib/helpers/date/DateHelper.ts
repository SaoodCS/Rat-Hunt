import type { AxiosStatic } from 'axios';

export default class DateHelper {
   static async getCurrentTime(axios: AxiosStatic): Promise<number> {
      const res = await axios.get('https://worldtimeapi.org/api/ip');
      const data = await res.data;
      return data.unixtime;
   }

   static unixTimeToReadable = (unixTime: number): string => {
      const date = new Date(unixTime * 1000);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
   };

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

   static toYYYYMMDD(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
   }

   static prettify(date: Date): string {
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const day = date.getDate();
      return `${day} ${month} ${year}`;
   }
}
