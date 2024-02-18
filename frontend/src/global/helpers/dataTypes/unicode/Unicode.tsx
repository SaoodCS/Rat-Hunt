export default class Unicode {
   static rightArrow(asString: boolean = false): string | JSX.Element {
      return asString ? '→' : <>→</>;
   }
   static leftArrow(asString: boolean = false): string | JSX.Element {
      return asString ? '←' : <>←</>;
   }
   static upArrow(asString: boolean = false): string | JSX.Element {
      return asString ? '↑' : <>↑</>;
   }
   static downArrow(asString: boolean = false): string | JSX.Element {
      return asString ? '↓' : <>↓</>;
   }
}
