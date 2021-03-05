import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/goodsBatch',
    method: 'post',
    data
  })
}

export function addBatch(data) {
  return request({
    url: 'api/goodsBatch/add',
    method: 'post',
    data
  })
}

export function getInfo(batchId) {
  return request({
    url: 'api/goodsBatch/get/' + batchId,
    method: 'post'
  })
}

/**
 * 单个审批
 * @param batchId
 */
export function approval(batchId) {
  return request({
    url: 'api/goodsBatch/approval/' + batchId,
    method: 'post'
  })
}

/**
 * 批量审批
 * @param batchIds
 */
export function batchApproval(batchIds) {
  return request({
    url: 'api/goodsBatch/batch-approval',
    method: 'post',
    data: batchIds
  })
}

export function del(ids) {
  return request({
    url: 'api/goodsBatch/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/goodsBatch',
    method: 'put',
    data
  })
}

export default { add, edit, del, addBatch, getInfo, approval, batchApproval }
