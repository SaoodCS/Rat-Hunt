import type { AxiosStatic } from 'axios';

export default class DateHelper {
   static async getCurrentTime(axios: AxiosStatic): Promise<number> {
      const timeZone = 'Europe/Amsterdam';
      const res = await axios.get(`https://timeapi.io/api/Time/current/zone?timeZone=${timeZone}`);
      const data = res.data;
      const unixTimestamp = DateHelper.iso8601ToUnixTime(data.dateTime);
      return unixTimestamp;
   }

   static iso8601ToUnixTime(iso8601: string): number {
      return Math.floor(new Date(iso8601).getTime() / 1000);
   }

   static unixTimeToReadable = (unixTime: number): string => {
      const date = new Date(unixTime * 1000);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
   };

   static toDateInputStr(date: Date): string {
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
