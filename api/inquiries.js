import { createInquiryHandler } from '../server/inquiries.mjs'
import { createChannelDelivery } from '../server/delivery.mjs'

const webhook = process.env.CREATOR_INQUIRY_WEBHOOK
export default createInquiryHandler({ webhook, deliver: webhook ? null : createChannelDelivery(process.env) })
