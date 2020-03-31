class Config {
  private _root: string
  constructor() {
    this._root = __dirname
  }

  get root(): string {
    return this._root
  }
}

let fig: Config = new Config()

export default fig
