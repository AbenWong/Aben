import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/goodsType',
    method: 'post',
    data
  })
}

export function all() {
  return request({
    url: 'api/goodsType/all',
    method: 'post'
  })
}

export function del(ids) {
  return request({
    url: 'api/goodsType/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/goodsType',
    method: 'put',
    data
  })
}

export default { add, edit, del, all }
