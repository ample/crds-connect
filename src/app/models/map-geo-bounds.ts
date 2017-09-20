export class MapGeoBounds {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;

  constructor(bounds: any, delta: Function) {
    this.top = this.sw(bounds).lat().valueOf(),
    this.bottom = this.ne(bounds).lat().valueOf(),
    this.left = this.ne(bounds).lng().valueOf(),
    this.right = this.sw(bounds).lng().valueOf(),
    this.width = delta(this.ne(bounds).lng().valueOf(), this.sw(bounds).lng().valueOf()),
    this.height = delta(this.sw(bounds).lat().valueOf(), this.ne(bounds).lat().valueOf());
  }

  public sw(bounds) {
    return bounds.getSouthWest();
  }

  public ne(bounds) {
    return bounds.getNorthEast();
  }

}
