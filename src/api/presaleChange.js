import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/presaleChange',
    method: 'post',
    data
  })
}

/**
 * 保存数据
 * @param data
 */
export function saveData(data) {
  return request({
    url: 'api/presaleChange/add',
    method: 'post',
    data
  })
}

/**
 * 获取对象信息
 * @param presaleChangeId
 */
export function get(presaleChangeId) {
  return request({
    url: 'api/presaleChange/get/' + presaleChangeId,
    method: 'post'
  })
}

/**
 * 发起审批 - 单个
 * @param presaleChangeId
 */
export function approval(presaleChangeId) {
  return request({
    url: 'api/presaleChange/approval/' + presaleChangeId,
    method: 'post'
  })
}

/**
 * 批量审批
 * @param batchIds
 */
export function batchApproval(presaleChangeIds) {
  return request({
    url: 'api/presaleChange/batch-approval',
    method: 'post',
    data: presaleChangeIds
  })
}

export function del(ids) {
  return request({
    url: 'api/presaleChange/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/presaleChange',
    method: 'put',
    data
  })
}

export default { add, edit, del, saveData, get, approval, batchApproval }
