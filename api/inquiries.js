import { createInquiryHandler } from '../server/inquiries.mjs'

export default createInquiryHandler({ webhook: process.env.CREATOR_INQUIRY_WEBHOOK })
