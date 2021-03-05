import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/goodsBrand',
    method: 'post',
    data
  })
}

export function getBrandDowndrop() {
  return request({
    url: 'api/goodsBrand/brand-downdrop',
    method: 'post'
  })
}

export function del(ids) {
  return request({
    url: 'api/goodsBrand/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/goodsBrand',
    method: 'put',
    data
  })
}

export default { add, edit, del, getBrandDowndrop }
