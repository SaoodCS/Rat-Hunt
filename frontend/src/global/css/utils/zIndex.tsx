export namespace CSS_ZIndex {
   const ZIndexOrder = [
      'splashScreen',
      'loader',
      'toast',
      'modal',
      'bottomPanel',
      'popupMenu',
      'default',
   ] as const;

   export function get(component: (typeof ZIndexOrder)[number]): number {
      const reversedClone = JSON.parse(JSON.stringify(ZIndexOrder)).reverse();
      return reversedClone.indexOf(component);
   }
}

export default CSS_ZIndex;
