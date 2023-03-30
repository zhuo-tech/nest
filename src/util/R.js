export class R {

  code
  msg
  data

  constructor(code, msg, data) {
    this.code = code
    this.msg = msg
    this.data = data
  }

  static ok(data, msg = 'success') {
    return new R(0, msg, data)
  }

  static failed(msg, code = 1) {
    return new R(code, msg, false)
  }
}

