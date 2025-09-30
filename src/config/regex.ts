export const PASSWORD_REGEXP:RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9\s])\S{8,16}$/;
export const URL_REGEXP:RegExp = /^((https?|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+:)?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]\.[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/;
export const EMAIL_REGEXP:RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const ID_CARD_REGEXP:RegExp = /^(?:\d{15}|\d{17}[\dXx])$/;
export const PHONE_REGEXP:RegExp = /^1[3-9]\d{9}$/;
export const LAND_LINE_REGEXP:RegExp = /^0\d{2,3}-?\d{7,8}$/;
