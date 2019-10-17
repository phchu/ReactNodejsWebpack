import _ from 'lodash';
import moment from 'moment';

/**
 * 格式化Router回傳結果
 *
 * @param {Object} [result=null] 回傳結果
 * @param {String} [errCode=null] 自訂錯誤訊息所對應之錯誤碼
 * @returns 回傳結果
 */
function wrapResult(result = null, errCode = null) {
  const err = _.get(result, 'err');
  const isError = !_.isNil(err);
  const wrappedResult = {
    err: isError,
    // errCode: isError ? (!_.isNil(errCode) ? errCode.code : err.code) : undefined,
    errMsg: isError ? err : undefined,
    data: !isError ? result : undefined
  };
  return wrappedResult;
}

const removeEmpty = (obj) => {
  Object.keys(obj).forEach(k =>
    (obj[k] && typeof obj[k] === 'object') && removeEmpty(obj[k]) ||
    (!obj[k] && obj[k] !== undefined) && delete obj[k]);
  return obj;
};

function momentFormat(date, format = 'YYYY/MM/DD HH:mm') {
  if (!(date instanceof Date))
    {date = new Date(date);}
  return moment(date).utcOffset('+08:00').format(format);
}

export {
  wrapResult,
  removeEmpty,
  momentFormat
};
