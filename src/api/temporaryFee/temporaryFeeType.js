import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/temporaryFeeType',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/temporaryFeeType/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/temporaryFeeType',
    method: 'put',
    data
  })
}

export function getTypeDowndrop() {
  return request({
    url: 'api/temporaryFeeType/type-downdrop',
    method: 'post'
  })
}
export default { add, edit, del, getTypeDowndrop }
