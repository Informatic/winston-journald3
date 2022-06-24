"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winstonTransport = _interopRequireDefault(require("winston-transport"));

var _sdJournald = require("sd-journald");

var _immutable = require("immutable");

var _tripleBeam = require("triple-beam");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class WinstonJournald extends _winstonTransport.default {
  constructor(options) {
    super(options);

    _defineProperty(this, "journald", void 0);

    _defineProperty(this, "messageAsFinalizingFormat", void 0);

    if (options.identifier) {
      this.journald = new _sdJournald.Journald(options.identifier);
    } else {
      this.journald = new _sdJournald.Journald();
    }

    if (options.messageAsFinalizingFormat) {
      this.messageAsFinalizingFormat = true;
    } else {
      this.messageAsFinalizingFormat = false;
    }
  }
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */


  log(info, next) {
    setImmediate(() => {
      this.emit('logged', info);
    });
    /* eslint-disable @typescript-eslint/no-unused-vars */

    const {
      _level,
      message,
      [_tripleBeam.LEVEL]: level,
      [_tripleBeam.SPLAT]: _splat,
      [_tripleBeam.MESSAGE]: finalizedMessage
    } = info,
          meta = _objectWithoutProperties(info, ["_level", "message", _tripleBeam.LEVEL, _tripleBeam.SPLAT, _tripleBeam.MESSAGE].map(_toPropertyKey));

    const priority = WinstonJournald.toPriority(level);
    const extra = (0, _immutable.fromJS)(meta);
    this.journald.send(priority, this.messageAsFinalizingFormat ? finalizedMessage : message, extra.mapEntries(([k, v]) => [k, WinstonJournald.toString(v)]));
    next();
  }

  close() {
    if (this.journald.socket) {
      this.journald.socket.close();
    }
  }

  static toString(value) {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    const str = new String(value);
    return str.valueOf();
  }

  static toPriority(level) {
    switch (level) {
      case "emerg":
        return _sdJournald.SyslogPrority.EMERG;

      case "alert":
        return _sdJournald.SyslogPrority.ALERT;

      case "crit":
        return _sdJournald.SyslogPrority.CRIT;

      case "error":
        return _sdJournald.SyslogPrority.ERROR;

      case "warning":
      case "warn":
        return _sdJournald.SyslogPrority.WARN;

      case "notice":
        return _sdJournald.SyslogPrority.NOTICE;

      case "info":
        return _sdJournald.SyslogPrority.INFO;

      case "debug":
        return _sdJournald.SyslogPrority.DEBUG;

      default:
        return _sdJournald.SyslogPrority.DEBUG;
    }
  }

}

exports.default = WinstonJournald;