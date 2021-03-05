import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/settlement',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/settlement',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/settlement',
    method: 'put',
    data
  })
}

export function editSettlement(data) {
  return request({
    url: 'api/settlement/center',
    method: 'put',
    data
  })
}

/**
 * 单个审批
 * @param batchId
 */
export function approval(data) {
  return request({
    url: 'api/settlement/approval',
    method: 'post',
    data
  })
}

/**
 * 批量作废
 * @param data
 */
export function invalidApprove(data) {
  return request({
    url: 'api/settlement/approve/invalid',
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
    url: `api/settlement/${id}`,
    method: 'get'
  })
}

/**
 * 下拉列表
 */
export function selectList() {
  return request({
    url: 'api/settlement/select/list',
    method: 'get'
  })
}

export default { add, edit, del, approval, invalidApprove, getDetail, selectList }

