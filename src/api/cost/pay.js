import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/pay',
    method: 'post',
    data
  })
}

/**
 * 批量作废订单
 * @param data
 */
export function batchinvalid(data) {
  return request({
    url: 'api/pay/approve/invalid',
    method: 'post',
    data
  })
}

/**
 * 批量作废订单
 * @param data
 */
export function payment(data) {
  return request({
    url: 'api/pay/payment',
    method: 'post',
    data
  })
}

/**
 * 对账
 * @param id
 */
export function checkA(data) {
  return request({
    url: `api/pay/approve/check`,
    method: 'post',
    data
  })
}

/**
 * 批量审批
 * @param id
 */
export function batchApproval(data) {
  return request({
    url: `api/pay/approval`,
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/pay',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/pay',
    method: 'put',
    data
  })
}

export function editUser(data) {
  return request({
    url: 'api/pay/center',
    method: 'put',
    data
  })
}

/**
 * 流程
 */
export function mProcess(data) {
  return request({
    url: 'api/pay/approve',
    method: 'post',
    data
  })
}

/**
 * 详情
 * @param id
 */
export function getDetail(id) {
  return request({
    url: `api/pay/${id}`,
    method: 'get'
  })
}

export default { add, edit, del, mProcess, getDetail, checkA, batchinvalid, batchApproval, payment }

