export default class NumberHelper {
   static minsToMs(mins: number): number {
      return mins * 60 * 1000;
   }
   static secsToMs(secs: number): number {
      return secs * 1000;
   }
   static hoursToMs(hours: number): number {
      return hours * 60 * 60 * 1000;
   }
   static asCurrencyStr(value: number, hideCurrencySymbol?: boolean): string {
      const str = value.toFixed(2);
      const split = str.split('.');
      const first = split[0];
      const second = split[1];
      const firstWithCommas = first.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const currencySymbol = hideCurrencySymbol ? '' : '£';
      return `${currencySymbol}${firstWithCommas}.${second}`;
   }

   static roundTo(value: number, decimalPlaces: number): number {
      return Number(value.toFixed(decimalPlaces));
   }

   static calcPercentageChange(prev: number, curr: number): number {
      const diff = curr - prev;
      const percentageChange = ((diff / prev) * 100).toFixed(2);
      return Number(percentageChange);
   }

   static calcPercentage(num: number, outOf: number, capAt100?: boolean): number {
      const completedAsPerc = Number(((num / outOf) * 100).toFixed(2));
      if (completedAsPerc >= 100 && capAt100) return 100;
      return completedAsPerc;
   }
}
