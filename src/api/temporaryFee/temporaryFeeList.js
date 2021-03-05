import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/temporaryFeeList',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/temporaryFeeList/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/temporaryFeeList',
    method: 'put',
    data
  })
}

export function addList(data) {
  return request({
    url: 'api/temporaryFeeList/add',
    method: 'post',
    data
  })
}

export function getInfo(temporaryFeeListId) {
  return request({
    url: 'api/temporaryFeeList/get/' + temporaryFeeListId,
    method: 'post'
  })
}

/**
 * 单个审批
 * @param batchId
 */
export function approval(temporaryFeeListId) {
  return request({
    url: 'api/temporaryFeeList/approval/' + temporaryFeeListId,
    method: 'post'
  })
}

/**
 * 批量审批
 * @param batchIds
 */
export function batchApproval(listIds) {
  return request({
    url: 'api/temporaryFeeList/list-approval',
    method: 'post',
    data: listIds
  })
}

export default { add, edit, addList, getInfo, approval, batchApproval }
