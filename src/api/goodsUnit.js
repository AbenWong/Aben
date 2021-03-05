import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/goodsUnit',
    method: 'post',
    data
  })
}

export function getUnitDowndrop() {
  return request({
    url: 'api/goodsUnit/unit-downdrop',
    method: 'post'
  })
}

export function del(ids) {
  return request({
    url: 'api/goodsUnit/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/goodsUnit',
    method: 'put',
    data
  })
}

export default { add, edit, del, getUnitDowndrop }
