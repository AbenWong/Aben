import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/merchant',
    method: 'post',
    data
  })
}

// 获取商户下拉列表
export function getMerchantDowndrop() {
  return request({
    url: 'api/merchant/merchant-downdrop',
    method: 'post'
  })
}

// 获取商户信息
export function getMerchantInfo(merchantId) {
  return request({
    url: 'api/merchant/merchant-get/' + merchantId,
    method: 'post'
  })
}

// 获取商户信息
export function approval(merchantId) {
  return request({
    url: 'api/merchant/approval/' + merchantId,
    method: 'post'
  })
}

// 校验制单
export function checkAdd(merchantId) {
  return request({
    url: 'api/merchant/check-add/' + merchantId,
    method: 'post'
  })
}

/**
 * 批量审批
 * @param batchIds
 */
export function batchApproval(merchantIds) {
  return request({
    url: 'api/goodsBatch/batch-approval',
    method: 'post',
    data: merchantIds
  })
}

export function del(ids) {
  return request({
    url: 'api/merchant/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/merchant',
    method: 'put',
    data
  })
}

export default { add, edit, del, getMerchantDowndrop, getMerchantInfo, checkAdd, approval, batchApproval }
