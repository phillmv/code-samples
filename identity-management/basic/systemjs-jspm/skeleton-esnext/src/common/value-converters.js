export class AlignValueConverter {

  toView(rows, alignment) {
    return rows.filter(x => (!x.settings || !x.settings.align) || x.settings.align === alignment);
  }
}
