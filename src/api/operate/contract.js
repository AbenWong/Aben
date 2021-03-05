import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/contract',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/contract/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/contract',
    method: 'put',
    data
  })
}

export function getContractDowndrop() {
  return request({
    url: 'api/contract/contract-downdrop',
    method: 'post'
  })
}

export function getContractByContractId(contractId) {
  return request({
    url: 'api/contract/contract-get-contractId/' + contractId,
    method: 'post'
  })
}

export function getEditByMerchantId(merchantId) {
  return request({
    url: 'api/contract/getedit-merchantId/' + merchantId,
    method: 'post'
  })
}

/**
 *根据供应商ID获取最新有效的合同信息
 * @param merchantId
 */
export function getByMerchantId(merchantId) {
  return request({
    url: 'api/contract/getby-merchant-id/' + merchantId,
    method: 'post'
  })
}

export function getByContractApprovalNo(contractApprovalNo) {
  return request({
    url: 'api/contract/get-contractApprovalNo/' + contractApprovalNo,
    method: 'post'
  })
}

// 获取商户信息
export function approval(contractId) {
  return request({
    url: 'api/contract/approval/' + contractId,
    method: 'post'
  })
}

/**
 * 批量审批
 * @param batchIds
 */
export function batchApproval(contractIds) {
  return request({
    url: 'api/contract/batch-approval',
    method: 'post',
    data: contractIds
  })
}
export default {
  add,
  edit,
  del,
  getContractDowndrop,
  approval,
  batchApproval,
  getContractByContractId,
  getEditByMerchantId,
  getByMerchantId,
  getByContractApprovalNo }
