import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/temporaryFeeProject',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/temporaryFeeProject/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/temporaryFeeProject',
    method: 'put',
    data
  })
}

export function getProjectDowndrop() {
  return request({
    url: 'api/temporaryFeeProject/project-downdrop',
    method: 'post'
  })
}

export default { add, edit, del, getProjectDowndrop }
