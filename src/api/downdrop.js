import request from '@/utils/request'
import { isDimensionStacked } from 'echarts/src/data/helper/dataStackHelper'

export function downdropList(downdropType) {
  return request({
    url: 'api/' + downdropType,
    method: 'post'
  })
}
export default { downdropList }
