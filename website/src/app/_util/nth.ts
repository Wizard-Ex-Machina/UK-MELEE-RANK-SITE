export default function nth(n: number): string {
  switch (n % 100) {
    case 11:
      return "11th";
    case 12:
      return "12th";
    case 13:
      return "13th";
    default:
      switch (n % 10) {
        case 1:
          return `${n}st`;
        case 2:
          return `${n}nd`;
        case 3:
          return `${n}rd`;
        default:
          return `${n}th`;
      }
  }
}
