import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/goods',
    method: 'post',
    data
  })
}

/**
 * 根据供应商ID获取商品列表
 * @param data
 */
export function getByMerchantId(merchantId) {
  return request({
    url: 'api/goods/getby-merhcant-id/' + merchantId,
    method: 'post'
  })
}

export function del(ids) {
  return request({
    url: 'api/goods/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/goods',
    method: 'put',
    data
  })
}

export default { add, edit, del, getByMerchantId }
