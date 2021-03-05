import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/systemCity',
    method: 'post',
    data
  })
}

export function all() {
  return request({
    url: 'api/systemCity/all',
    method: 'post'
  })
}

export function del(ids) {
  return request({
    url: 'api/systemCity/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/systemCity',
    method: 'put',
    data
  })
}

export default { add, edit, del, all }
