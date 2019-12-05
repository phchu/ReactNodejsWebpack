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
  const err = result instanceof Error;
  const wrappedResult = {
    err,
    // errCode: isError ? (!_.isNil(errCode) ? errCode.code : err.code) : undefined,
    errMsg: err ? _.get(result, 'message') : undefined,
    data: !err ? result : undefined
  };
  return wrappedResult;
}

function momentFormat(_date, format = 'YYYY/MM/DD HH:mm') {
  let date = _date;
  if (!(date instanceof Date)) {
    date = new Date(_date);
  }
  return moment(date)
    .utcOffset('+08:00')
    .format(format);
}

const restResult = (res, result) => {
  const { err } = result;
  if (err) {
    res.status(400).json(result);
  } else {
    res.json(result);
  }
};

export { wrapResult, momentFormat, restResult };
