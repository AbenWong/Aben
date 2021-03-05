import request from '@/utils/request'

export function getDepts(params) {
  return request({
    url: 'api/dept',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/dept',
    method: 'post',
    data
  })
}

/**
 * all
 * @param pid
 */
export function all() {
  return request({
    url: 'api/dept/all',
    method: 'post'
  })
}

export function del(ids) {
  return request({
    url: 'api/dept',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/dept',
    method: 'put',
    data
  })
}

export default { add, edit, del, getDepts, all }
