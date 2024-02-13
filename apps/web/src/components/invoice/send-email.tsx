import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Tailwind,
  Preview,
  Row,
  Section,
  Text
} from '@react-email/components'
import { formatAmount, formatDate } from 'helper/format'
import jwt from 'jsonwebtoken'

interface EmailTemplateProps {
  invoiceData: any
}

const baseURI = process.env.NEXT_PUBLIC_API_URL

export const EmailTemplate = ({ invoiceData }: EmailTemplateProps) => {
  const tokenForApprove = jwt.sign(
    { invoiceId: invoiceData.id, status: 'APPROVED', customer: true },
    process.env.INVOICE_APPROVAL_SECRET_KEY || '',
    { expiresIn: '24h' }
  )

  const tokenForReject = jwt.sign(
    { invoiceId: invoiceData.id, status: 'REJECTED', customer: true },
    process.env.INVOICE_APPROVAL_SECRET_KEY || '',
    { expiresIn: '24h' }
  )

  return (
    <Html>
      <Head />
      <Preview>Confirm Your Invoice</Preview>
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans px-2'>
          <Container className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[565px]'>
            <Heading className='text-black text-[24px] font-normal text-center p-0 my-[12px] mx-0'>
              Confirm Your Invoice{' '}
              <strong>INV-{invoiceData?.invoiceNumber}</strong>
            </Heading>
            <Section className='my-6 px-[12px]'>
              <Text className='text-black text-[14px] leading-[18px]'>
                Invoice from {invoiceData?.organization?.orgName || '-'}
              </Text>
              <Text className='text-black text-[24px] leading-[24px]'>
                <strong>{formatAmount(invoiceData?.totalAmount || 0)}</strong>
              </Text>
              <Text className='text-gray-700 text-[12px] leading-[16px]'>
                Due Date: {formatDate(invoiceData?.dueDate)}
              </Text>
              <Row className='border-b border-black'>
                <Column align='left' style={{ width: '33%' }} colSpan={1}>
                  <Text className='text-black font-medium text-[12px] leading-[12px]'>
                    Items
                  </Text>
                </Column>
                <Column style={{ width: '33%' }} colSpan={1} align='center'>
                  <Text className='text-black font-medium text-[12px] leading-[12px]'>
                    Quantity
                  </Text>
                </Column>
                <Column style={{ width: '33%' }} colSpan={1} align='right'>
                  <Text className='text-black font-medium text-[12px] leading-[12px]'>
                    Price
                  </Text>
                </Column>
              </Row>
              <Hr />
              {invoiceData?.items &&
                invoiceData?.items.map((item: any) => {
                  return (
                    <Row key={item?.id} className=' border-b border-black'>
                      <Column align='left' style={{ width: '33%' }} colSpan={1}>
                        <Text className='text-[12px]'>{item?.name || '-'}</Text>
                      </Column>
                      <Column
                        align='center'
                        style={{ width: '33%' }}
                        colSpan={1}
                      >
                        <Text className='text-[12px]'>
                          {item?.quantity || '-'}
                        </Text>
                      </Column>
                      <Column
                        align='right'
                        style={{ width: '33%' }}
                        colSpan={1}
                      >
                        <Text className='text-[12px]'>
                          {formatAmount(item?.price || 0)}
                        </Text>
                      </Column>
                    </Row>
                  )
                })}
            </Section>
            <Section className='mt-6'>
              <Row className='max-w-[300px]'>
                <Column align='left' style={{ width: '50%' }} colSpan={1}>
                  <Button
                    href={
                      baseURI +
                      '/invoice-approval?token=' +
                      tokenForApprove +
                      '&status=approve'
                    }
                    className='bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3'
                  >
                    Approve Invoice
                  </Button>
                </Column>
                <Column align='right' style={{ width: '50%' }} colSpan={1}>
                  <Button
                    href={
                      baseURI +
                      '/invoice-approval?token=' +
                      tokenForReject +
                      '&status=reject'
                    }
                    className='bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3'
                  >
                    Reject Invoice
                  </Button>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
