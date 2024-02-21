import { db } from '@/lib/db'
import { ImageResponse } from '@vercel/og'
import { formatAmountWithRs, formatDate, numTowords } from 'helper/format'
// export const runtime = 'edge'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id
    const invoice = await db.invoice.findUnique({
      where: {
        id: invoiceId
      },
      select: {
        id: true,
        organization: true,
        customerInfo: true,
        dateIssue: true,
        dueDate: true,
        invoiceNumber: true,
        notes: true,
        paymentMethod: true,
        shippingCharge: true,
        packagingCharge: true,
        dueAmount: true,
        adjustmentFee: true,
        invoiceTotal: true,
        subTotal: true,
        totalAmount: true,
        items: true,
        discount: true
      }
    })

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white'
          }}
        >
          <div tw='flex flex-col p-6 w-full'>
            <div tw='flex justify-between items-center w-full'>
              <h1 tw='font-extrabold text-3xl'>
                {invoice?.organization.orgName || '-'}
              </h1>

              <div tw='flex flex-col items-end text-xs text-gray-500'>
                <p tw='text-black font-medium text-sm p-0 m-0'>
                  {invoice?.organization.orgName || '-'}
                </p>
                <p tw='p-0 m-0'>{invoice?.organization.email || '-'}</p>
                <p tw='p-0 m-0'>{invoice?.organization.pan || '-'}</p>
              </div>
            </div>

            <div tw='flex justify-between text-xs items-center mt-8 w-full'>
              <div tw='flex flex-col'>
                <p tw='font-bold text-gray-800 p-0 m-0'>Bill to :</p>
                <p tw='text-gray-500 p-0 m-0'>
                  {invoice?.customerInfo.legalName || '-'}
                </p>
                <p tw='text-gray-500 p-0 m-0'>
                  {invoice?.customerInfo.email || '-'}
                </p>
                <p tw='text-gray-500 p-0 m-0'>
                  {invoice?.customerInfo.whatsAppNumber || '-'}
                </p>
              </div>

              <div tw='flex flex-col items-end p-0 m-0'>
                <p tw='p-0 m-0'>
                  Invoice number:
                  <span tw='text-gray-500 ml-1'>
                    INV-{invoice?.invoiceNumber}
                  </span>
                </p>
                <p tw='p-0 m-0'>
                  Invoice date:{' '}
                  <span tw='text-gray-500 ml-1'>
                    {formatDate(invoice?.dateIssue)}
                  </span>
                </p>
                <p tw='p-0 m-0'>
                  Due date:
                  <span tw='text-gray-500 ml-1'>
                    {formatDate(invoice?.dueDate)}
                  </span>
                </p>
              </div>
            </div>

            <div tw='mt-12 flex flex-col w-full min-h-[460px]'>
              <table tw='w-full flex flex-col items-end'>
                <thead tw='border-b border-gray-300 text-gray-900'>
                  <tr>
                    <th tw='text-left text-sm font-semibold text-gray-900 w-1/2'>
                      Items
                    </th>
                    <th tw='text-sm font-semibold text-center text-gray-900 w-1/6'>
                      Quantity
                    </th>
                    <th tw='text-sm text-gray-900 text-center w-1/6'>Price</th>
                    <th tw='text-right text-sm font-semibold text-gray-900 w-1/6'>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody tw='flex flex-col'>
                  {invoice?.items.map((item) => {
                    return (
                      <tr
                        key={item?.id}
                        tw='border-b border-gray-200 text-sm mt-2 pb-2'
                      >
                        <td tw='text-left w-1/2'>
                          <div tw='font-medium text-gray-900'>{item.name}</div>
                        </td>
                        <td tw='text-center text-sm text-gray-500 w-1/6'>
                          {item.quantity}
                        </td>
                        <td tw='text-center text-sm text-gray-500 w-1/6'>
                          {formatAmountWithRs(item?.price || 0)}
                        </td>
                        <td tw='text-right text-sm text-gray-500 w-1/6'>
                          {formatAmountWithRs(item?.total || 0)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot tw='flex flex-col w-full max-w-1/2 mt-6'>
                  <tr tw='flex justify-between'>
                    <th tw='text-left text-sm font-normal text-gray-500'>
                      Subtotal
                    </th>
                    <td tw='text-right text-sm text-gray-500 sm:pr-0'>
                      {formatAmountWithRs(invoice?.subTotal || 0)}
                    </td>
                  </tr>
                  <tr tw='flex justify-between'>
                    <th tw='text-right text-sm font-normal text-gray-500'>
                      Adjustment Fee
                    </th>
                    <td tw='text-right text-sm text-gray-500 sm:pr-0'>
                      {formatAmountWithRs(invoice?.adjustmentFee || 0)}
                    </td>
                  </tr>
                  <tr tw='flex justify-between'>
                    <th tw='text-right text-sm font-normal text-gray-500'>
                      Packaging Charge
                    </th>
                    <td tw='text-right text-sm text-gray-500 sm:pr-0'>
                      {formatAmountWithRs(invoice?.packagingCharge || 0)}
                    </td>
                  </tr>
                  <tr tw='flex justify-between'>
                    <th tw='text-right text-sm font-normal text-gray-500'>
                      Shipping Charge
                    </th>
                    <td tw='text-right text-sm text-gray-500 sm:pr-0'>
                      {formatAmountWithRs(invoice?.shippingCharge || 0)}
                    </td>
                  </tr>
                  <tr tw='flex justify-between'>
                    <th tw='text-right text-sm font-semibold text-gray-900'>
                      Total
                    </th>
                    <td tw='text-right text-sm font-semibold text-gray-900'>
                      {formatAmountWithRs(invoice?.totalAmount || 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div tw='mt-4 w-full flex justify-center mt-2'>
              <p tw='text-[#718096] text-xs px-4 w-full'>
                Total Amount (in words) :
                {numTowords.convert(invoice?.totalAmount || 0, {
                  currency: true
                })}
              </p>
            </div>
            <div tw='my-2 w-full flex justify-center'>
              <p tw='text-xs text-gray-500'>
                Please pay the invoice before the due date.
              </p>
            </div>
          </div>
        </div>
      ),
      {
        width: 680,
        height: 860
      }
    )
  } catch (e) {
    console.error(e)
    return Response.json({
      data: null,
      status: 500,
      ok: false
    })
  }
}