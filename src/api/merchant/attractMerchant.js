import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/attractMerchant',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/attractMerchant/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/attractMerchant',
    method: 'put',
    data
  })
}

// 获取招商信息
export function getAttractMerchantsInfo(attractMerchantId) {
  return request({
    url: 'api/attractMerchant/attractMerchant-get/' + attractMerchantId,
    method: 'post'
  })
}

/**
 * 单个审批
 * @param batchId
 */
export function approval(attractMerchantId) {
  return request({
    url: 'api/attractMerchant/approval/' + attractMerchantId,
    method: 'post'
  })
}

/**
 * 批量审批
 * @param batchIds
 */
export function batchApproval(batchIds) {
  return request({
    url: 'api/attractMerchant/batch-approval',
    method: 'post',
    batchIds
  })
}

// 获取商户下拉列表
export function getUserDowndrop() {
  return request({
    url: 'api/users/user-downdrop',
    method: 'post'
  })
}
export default { add, edit, del, getAttractMerchantsInfo, approval, batchApproval, getUserDowndrop }
